import { describe, expect, expectTypeOf, it } from "vitest";

import type { VariantsOf } from "./types.js";
import { createThemedRecipes } from "./themed-recipes.js";

interface Theme {
  readonly colors: { readonly primary: string; readonly surface: string };
  readonly radius: number;
}

const light: Theme = {
  colors: { primary: "#2563eb", surface: "#ffffff" },
  radius: 8,
};

const dark: Theme = {
  colors: { primary: "#60a5fa", surface: "#111827" },
  radius: 8,
};

const { createSlotStyleRecipe, createStyleRecipe } =
  createThemedRecipes<Theme>();

const button = createStyleRecipe((theme) => ({
  base: { borderRadius: theme.radius, fontWeight: "600" },
  variants: {
    tone: {
      primary: { backgroundColor: theme.colors.primary },
      surface: { backgroundColor: theme.colors.surface },
    },
    size: { sm: { height: 32 }, md: { height: 40 } },
  },
  compoundVariants: [
    { variants: { tone: "surface", size: "md" }, style: { borderWidth: 1 } },
  ],
  defaultVariants: { size: "md" },
}));

const card = createSlotStyleRecipe((theme) => ({
  slots: ["root", "title"],
  base: { root: { borderRadius: theme.radius }, title: { fontSize: 16 } },
  variants: {
    raised: {
      true: { root: { backgroundColor: theme.colors.surface } },
    },
  },
}));

