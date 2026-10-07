import { describe, expect, expectTypeOf, it } from "vitest";

import type { VariantsOf } from "./types.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";
import { createThemedRecipes } from "./themed-recipes.js";

const control = createStyleRecipe({
  base: { borderRadius: 8 },
  variants: {
    size: { sm: { height: 32 }, md: { height: 40 } },
    disabled: { true: { opacity: 0.5 } },
  },
  compoundVariants: [
    { variants: { size: "md", disabled: true }, style: { borderWidth: 1 } },
  ],
  defaultVariants: { size: "md" },
});

const button = createStyleRecipe({
  composes: [control],
  base: { alignItems: "center" },
  variants: {
    size: { md: { paddingHorizontal: 16 }, lg: { height: 48 } },
    tone: {
      primary: { backgroundColor: "#2563eb" },
      neutral: { backgroundColor: "#f3f4f6" },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "primary", disabled: true },
      style: { backgroundColor: "#93c5fd" },
    },
  ],
  defaultVariants: { tone: "primary" },
});

const field = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: { root: { gap: 4 }, label: { fontSize: 14 } },
  variants: { invalid: { true: { label: { color: "#b91c1c" } } } },
});

const select = createSlotStyleRecipe({
  composes: [field],
  slots: ["trigger"],
  base: { trigger: { height: 40 } },
  variants: {
    invalid: {
      true: {
        root: { borderColor: "#b91c1c" },
        trigger: { borderColor: "#b91c1c" },
      },
    },
    dense: { true: { trigger: { height: 32 } } },
  },
});

describe("a style recipe that composes recipes", () => {
  it("merges the styles of each config as one config would", () => {
    expect(Object.entries(button({ disabled: true }))).toStrictEqual([
      ["borderRadius", 8],
      ["alignItems", "center"],
      ["height", 40],
      ["paddingHorizontal", 16],
      ["opacity", 0.5],
      ["backgroundColor", "#93c5fd"],
      ["borderWidth", 1],
    ]);
    expect(button({ size: "lg", tone: "neutral" })).toStrictEqual({
      borderRadius: 8,
      alignItems: "center",
      height: 48,
      backgroundColor: "#f3f4f6",
    });
  });

  it("returns the same frozen style for the same variants", () => {
    const style = button({ size: "sm" });

    expect(Object.isFrozen(style)).toBe(true);
    expect(button({ size: "sm" })).toBe(style);
  });

  it("leaves the recipes it composes unchanged", () => {
    expect(control()).toStrictEqual({ borderRadius: 8, height: 40 });
    expect(control({ size: "sm", disabled: true })).toStrictEqual({
      borderRadius: 8,
      height: 32,
      opacity: 0.5,
    });
  });

  it("accepts the variants of every config", () => {
    expect(button.variantKeys).toStrictEqual(["size", "disabled", "tone"]);
    expect(button.variantOptions.size).toStrictEqual(["sm", "md", "lg"]);
    expectTypeOf<VariantsOf<typeof button>>().toEqualTypeOf<{
      readonly size?: "sm" | "md" | "lg" | undefined;
      readonly disabled?: boolean | "true" | "false" | undefined;
      readonly tone?: "primary" | "neutral" | undefined;
    }>();
  });

  it("returns the properties that every config declares", () => {
    expectTypeOf(button).returns.toEqualTypeOf<{
      readonly borderRadius?: 8;
      readonly height?: 32 | 40 | 48;
      readonly opacity?: 0.5;
      readonly borderWidth?: 1;
      readonly alignItems?: "center";
      readonly paddingHorizontal?: 16;
      readonly backgroundColor?: "#2563eb" | "#f3f4f6" | "#93c5fd";
    }>();
  });

  it("composes a recipe that composes others, each once", () => {
    const iconButton = createStyleRecipe({
      composes: [button, control],
      variants: { shape: { square: { width: 40 } } },
    });

    expect(Object.entries(iconButton({ shape: "square" }))).toStrictEqual([
      ["borderRadius", 8],
      ["alignItems", "center"],
      ["height", 40],
      ["paddingHorizontal", 16],
      ["backgroundColor", "#2563eb"],
      ["width", 40],
    ]);
  });

  it("caches its styles unless its config turns the cache off", () => {
    const uncached = createStyleRecipe({
      composes: [control],
      variants: {},
      cache: false,
    });
    const cached = createStyleRecipe({ composes: [uncached], variants: {} });

    expect(uncached()).not.toBe(uncached());
    expect(uncached()).toStrictEqual({ borderRadius: 8, height: 40 });
    expect(cached()).toBe(cached());
  });

  it("composes only style recipes without slots", () => {
    expect(() =>
      // @ts-expect-error: a style recipe composes no slot style recipe.
      createStyleRecipe({ composes: [field], variants: {} }),
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: a function is not a recipe.
      createStyleRecipe({ composes: [(): object => ({})], variants: {} }),
    ).toThrow(TypeError);
  });

  it("rejects an option that no config declares", () => {
    const recipe = createStyleRecipe({
      composes: [control],
      variants: {},
      // @ts-expect-error: "xl" is not an option of size.
      compoundVariants: [{ variants: { size: "xl" }, style: { width: 4 } }],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      borderRadius: 8,
      height: 32,
    });
  });
});

