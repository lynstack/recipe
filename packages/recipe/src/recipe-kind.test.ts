import { describe, expect, expectTypeOf, it } from "vitest";

import type { KindVariants } from "./recipe-kind.js";
import { createRecipeKind } from "./recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
  finish: (style: Style): Style => Object.freeze(style),
});

const listRecipe = createRecipeKind({
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
});

/** Returns a list recipe kind that counts the results it builds. */
function countingListRecipe(options: { readonly cache?: boolean } = {}): {
  readonly builds: () => number;
  readonly recipe: typeof listRecipe;
} {
  let builds = 0;
  return {
    builds: () => builds,
    recipe: createRecipeKind({
      ...options,
      initial: (): readonly string[] => {
        builds += 1;
        return [];
      },
      reduce: (list: readonly string[], value: string): readonly string[] => [
        ...list,
        value,
      ],
    }),
  };
}

const text = styleRecipe({
  base: { color: "black" },
  variants: {
    size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
    tone: { neutral: { color: "gray" }, danger: { color: "red" } },
    muted: { true: { opacity: 0.6 } },
  },
  compoundVariants: [
    { variants: { size: "lg", muted: true }, value: { fontWeight: 300 } },
    {
      variants: { tone: ["neutral", "danger"], size: "lg" },
      value: { lineHeight: 1.2 },
    },
  ],
  defaultVariants: { size: "sm" },
});

