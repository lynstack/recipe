import { describe, expect, expectTypeOf, it } from "vitest";

import type { VariantsOf } from "./types.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

const listKind = {
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
};

const listRecipe = createRecipeKind(listKind);

const sumRecipe = createRecipeKind({
  initial: (base: number | undefined): number => base ?? 0,
  reduce: (sum: number, value: number): number => sum + value,
});

const notARecipe = (): readonly string[] => [];

/** Returns a list recipe kind that counts the results it builds. */
function countingListRecipe(options: { readonly cache?: boolean } = {}): {
  readonly builds: () => number;
  readonly recipe: typeof listRecipe;
} {
  let builds = 0;
  return {
    builds: () => builds,
    recipe: createRecipeKind({
      ...listKind,
      ...options,
      initial: (base: string | undefined): readonly string[] => {
        builds += 1;
        return listKind.initial(base);
      },
    }),
  };
}

const control = listRecipe({
  base: "control",
  variants: {
    size: { sm: "control-sm", md: "control-md" },
    disabled: { true: "control-disabled" },
  },
  compoundVariants: [
    { variants: { size: "md", disabled: true }, value: "control-md-disabled" },
  ],
  defaultVariants: { size: "sm" },
});

const button = listRecipe({
  composes: [control],
  base: "button",
  variants: {
    size: { md: "button-md", lg: "button-lg" },
    tone: { neutral: "button-neutral", danger: "button-danger" },
  },
  compoundVariants: [
    { variants: { size: "lg", disabled: true }, value: "button-lg-disabled" },
  ],
  defaultVariants: { tone: "neutral" },
});

describe("a recipe that composes recipes", () => {
  it("reduces the bases, then each option's values, then the compounds", () => {
    expect(button({ size: "md", disabled: true })).toStrictEqual([
      "control",
      "button",
      "control-md",
      "button-md",
      "control-disabled",
      "button-neutral",
      "control-md-disabled",
    ]);
  });

  it("declares the variants and options of every recipe", () => {
    expect(button({ size: "lg", tone: "danger" })).toStrictEqual([
      "control",
      "button",
      "button-lg",
      "button-danger",
    ]);
    expect(button.variantKeys).toStrictEqual(["size", "disabled", "tone"]);
    expect(button.variantOptions).toStrictEqual({
      size: ["sm", "md", "lg"],
      disabled: ["false", "true"],
      tone: ["neutral", "danger"],
    });
    expect(button.defaultVariants).toStrictEqual({
      size: "sm",
      disabled: "false",
      tone: "neutral",
    });
    expectTypeOf<VariantsOf<typeof button>>().toEqualTypeOf<{
      readonly size?: "sm" | "md" | "lg" | undefined;
      readonly disabled?: boolean | "true" | "false" | undefined;
      readonly tone?: "neutral" | "danger" | undefined;
    }>();
  });

  it("uses the default of the last recipe that gives one", () => {
    const large = listRecipe({
      composes: [control],
      variants: {},
      defaultVariants: { size: "md" },
    });

    expect(control()).toStrictEqual(["control", "control-sm"]);
    expect(large()).toStrictEqual(["control", "control-md"]);
  });

  it("matches its compound variants on the variants it composes", () => {
    expect(button({ size: "lg", disabled: true })).toStrictEqual([
      "control",
      "button",
      "button-lg",
      "control-disabled",
      "button-neutral",
      "button-lg-disabled",
    ]);
  });

  it("composes the recipes in order, each once", () => {
    const icon = listRecipe({ base: "icon", variants: {} });
    const iconButton = listRecipe({
      composes: [button, icon, control],
      base: "icon-button",
      variants: {},
    });

    expect(iconButton({ size: "sm" })).toStrictEqual([
      "control",
      "button",
      "icon",
      "icon-button",
      "control-sm",
      "button-neutral",
    ]);
  });

  it("composes a recipe of another kind whose values have its type", () => {
    const { builds, recipe } = countingListRecipe();
    const counted = recipe({ composes: [control], variants: {} });

    expect(counted()).toStrictEqual(["control", "control-sm"]);
    expect(counted()).toBe(counted());
    expect(builds()).toBe(1);
  });

  it("caches its results unless its own config turns the cache off", () => {
    const { builds, recipe } = countingListRecipe();
    const cached = recipe({ variants: { size: { sm: "a" } } });
    const uncached = listRecipe({
      composes: [cached],
      variants: {},
      cache: false,
    });

    expect(uncached({ size: "sm" })).toStrictEqual(["a"]);
    expect(uncached({ size: "sm" })).not.toBe(uncached({ size: "sm" }));
    expect(builds()).toBe(0);
  });

  it("reduces nothing for a recipe without a base", () => {
    const sizes = listRecipe({ variants: { size: { sm: "a" } } });
    const tones = listRecipe({
      composes: [sizes],
      variants: { tone: { danger: "b" } },
    });

    expect(tones({ size: "sm", tone: "danger" })).toStrictEqual(["a", "b"]);
  });

  it("requires a boolean variant that another recipe gives other options", () => {
    const loading = listRecipe({
      composes: [control],
      variants: { disabled: { loading: "control-loading" } },
    });

    expect(loading({ disabled: "loading" })).toStrictEqual([
      "control",
      "control-sm",
      "control-loading",
    ]);
    // @ts-expect-error: disabled is no longer a boolean variant.
    expect(loading()).toStrictEqual(["control", "control-sm"]);
  });

  it("is not changed by a change to a config it composes", () => {
    const options: Record<string, string> = { sm: "a" };
    const sizes = listRecipe({ variants: { size: options } });

    options["sm"] = "b";
    const composed = listRecipe({ composes: [sizes], variants: {} });

    expect(composed({ size: "sm" })).toStrictEqual(["a"]);
  });

  it("composes only the recipes that the engine created", () => {
    const slotList = createSlotRecipeKind(listKind)({
      slots: ["root"],
      variants: {},
    });

    expect(() =>
      // @ts-expect-error: a plain function is not a recipe.
      listRecipe({ composes: [notARecipe], variants: {} }),
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: a recipe composes no slot recipe.
      listRecipe({ composes: [slotList], variants: {} }),
    ).toThrow("A recipe composes only recipes created by @lynstack/recipe.");
  });

  it("rejects a recipe whose values have another type", () => {
    const sizes = sumRecipe({
      // @ts-expect-error: a sum recipe composes no list recipe.
      composes: [control],
      variants: { size: { sm: 1 } },
    });

    expect(sizes({ size: "sm" })).toBe("controlcontrol-sm1");
  });

  it("rejects an option that no recipe declares", () => {
    const sizes = listRecipe({
      composes: [control],
      variants: {},
      // @ts-expect-error: "xl" is not an option of size.
      compoundVariants: [{ variants: { size: "xl" }, value: "a" }],
      // @ts-expect-error: tone is not a variant.
      defaultVariants: { tone: "neutral" },
    });

    expect(sizes({ size: "sm" })).toStrictEqual(["control", "control-sm"]);
  });
});
