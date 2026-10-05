import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { describe, expect, expectTypeOf, it } from "vitest";

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

    expect(recipe).toBeTypeOf("function");
  });
});
