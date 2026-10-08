import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  NativeStyle,
  SlotStyles,
  VariantSelection,
  VariantsOf,
} from "./types.js";
import type {
  StyleCompoundVariant,
  StyleRecipeConfig,
  StyleRecipeVariants,
} from "./style-recipe.js";
import type { SlotStyleCompoundVariant } from "./slot-style-recipe.js";
import type { ThemedRecipe } from "./themed-recipes.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";
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
  radius: 12,
};

const themed = createThemedRecipes<Theme>();

/** Creates a themed recipe from any config, as a library's helper does. */
function defineThemed<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: (
    theme: Theme,
  ) => StyleRecipeConfig<Variants, NativeStyle, readonly [], DefaultedName>,
): ThemedRecipe<Theme, VariantSelection<Variants, DefaultedName>, NativeStyle> {
  return themed.createStyleRecipe(config);
}

/** Creates a themed recipe, typed as the themed creator types it. */
function defineThemedAsCreated<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: (
    theme: Theme,
  ) => StyleRecipeConfig<Variants, never, readonly [], DefaultedName>,
): ReturnType<
  typeof themed.createStyleRecipe<Variants, never, readonly [], DefaultedName>
> {
  return themed.createStyleRecipe(config);
}

describe("a function generic over the variants of a themed recipe", () => {
  it("returns a ThemedRecipe of the selection of its variants", () => {
    const badge = defineThemed((theme) => ({
      defaultVariants: { tone: "primary" },
      variants: {
        tone: {
          primary: { backgroundColor: theme.colors.primary },
          surface: { backgroundColor: theme.colors.surface },
        },
      },
    }));

    expectTypeOf<
      VariantsOf<ReturnType<typeof badge.withTheme>>
    >().toEqualTypeOf<{ readonly tone?: "primary" | "surface" | undefined }>();
    expect(badge(light)).toStrictEqual({ backgroundColor: "#2563eb" });
    expect(badge(dark, { tone: "surface" })).toStrictEqual({
      backgroundColor: "#111827",
    });
    // @ts-expect-error: outline is not an option of tone.
    expect(badge(light, { tone: "outline" })).toStrictEqual({});
  });

  it("returns the type that the themed creator returns", () => {
    const chip = defineThemedAsCreated((theme) => ({
      variants: {
        size: { md: { borderRadius: theme.radius, height: 40 } },
      },
    }));

    expectTypeOf(chip(light, { size: "md" })).toEqualTypeOf<{
      readonly borderRadius?: number;
      readonly height?: 40;
    }>();
    expect(chip(dark, { size: "md" })).toStrictEqual({
      borderRadius: 12,
      height: 40,
    });
    // @ts-expect-error: size has no default.
    expect(chip(light)).toStrictEqual({});
  });
});

describe("a recipe that composes the recipe of a theme", () => {
  const button = themed.createStyleRecipe((theme) => ({
    base: { borderRadius: theme.radius },
    defaultVariants: { size: "md" },
    variants: {
      size: { md: { height: 40 }, sm: { height: 32 } },
      tone: { primary: { backgroundColor: theme.colors.primary } },
    },
  }));

  it("takes its variants and styles", () => {
    const iconButton = createStyleRecipe({
      composes: [button.withTheme(dark)],
      variants: { square: { true: { aspectRatio: 1 } } },
    });

    expectTypeOf<VariantsOf<typeof iconButton>>().toEqualTypeOf<{
      readonly size?: "md" | "sm" | undefined;
      readonly square?: boolean | "false" | "true" | undefined;
      readonly tone: "primary";
    }>();
    expect(iconButton({ square: true, tone: "primary" })).toStrictEqual({
      aspectRatio: 1,
      backgroundColor: "#60a5fa",
      borderRadius: 12,
      height: 40,
    });
    // @ts-expect-error: tone has no default.
    expect(iconButton({ square: true })).toStrictEqual({
      aspectRatio: 1,
      borderRadius: 12,
      height: 40,
    });
  });

  it("takes the slots of a themed slot recipe", () => {
    const card = themed.createSlotStyleRecipe((theme) => ({
      base: { root: { borderRadius: theme.radius } },
      slots: ["root"],
      variants: {},
    }));
    const panel = createSlotStyleRecipe({
      base: { footer: { paddingTop: 8 } },
      composes: [card.withTheme(light)],
      slots: ["footer"],
      variants: {},
    });

    expectTypeOf(panel()).toExtend<SlotStyles<"footer" | "root">>();
    expect(panel()).toStrictEqual({
      footer: { paddingTop: 8 },
      root: { borderRadius: 8 },
    });
  });
});

describe("a compound variant declared before its config", () => {
  const variants = {
    size: { md: { height: 40 }, sm: { height: 32 } },
    tone: { danger: { backgroundColor: "#dc2626" }, neutral: {} },
  } as const;

  it("adds its style to a recipe", () => {
    const compound: StyleCompoundVariant<typeof variants> = {
      style: { borderWidth: 2 },
      variants: { size: ["md", "sm"], tone: "danger" },
    };
    const box = createStyleRecipe({ compoundVariants: [compound], variants });

    expect(box({ size: "sm", tone: "danger" })).toStrictEqual({
      backgroundColor: "#dc2626",
      borderWidth: 2,
      height: 32,
    });
    const unknownOption: StyleCompoundVariant<typeof variants> = {
      style: {},
      // @ts-expect-error: lg is not an option of size.
      variants: { size: "lg" },
    };
    expect(unknownOption.variants).toStrictEqual({ size: "lg" });
  });

  it("adds its styles to the slots of a slot recipe", () => {
    const compound: SlotStyleCompoundVariant<
      { readonly tone: typeof variants.tone },
      SlotStyles<"label" | "root">
    > = {
      styles: { label: { color: "#ffffff" } },
      variants: { tone: "danger" },
    };
    const field = createSlotStyleRecipe({
      compoundVariants: [compound],
      slots: ["root", "label"],
      variants: {
        tone: { danger: { root: { borderWidth: 1 } }, neutral: {} },
      },
    });

    expect(field({ tone: "danger" })).toStrictEqual({
      label: { color: "#ffffff" },
      root: { borderWidth: 1 },
    });
    const unknownSlot: SlotStyleCompoundVariant<
      { readonly tone: typeof variants.tone },
      SlotStyles<"root">
    > = {
      // @ts-expect-error: label is not a slot.
      styles: { label: { color: "#ffffff" } },
      variants: { tone: "danger" },
    };
    expect(unknownSlot.styles).toStrictEqual({ label: { color: "#ffffff" } });
  });
});