describe(createRecipeKind, () => {
  it("reduces the base and the values of the selected options", () => {
    expect(text({ tone: "danger" })).toStrictEqual({
      color: "red",
      fontSize: 12,
    });
  });

  it("reduces the options' values in order, then the compound values", () => {
    const recipe = listRecipe({
      base: "a",
      variants: { size: { sm: "b", lg: "c" }, tone: { danger: "d" } },
      compoundVariants: [
        { variants: { tone: "danger" }, value: "e" },
        { variants: { size: "sm" }, value: "f" },
        { variants: { size: "lg", tone: "danger" }, value: "g" },
      ],
    });

    expect(recipe({ size: "lg", tone: "danger" })).toStrictEqual([
      "a",
      "c",
      "d",
      "e",
      "g",
    ]);
  });

  it("passes undefined to initial when a recipe has no base", () => {
    const recipe = listRecipe({ variants: { size: { sm: "a" } } });

    expect(recipe({ size: "sm" })).toStrictEqual(["a"]);
  });

  it("calls initial for each result it builds", () => {
    const { builds, recipe } = countingListRecipe();
    const sizes = recipe({ variants: { size: { sm: "a", lg: "b" } } });

    expect(sizes({ size: "sm" })).toStrictEqual(["a"]);
    expect(sizes({ size: "lg" })).toStrictEqual(["b"]);
    expect(builds()).toBe(2);
  });

  it("returns the accumulator without finish", () => {
    const recipe = listRecipe({ variants: { size: { sm: "a" } } });

    expect(recipe({ size: "sm" })).toStrictEqual(["a"]);
    expectTypeOf(recipe).returns.toEqualTypeOf<readonly string[]>();
  });

  it("matches a compound variant that lists several options", () => {
    expect(text({ size: "lg", tone: "neutral" })).toStrictEqual({
      color: "gray",
      fontSize: 24,
      lineHeight: 1.2,
    });
  });

  it("applies default variants when a variant is omitted or undefined", () => {
    expect(text({ tone: "neutral", size: undefined })).toBe(
      text({ tone: "neutral", size: "sm" }),
    );
  });

  it("treats a missing selection as an empty one", () => {
    const recipe = listRecipe({
      variants: { size: { sm: "a" } },
      defaultVariants: { size: "sm" },
    });

    expect(recipe()).toStrictEqual(["a"]);
    // @ts-expect-error: the selection is optional, not nullable.
    expect(recipe(null)).toBe(recipe());
  });

  it("ignores properties of the selection that are not variants", () => {
    const props = { tone: "danger", style: { margin: 0 } } as const;

    expect(text(props)).toBe(text({ tone: "danger" }));
  });

  it("returns the same result for the same selection", () => {
    const { builds, recipe } = countingListRecipe();
    const sizes = recipe({
      variants: { size: { sm: "a", lg: "b" } },
      defaultVariants: { size: "sm" },
    });

    expect(sizes({ size: "sm" })).toBe(sizes());
    expect(builds()).toBe(1);
  });

  it("caches the results of each recipe on its own", () => {
    const { builds, recipe } = countingListRecipe();
    const first = recipe({ variants: { size: { sm: "a" } } });
    const second = recipe({ variants: { size: { sm: "b" } } });

    expect(first({ size: "sm" })).toStrictEqual(["a"]);
    expect(second({ size: "sm" })).toStrictEqual(["b"]);
    expect(builds()).toBe(2);
  });

  it("builds the result on every call without the cache", () => {
    const { builds, recipe } = countingListRecipe({ cache: false });
    const sizes = recipe({ variants: { size: { sm: "a" } } });

    expect(sizes({ size: "sm" })).toStrictEqual(sizes({ size: "sm" }));
    expect(builds()).toBe(2);
  });

  it("adds nothing for an undeclared option and does not cache it", () => {
    const { builds, recipe } = countingListRecipe();
    const sizes = recipe({
      variants: { size: { sm: "a" }, tone: { danger: "b" } },
    });

    // @ts-expect-error: "xl" is not an option of size.
    expect(sizes({ size: "xl", tone: "danger" })).toStrictEqual(["b"]);
    // @ts-expect-error: "xl" is not an option of size.
    expect(sizes({ size: "xl", tone: "danger" })).toStrictEqual(["b"]);
    expect(builds()).toBe(2);
  });

  it("ignores changes to the config after the recipe is created", () => {
    const options: Record<string, string> = { sm: "a" };
    const recipe = listRecipe({ variants: { size: options } });

    options["sm"] = "b";

    expect(recipe({ size: "sm" })).toStrictEqual(["a"]);
  });

  it("lists its variant names in variantKeys", () => {
    expect(text.variantKeys).toStrictEqual(["size", "tone", "muted"]);
    expectTypeOf(text.variantKeys).toEqualTypeOf<
      readonly ("size" | "tone" | "muted")[]
    >();
  });

  it("infers the selection and the result", () => {
    expect(text({ tone: "neutral" })).toStrictEqual({
      color: "gray",
      fontSize: 12,
    });
    expectTypeOf(text).parameter(0).toEqualTypeOf<{
      readonly tone: "neutral" | "danger";
      readonly size?: "sm" | "lg" | undefined;
      readonly muted?: boolean | "true" | "false" | undefined;
    }>();
    expectTypeOf(text).returns.toEqualTypeOf<Style>();
  });

  it("accepts any selection when the variant names are not known", () => {
    const variants: KindVariants<string> = { size: { sm: "a" } };
    const recipe = listRecipe({
      variants,
      compoundVariants: [{ variants: { size: true }, value: "b" }],
      defaultVariants: { size: "sm" },
    });

    expectTypeOf(recipe)
      .parameter(0)
      .toEqualTypeOf<Readonly<Record<string, unknown>> | undefined>();
    expectTypeOf(recipe.variantKeys).toEqualTypeOf<readonly string[]>();
    expect(recipe({ size: "sm", other: 1 })).toStrictEqual(["a"]);
  });

  it("rejects an option that a variant does not declare", () => {
    expect(
      // @ts-expect-error: "xl" is not an option of size.
      text({ tone: "neutral", size: "xl" }),
    ).toStrictEqual({ color: "gray" });
  });

  it("requires a variant without a default", () => {
    // @ts-expect-error: tone has no default.
    expect(text({ size: "lg" })).toStrictEqual({
      color: "black",
      fontSize: 24,
    });
  });

  it("rejects a base of another type than the kind's values", () => {
    const recipe = listRecipe({
      // @ts-expect-error: the kind's values are strings, not numbers.
      base: 1,
      variants: { size: { sm: "a" } },
    });

    expect(recipe({ size: "sm" })).toStrictEqual([1, "a"]);
  });

  it("rejects an option value of another type than the kind's values", () => {
    const recipe = listRecipe({
      // @ts-expect-error: the kind's values are strings, not numbers.
      variants: { size: { sm: 1 } },
    });

    expect(recipe({ size: "sm" })).toStrictEqual([1]);
  });

  it("rejects a compound value of another type than the kind's values", () => {
    const recipe = listRecipe({
      variants: { size: { sm: "a" } },
      // @ts-expect-error: the kind's values are strings, not numbers.
      compoundVariants: [{ variants: { size: "sm" }, value: 1 }],
    });

    expect(recipe({ size: "sm" })).toStrictEqual(["a", 1]);
  });
});