describe(createThemedRecipes, () => {
  it("builds the styles of a selection from the theme", () => {
    expect(button(light, { tone: "surface" })).toStrictEqual({
      borderRadius: 8,
      fontWeight: "600",
      backgroundColor: "#ffffff",
      height: 40,
      borderWidth: 1,
    });
    expect(button(dark, { tone: "surface", size: "sm" })).toStrictEqual({
      borderRadius: 8,
      fontWeight: "600",
      backgroundColor: "#111827",
      height: 32,
    });
  });

  it("returns the same frozen object for the same theme and selection", () => {
    const first = button(light, { tone: "primary" });

    expect(button(light, { tone: "primary", size: "md" })).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
  });

  it("keeps the styles of each theme apart", () => {
    expect(button(light, { tone: "primary" })).not.toBe(
      button(dark, { tone: "primary" }),
    );
  });

  it("keeps the cache of a theme when another theme is used", () => {
    const first = button(light, { tone: "surface" });
    button(dark, { tone: "surface" });

    expect(button(light, { tone: "surface" })).toBe(first);
  });

  it("builds the config of each theme once", () => {
    let builds = 0;
    const recipe = createStyleRecipe((theme) => {
      builds += 1;
      return {
        variants: { tone: { primary: { color: theme.colors.primary } } },
      };
    });

    recipe(light, { tone: "primary" });
    recipe(dark, { tone: "primary" });
    recipe(light, { tone: "primary" });
    recipe(dark, { tone: "primary" });

    expect(builds).toBe(2);
  });

  it("builds nothing until it is called with a theme", () => {
    let builds = 0;
    createStyleRecipe((theme) => {
      builds += 1;
      return {
        variants: { tone: { primary: { color: theme.colors.primary } } },
      };
    });

    expect(builds).toBe(0);
  });

  it("returns the recipe of a theme, the same for the same theme", () => {
    const recipe = button.withTheme(light);

    expect(button.withTheme(light)).toBe(recipe);
    expect(button.withTheme(dark)).not.toBe(recipe);
    expect(recipe({ tone: "primary" })).toBe(
      button(light, { tone: "primary" }),
    );
    expect(recipe.variantKeys).toStrictEqual(["tone", "size"]);
  });

  it("lists the options and defaults of the recipe of a theme", () => {
    const recipe = button.withTheme(light);

    expect(recipe.variantOptions).toStrictEqual({
      tone: ["primary", "surface"],
      size: ["sm", "md"],
    });
    expect(recipe.defaultVariants).toStrictEqual({ size: "md" });
    expectTypeOf(recipe.defaultVariants).toEqualTypeOf<{
      readonly size: "sm" | "md";
    }>();
  });

  it("builds slot styles from the theme", () => {
    expect(card(dark, { raised: true })).toStrictEqual({
      root: { borderRadius: 8, backgroundColor: "#111827" },
      title: { fontSize: 16 },
    });
    expect(card(light)).toBe(card(light, { raised: false }));
  });

  it("infers the variants and the styles from the config", () => {
    expect(button(light, { tone: "primary" }).height).toBe(40);
    expectTypeOf<VariantsOf<typeof button>>().toEqualTypeOf<{
      readonly tone: "primary" | "surface";
      readonly size?: "sm" | "md" | undefined;
    }>();
    expectTypeOf(button).returns.toEqualTypeOf<{
      readonly borderRadius?: number;
      readonly fontWeight?: "600";
      readonly backgroundColor?: string;
      readonly height?: 32 | 40;
      readonly borderWidth?: 1;
    }>();
    expectTypeOf(button.withTheme(light)).parameter(0).toEqualTypeOf<{
      readonly tone: "primary" | "surface";
      readonly size?: "sm" | "md" | undefined;
    }>();
  });

  it("infers the slots and their styles from the config", () => {
    expect(card(light).title.fontSize).toBe(16);
    expectTypeOf<VariantsOf<typeof card>>().toEqualTypeOf<{
      readonly raised?: boolean | "true" | "false" | undefined;
    }>();
    expectTypeOf(card).returns.toEqualTypeOf<{
      readonly root: {
        readonly borderRadius?: number;
        readonly backgroundColor?: string;
      };
      readonly title: { readonly fontSize?: 16 };
    }>();
  });

  it("requires the variants without a default", () => {
    // @ts-expect-error tone has no default, so it is required
    expect(button(light)).toStrictEqual({
      borderRadius: 8,
      fontWeight: "600",
      height: 40,
    });
  });

  it("requires a theme", () => {
    // @ts-expect-error the theme is required
    expect(() => button({ tone: "primary" })).toThrow(TypeError);
    // @ts-expect-error the theme lacks colors
    expect(() => button({ radius: 8 }, { tone: "primary" })).toThrow(TypeError);
  });

  it("rejects properties that no style has", () => {
    const variantStyle = createStyleRecipe((theme) => ({
      // @ts-expect-error colour is not a style property
      variants: { tone: { primary: { colour: theme.colors.primary } } },
    }));
    const baseStyle = createStyleRecipe((theme) => ({
      // @ts-expect-error colour is not a style property
      base: { colour: theme.colors.primary },
      variants: {},
    }));
    const compoundStyle = createStyleRecipe(() => ({
      variants: { tone: { primary: {} } },
      compoundVariants: [
        // @ts-expect-error colour is not a style property
        { variants: { tone: "primary" }, style: { colour: "#000000" } },
      ],
    }));
    const slotStyle = createSlotStyleRecipe((theme) => ({
      slots: ["root"],
      // @ts-expect-error colour is not a style property
      base: { root: { colour: theme.colors.primary } },
      variants: {},
    }));

    expect(variantStyle).toBeTypeOf("function");
    expect(baseStyle).toBeTypeOf("function");
    expect(compoundStyle).toBeTypeOf("function");
    expect(slotStyle).toBeTypeOf("function");
  });

  it("rejects values that a style property does not take in compound variants", () => {
    const compoundStyle = createStyleRecipe((theme) => ({
      variants: { tone: { primary: {} } },
      compoundVariants: [
        {
          variants: { tone: "primary" },
          style: {
            borderRadius: theme.radius,
            // @ts-expect-error "sideways" is not a flex direction
            flexDirection: "sideways",
          },
        },
      ],
    }));
    const compoundSlotStyles = createSlotStyleRecipe((theme) => ({
      slots: ["root"],
      variants: { tone: { primary: {} } },
      compoundVariants: [
        {
          variants: { tone: "primary" },
          styles: {
            root: {
              borderRadius: theme.radius,
              // @ts-expect-error "sideways" is not a flex direction
              flexDirection: "sideways",
            },
          },
        },
      ],
    }));

    expect(compoundStyle(light, { tone: "primary" })).toStrictEqual({
      borderRadius: 8,
      flexDirection: "sideways",
    });
    expect(compoundSlotStyles(light, { tone: "primary" })).toStrictEqual({
      root: { borderRadius: 8, flexDirection: "sideways" },
    });
  });

  it("rejects options, slots, and tokens that do not exist", () => {
    const defaultOption = createStyleRecipe((theme) => ({
      variants: { tone: { primary: { color: theme.colors.primary } } },
      // @ts-expect-error "ghost" is not a tone option
      defaultVariants: { tone: "ghost" },
    }));
    const compoundOption = createStyleRecipe((theme) => ({
      variants: { tone: { primary: { color: theme.colors.primary } } },
      // @ts-expect-error "ghost" is not a tone option
      compoundVariants: [{ variants: { tone: "ghost" }, style: {} }],
    }));
    const slot = createSlotStyleRecipe((theme) => ({
      slots: ["root"],
      variants: {
        // @ts-expect-error header is not a slot
        raised: { true: { header: { color: theme.colors.primary } } },
      },
    }));
    const token = createStyleRecipe((theme) => {
      expectTypeOf(theme).toEqualTypeOf<Theme>();
      expectTypeOf(theme).not.toHaveProperty("spacing");
      return { variants: { size: { sm: { padding: theme.radius } } } };
    });

    expect(defaultOption).toBeTypeOf("function");
    expect(compoundOption).toBeTypeOf("function");
    expect(slot).toBeTypeOf("function");
    expect(token).toBeTypeOf("function");
  });
});
