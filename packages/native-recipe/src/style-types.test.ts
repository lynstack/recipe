import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
  NativeStyle,
  SlotStyles,
  VariantSelection,
} from "./types.js";
import type {
  SlotStyleRecipe,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
} from "./slot-style-recipe.js";
import type {
  StyleRecipe,
  StyleRecipeConfig,
  StyleRecipeVariants,
} from "./style-recipe.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";

const badge = createStyleRecipe({
  base: { borderRadius: 6, padding: 4 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#dc2626", borderWidth: 1 },
    },
    size: {
      md: { padding: 8 },
      sm: { height: 24 },
    },
  },
  defaultVariants: { size: "md" },
});

describe("the styles of createStyleRecipe", () => {
  it("returns the properties its config declares", () => {
    expect(badge({ tone: "neutral" })).toBeDefined();
    expectTypeOf(badge).returns.toEqualTypeOf<{
      readonly borderRadius?: 6;
      readonly padding?: 4 | 8;
      readonly backgroundColor?: "#f3f4f6" | "#dc2626";
      readonly borderWidth?: 1;
      readonly height?: 24;
    }>();
  });

  it("returns the properties of the other options with an empty option", () => {
    const recipe = createStyleRecipe({
      variants: { tone: { plain: {}, danger: { borderWidth: 1 } } },
    });

    expect(recipe({ tone: "plain" })).toStrictEqual({});
    expectTypeOf(recipe).returns.toEqualTypeOf<{ readonly borderWidth?: 1 }>();
    expectTypeOf(recipe({ tone: "plain" })).toExtend<StyleProp<ViewStyle>>();
  });

  it("returns the properties of compound styles", () => {
    const recipe = createStyleRecipe({
      variants: { size: { sm: { height: 24 } } },
      compoundVariants: [
        { variants: { size: "sm" }, style: { borderWidth: 1 } },
        { variants: { size: "sm" }, style: { opacity: 0.5 } },
      ],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      height: 24,
      borderWidth: 1,
      opacity: 0.5,
    });
    expectTypeOf(recipe).returns.toEqualTypeOf<{
      readonly height?: 24;
      readonly borderWidth?: 1;
      readonly opacity?: 0.5;
    }>();
  });

  it("accepts a config declared beforehand", () => {
    const config = {
      variants: { size: { sm: { height: 24 } } },
      compoundVariants: [
        { variants: { size: "sm" }, style: { borderWidth: 1 } },
        { variants: { size: "sm" }, style: { opacity: 0.5 } },
      ],
    } as const;
    const recipe = createStyleRecipe(config);

    expect(recipe({ size: "sm" })).toStrictEqual({
      height: 24,
      borderWidth: 1,
      opacity: 0.5,
    });
    expectTypeOf(recipe).returns.toEqualTypeOf<{
      readonly height?: 24;
      readonly borderWidth?: 1;
      readonly opacity?: 0.5;
    }>();
  });

  it("returns a style that fits the elements its properties fit", () => {
    const text = createStyleRecipe({
      variants: { size: { sm: { fontSize: 12 }, lg: { fontWeight: "700" } } },
    });
    const scroll = createStyleRecipe({
      base: { overflow: "scroll" },
      variants: {},
    });

    expect(text({ size: "sm" })).toStrictEqual({ fontSize: 12 });
    expect(scroll()).toStrictEqual({ overflow: "scroll" });
    expectTypeOf(badge({ tone: "neutral" })).toExtend<StyleProp<ViewStyle>>();
    expectTypeOf(badge({ tone: "neutral" })).toExtend<StyleProp<TextStyle>>();
    expectTypeOf(badge({ tone: "neutral" })).toExtend<StyleProp<ImageStyle>>();
    expectTypeOf(text({ size: "sm" })).toExtend<StyleProp<TextStyle>>();
    expectTypeOf(text({ size: "sm" })).not.toExtend<StyleProp<ViewStyle>>();
    expectTypeOf(scroll()).toExtend<StyleProp<ViewStyle>>();
    expectTypeOf(scroll()).not.toExtend<StyleProp<ImageStyle>>();
  });

  it("rejects properties that no style has", () => {
    const recipe = createStyleRecipe({
      // @ts-expect-error colour is not a style property
      base: { colour: "#111827", flex: 1 },
      variants: {
        // @ts-expect-error fontSise is not a style property
        size: { sm: { fontSize: 12, fontSise: 12 } },
      },
      compoundVariants: [
        // @ts-expect-error opactiy is not a style property
        { variants: { size: "sm" }, style: { opacity: 1, opactiy: 0.5 } },
      ],
    });

    expect(recipe).toBeTypeOf("function");
  });

  it("rejects values that no style accepts", () => {
    const recipe = createStyleRecipe({
      // @ts-expect-error fontSize is a number
      variants: { size: { sm: { fontSize: "12px" } } },
    });
    const mixed = createStyleRecipe({
      // @ts-expect-error 650 is not a font weight
      base: { borderRadius: 3, fontWeight: 650 },
      variants: {},
    });

    expect(recipe).toBeTypeOf("function");
    expect(mixed()).toStrictEqual({ borderRadius: 3, fontWeight: 650 });
  });

  it("accepts compound styles that fit different elements", () => {
    const recipe = createStyleRecipe({
      variants: { tone: { muted: {}, cover: {} } },
      compoundVariants: [
        { variants: { tone: "muted" }, style: { color: "#6b7280" } },
        { variants: { tone: "cover" }, style: { resizeMode: "cover" } },
      ],
    });

    expect(recipe({ tone: "cover" })).toStrictEqual({ resizeMode: "cover" });
  });
});

