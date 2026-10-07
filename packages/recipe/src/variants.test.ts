import { describe, expect, expectTypeOf, it } from "vitest";

import type { KindVariants } from "./recipe-kind.js";
import { createRecipeKind } from "./recipe-kind.js";

const listRecipe = createRecipeKind({
  initial: (): readonly string[] => [],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
});

describe("variants", () => {
  it("matches compound conditions against default variants", () => {
    const recipe = listRecipe({
      variants: { tone: { danger: "a" }, size: { sm: "b", md: "c" } },
      compoundVariants: [
        { variants: { tone: "danger", size: "md" }, value: "d" },
      ],
      defaultVariants: { size: "md" },
    });

    expect(recipe({ tone: "danger" })).toStrictEqual(["a", "c", "d"]);
  });

  it("does not match a compound condition on an omitted variant", () => {
    const recipe = listRecipe({
      variants: { tone: { neutral: "a", danger: "b" } },
      compoundVariants: [{ variants: { tone: "danger" }, value: "c" }],
    });

    // @ts-expect-error: tone has no default, so it is required.
    expect(recipe({})).toStrictEqual([]);
  });

  it("makes a boolean variant optional and defaults it to false", () => {
    const recipe = listRecipe({
      variants: {
        disabled: { true: "a", false: "b" },
        loading: { true: "c" },
      },
    });

    expectTypeOf(recipe).parameter(0).toEqualTypeOf<
      | {
          readonly disabled?: "true" | "false" | boolean | undefined;
          readonly loading?: "true" | "false" | boolean | undefined;
        }
      | undefined
    >();
    expect(recipe()).toStrictEqual(["b"]);
    expect(recipe({ loading: "false" })).toStrictEqual(["b"]);
    expect(recipe({ disabled: true, loading: true })).toStrictEqual(["a", "c"]);
    expect(recipe({ disabled: "true", loading: false })).toStrictEqual(["a"]);
  });

  it("matches a compound condition on a boolean variant's default", () => {
    const recipe = listRecipe({
      variants: { loading: { true: "a" }, tone: { danger: "b" } },
      compoundVariants: [
        { variants: { loading: false, tone: "danger" }, value: "c" },
      ],
    });

    expect(recipe({ tone: "danger" })).toStrictEqual(["b", "c"]);
    expect(recipe({ tone: "danger", loading: true })).toStrictEqual(["a", "b"]);
  });

  it("accepts option names that are numbers", () => {
    const recipe = listRecipe({
      variants: { level: { 1: "a", 2: "b" } },
    });

    expectTypeOf(recipe).parameter(0).toEqualTypeOf<{
      readonly level: "1" | "2" | 1 | 2;
    }>();
    expect(recipe({ level: "2" })).toStrictEqual(["b"]);
    expect(recipe({ level: 1 })).toStrictEqual(["a"]);
  });

  it("adds nothing for a value that is undefined", () => {
    const optionalRecipe = createRecipeKind({
      initial: (): readonly (string | undefined)[] => [],
      reduce: (
        list: readonly (string | undefined)[],
        value: string | undefined,
      ) => [...list, value],
    });
    const recipe = optionalRecipe({
      variants: { size: { sm: undefined, md: "a" } },
      compoundVariants: [{ variants: { size: "sm" }, value: undefined }],
    });

    expect(recipe({ size: "sm" })).toStrictEqual([]);
  });

  it("ignores option names inherited from Object.prototype", () => {
    const recipe = listRecipe({
      variants: { size: { sm: "a" } },
    });

    // @ts-expect-error: "toString" is not an option of size.
    expect(recipe({ size: "toString" })).toStrictEqual([]);
  });

  it("never matches a compound condition on an undeclared variant or option", () => {
    const recipe = listRecipe({
      variants: { size: { sm: "a" } },
      compoundVariants: [
        // @ts-expect-error: "xl" is not an option of size.
        { variants: { size: "xl" }, value: "b" },
        // @ts-expect-error: tone is not a variant.
        { variants: { tone: "danger" }, value: "c" },
        { variants: { size: [] }, value: "d" },
      ],
    });

    expect(recipe({ size: "sm" })).toStrictEqual(["a"]);
  });

  it("works without the cache when there are too many selections to key", () => {
    let builds = 0;
    const variants: KindVariants<string> = Object.fromEntries(
      Array.from({ length: 40 }, (_unused, index) => [
        `variant${index}`,
        { first: "a", second: "b", third: "c" },
      ]),
    );
    const countingRecipe = createRecipeKind({
      initial: (): readonly string[] => {
        builds += 1;
        return [];
      },
      reduce: (list: readonly string[], value: string): readonly string[] => [
        ...list,
        value,
      ],
    });
    const recipe = countingRecipe({ variants });

    expect(recipe({ variant0: "second", variant39: "third" })).toStrictEqual([
      "b",
      "c",
    ]);
    expect(recipe({ variant0: "second", variant39: "third" })).toStrictEqual([
      "b",
      "c",
    ]);
    expect(builds).toBe(2);
  });
});