describe("a slot style recipe that composes slot style recipes", () => {
  it("has the slots of every config, theirs first", () => {
    expect(Object.entries(select({ invalid: true }))).toStrictEqual([
      ["root", { gap: 4, borderColor: "#b91c1c" }],
      ["label", { fontSize: 14, color: "#b91c1c" }],
      ["trigger", { height: 40, borderColor: "#b91c1c" }],
    ]);
    expectTypeOf(select).returns.toEqualTypeOf<{
      readonly root: { readonly gap?: 4; readonly borderColor?: "#b91c1c" };
      readonly label: { readonly fontSize?: 14; readonly color?: "#b91c1c" };
      readonly trigger: {
        readonly height?: 40 | 32;
        readonly borderColor?: "#b91c1c";
      };
    }>();
  });

  it("returns the same frozen styles for the same variants", () => {
    const styles = select({ dense: true });

    expect(Object.isFrozen(styles)).toBe(true);
    expect(Object.isFrozen(styles.trigger)).toBe(true);
    expect(select({ dense: true })).toBe(styles);
  });

  it("accepts the variants of every config", () => {
    expect(select.variantKeys).toStrictEqual(["invalid", "dense"]);
    expectTypeOf<VariantsOf<typeof select>>().toEqualTypeOf<{
      readonly invalid?: boolean | "true" | "false" | undefined;
      readonly dense?: boolean | "true" | "false" | undefined;
    }>();
  });

  it("composes only slot style recipes", () => {
    expect(() =>
      // @ts-expect-error: a slot style recipe composes no style recipe.
      createSlotStyleRecipe({ composes: [control], slots: [], variants: {} }),
    ).toThrow(TypeError);
  });

  it("rejects a slot that no config declares", () => {
    const labeled = createSlotStyleRecipe({
      composes: [field],
      slots: [],
      // @ts-expect-error: icon is not a slot.
      base: { icon: { width: 16 } },
      variants: {},
    });

    expect(labeled()).toStrictEqual({
      root: { gap: 4 },
      label: { fontSize: 14 },
    });
  });
});

describe("a themed recipe that composes the recipe of its theme", () => {
  interface Theme {
    readonly primary: string;
    readonly radius: number;
  }

  const light: Theme = { primary: "#2563eb", radius: 8 };
  const dark: Theme = { primary: "#60a5fa", radius: 12 };

  const themed = createThemedRecipes<Theme>();

  const surface = themed.createStyleRecipe((theme) => ({
    base: { borderRadius: theme.radius },
    variants: { tone: { primary: { backgroundColor: theme.primary } } },
    defaultVariants: { tone: "primary" },
  }));

  const chip = themed.createStyleRecipe((theme) => ({
    composes: [surface.withTheme(theme)],
    base: { paddingHorizontal: 8 },
    variants: { size: { sm: { height: 20 }, md: { height: 24 } } },
    defaultVariants: { size: "md" },
  }));

  const card = themed.createSlotStyleRecipe((theme) => ({
    slots: ["root"],
    base: { root: { borderRadius: theme.radius } },
    variants: {},
  }));

  const titledCard = themed.createSlotStyleRecipe((theme) => ({
    composes: [card.withTheme(theme)],
    slots: ["title"],
    base: { title: { color: theme.primary } },
    variants: {},
  }));

  it("builds the styles of each theme from the recipe of that theme", () => {
    expect(chip(light)).toStrictEqual({
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: "#2563eb",
      height: 24,
    });
    expect(chip(dark, { size: "sm" })).toStrictEqual({
      borderRadius: 12,
      paddingHorizontal: 8,
      backgroundColor: "#60a5fa",
      height: 20,
    });
    expect(titledCard(dark)).toStrictEqual({
      root: { borderRadius: 12 },
      title: { color: "#60a5fa" },
    });
  });

  it("accepts the variants of every config", () => {
    expect(chip.withTheme(light).variantKeys).toStrictEqual(["tone", "size"]);
    expectTypeOf<VariantsOf<typeof chip>>().toEqualTypeOf<{
      readonly tone?: "primary" | undefined;
      readonly size?: "sm" | "md" | undefined;
    }>();
    expectTypeOf(chip).returns.toEqualTypeOf<{
      readonly borderRadius?: number;
      readonly backgroundColor?: string;
      readonly paddingHorizontal?: 8;
      readonly height?: 20 | 24;
    }>();
  });
});