/** Creates a recipe from any config, as a library's own helper does. */
function defineStyleRecipe<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: StyleRecipeConfig<Variants, NativeStyle, readonly [], DefaultedName>,
): StyleRecipe<VariantSelection<Variants, DefaultedName>, NativeStyle> {
  return createStyleRecipe(config);
}

/** Creates a slot recipe from any config, as a library's own helper does. */
function defineSlotStyleRecipe<
  const Slot extends string,
  const Variants extends SlotStyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotStyleRecipeConfig<
    Slot,
    Variants,
    SlotStyles<Slot>,
    readonly [],
    DefaultedName
  >,
): SlotStyleRecipe<
  VariantSelection<Variants, DefaultedName>,
  SlotStyles<Slot>
> {
  return createSlotStyleRecipe(config);
}

describe("a function generic over a config", () => {
  it("returns the recipe of its config as a StyleRecipe", () => {
    const chip = defineStyleRecipe({
      variants: { tone: { neutral: { opacity: 0.5 }, danger: { opacity: 1 } } },
      defaultVariants: { tone: "neutral" },
    });

    expect(chip()).toStrictEqual({ opacity: 0.5 });
    expectTypeOf<Parameters<typeof chip>[0]>().toEqualTypeOf<
      { readonly tone?: "neutral" | "danger" | undefined } | undefined
    >();
  });

  it("returns the slot recipe of its config as a SlotStyleRecipe", () => {
    const field = defineSlotStyleRecipe({
      slots: ["label", "input"],
      variants: { size: { sm: { input: { height: 24 } } } },
    });

    expect(field({ size: "sm" })).toStrictEqual({
      label: {},
      input: { height: 24 },
    });
    expectTypeOf<Parameters<typeof field>[0]>().toEqualTypeOf<{
      readonly size: "sm";
    }>();
  });
});

/** Creates a recipe that may compose others, as a library's helper does. */
function defineComposedStyleRecipe<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<NativeStyle>[] =
    readonly [],
>(
  config: StyleRecipeConfig<
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >,
): ReturnType<
  typeof createStyleRecipe<
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >
> {
  return createStyleRecipe(config);
}

describe("a function generic over a config that composes recipes", () => {
  it("returns a recipe with the variants of the recipes it composes", () => {
    const iconBadge = defineComposedStyleRecipe({
      composes: [badge],
      variants: { size: { icon: { width: 24 } } },
    });

    expect(iconBadge({ tone: "neutral", size: "icon" })).toStrictEqual({
      borderRadius: 6,
      padding: 4,
      backgroundColor: "#f3f4f6",
      width: 24,
    });
    expectTypeOf<Parameters<typeof iconBadge>[0]>().toEqualTypeOf<{
      readonly tone: "neutral" | "danger";
      readonly size?: "md" | "sm" | "icon" | undefined;
    }>();
  });

  it("names a slot recipe that a slot recipe can compose", () => {
    const card = createSlotStyleRecipe({
      slots: ["root"],
      variants: { size: { sm: { root: { padding: 4 } } } },
    });

    expect(card({ size: "sm" })).toStrictEqual({ root: { padding: 4 } });
    expectTypeOf(card).toExtend<ComposableKindSlotRecipe<NativeStyle>>();
    expectTypeOf(badge).not.toExtend<ComposableKindSlotRecipe<NativeStyle>>();
    expectTypeOf<
      keyof ComposedVariants<
        readonly [typeof card],
        { readonly tone: { readonly loud: { readonly root: NativeStyle } } }
      >
    >().toEqualTypeOf<"size" | "tone">();
  });
});