describe("the options and defaults of a recipe's variants", () => {
  const text = listRecipe({
    variants: {
      size: { sm: "sm", lg: "lg" },
      tone: { neutral: "neutral", danger: "danger" },
      muted: { true: "muted" },
    },
    defaultVariants: { size: "sm" },
  });

  it("lists the options of each variant in variantOptions", () => {
    expect(text.variantOptions).toStrictEqual({
      size: ["sm", "lg"],
      tone: ["neutral", "danger"],
      muted: ["false", "true"],
    });
    expect(Object.isFrozen(text.variantOptions)).toBe(true);
    expect(Object.isFrozen(text.variantOptions.size)).toBe(true);
    expectTypeOf(text.variantOptions).toEqualTypeOf<{
      readonly size: readonly ("sm" | "lg")[];
      readonly tone: readonly ("neutral" | "danger")[];
      readonly muted: readonly ("true" | "false")[];
    }>();
  });

  it("lists the options in the order it numbers them", () => {
    const recipe = listRecipe({
      variants: {
        level: { beta: "beta", 2: "2", alpha: "alpha", 1: "1", true: "on" },
      },
    });

    expect(recipe.variantOptions).toStrictEqual({
      level: ["1", "2", "false", "true", "beta", "alpha"],
    });
  });

  it("lists the option each variant uses by default in defaultVariants", () => {
    expect(text.defaultVariants).toStrictEqual({ size: "sm", muted: "false" });
    expect(Object.isFrozen(text.defaultVariants)).toBe(true);
    expectTypeOf(text.defaultVariants).toEqualTypeOf<{
      readonly size: "sm" | "lg";
      readonly muted: "true" | "false";
    }>();
    expect(text({ tone: "neutral", ...text.defaultVariants })).toStrictEqual(
      text({ tone: "neutral" }),
    );
  });

  it("lists its defaults as the names of options", () => {
    const recipe = listRecipe({
      variants: { level: { 1: "one", 2: "two" }, open: { true: "open" } },
      defaultVariants: { level: 2, open: true },
    });

    expect(recipe.defaultVariants).toStrictEqual({ level: "2", open: "true" });
    expectTypeOf(recipe.defaultVariants).toEqualTypeOf<{
      readonly level: "1" | "2";
      readonly open: "true" | "false";
    }>();
  });

  it("lists a default that names an undeclared option", () => {
    const variants: KindVariants<string> = { size: { sm: "sm" } };
    const recipe = listRecipe({ variants, defaultVariants: { size: "xl" } });

    expect(recipe.defaultVariants).toStrictEqual({ size: "xl" });
    expect(recipe()).toStrictEqual([]);
  });

  it("lists every variant and option when the names are not known", () => {
    const variants: KindVariants<string> = { size: { sm: "sm" } };
    const recipe = listRecipe({ variants, defaultVariants: { size: "sm" } });

    expect(recipe.variantOptions).toStrictEqual({ size: ["sm"] });
    expect(recipe.defaultVariants).toStrictEqual({ size: "sm" });
    expectTypeOf(recipe.variantOptions).toEqualTypeOf<
      Readonly<Record<string, readonly string[]>>
    >();
    expectTypeOf(recipe.defaultVariants).toEqualTypeOf<
      Readonly<Record<string, string>>
    >();
  });
});
