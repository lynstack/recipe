import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { SlotStyleRecipeVariants } from "./slot-style-recipe.js";
import type { VariantsOf } from "./types.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";

const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: { root: { borderRadius: 8 }, label: { fontWeight: "600" } },
  variants: {
    tone: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        label: { color: "#ffffff" },
      },
      ghost: { label: { color: "#2563eb" } },
    },
    size: {
      sm: { root: { height: 32 }, label: { fontSize: 14 } },
      md: { root: { height: 40 } },
    },
  },
  defaultVariants: { tone: "primary", size: "md" },
});

describe(createSlotStyleRecipe, () => {
  it("merges the base style and the selected options per slot", () => {
    expect(button({ tone: "ghost", size: "sm" })).toStrictEqual({
      root: { borderRadius: 8, height: 32 },
      label: { fontWeight: "600", color: "#2563eb", fontSize: 14 },
    });
  });

  it("applies default variants when a variant is omitted", () => {
    expect(button()).toStrictEqual({
      root: { borderRadius: 8, backgroundColor: "#2563eb", height: 40 },
      label: { fontWeight: "600", color: "#ffffff" },
    });
  });

  it("returns the same frozen styles for the same selection", () => {
    const first = button({ size: "sm" });

    expect(button({ tone: "primary", size: "sm" })).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.root)).toBe(true);
    expect(Object.isFrozen(first.label)).toBe(true);
  });

  it("keeps selections that differ apart", () => {
    expect(button({ size: "sm" })).not.toBe(button({ size: "md" }));
  });

  it("returns an empty style for a slot without styles", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root", "icon"],
      variants: { size: { md: { root: { height: 40 } } } },
    });

    expect(recipe({ size: "md" })).toStrictEqual({
      root: { height: 40 },
      icon: {},
    });
  });

  it("leaves the styles of the config unchanged", () => {
    const root = { borderRadius: 8 };
    const recipe = createSlotStyleRecipe({
      slots: ["root"],
      base: { root },
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(recipe({ size: "sm" }).root).not.toBe(root);
    expect(root).toStrictEqual({ borderRadius: 8 });
    expect(Object.isExtensible(root)).toBe(true);
  });

  it("ignores styles of undeclared slots at runtime", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root"],
      variants: {
        // @ts-expect-error icon is not a slot
        size: { sm: { root: { height: 32 }, icon: { width: 16 } } },
      },
    });

    expect(recipe({ size: "sm" })).toStrictEqual({ root: { height: 32 } });
  });

  it("adds compound styles to their slots when every condition matches", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root", "icon"],
      variants: {
        tone: {
          neutral: { root: { backgroundColor: "#f3f4f6" } },
          danger: { root: { backgroundColor: "#dc2626" } },
        },
        size: { sm: { icon: { width: 16 } }, md: { icon: { width: 20 } } },
      },
      compoundVariants: [
        {
          variants: { tone: "danger", size: ["sm", "md"] },
          styles: { icon: { tintColor: "#ffffff" } },
        },
        {
          variants: { size: "md" },
          styles: { root: { padding: 8 }, icon: { width: 24 } },
        },
      ],
    });

    expect(recipe({ tone: "danger", size: "md" })).toStrictEqual({
      root: { backgroundColor: "#dc2626", padding: 8 },
      icon: { width: 24, tintColor: "#ffffff" },
    });
    expect(recipe({ tone: "neutral", size: "sm" })).toStrictEqual({
      root: { backgroundColor: "#f3f4f6" },
      icon: { width: 16 },
    });
  });

  it("ignores properties of the selection that are not variants", () => {
    const props = { size: "sm", title: "Save" } as const;

    expect(button(props)).toBe(button({ size: "sm" }));
  });

  it("rejects an undeclared option and ignores it at runtime", () => {
    // @ts-expect-error "xl" is not a size option
    expect(button({ size: "xl" })).toStrictEqual({
      root: { borderRadius: 8, backgroundColor: "#2563eb" },
      label: { fontWeight: "600", color: "#ffffff" },
    });
  });

  it("lists the names of its variants", () => {
    expect(button.variantKeys).toStrictEqual(["tone", "size"]);
    expectTypeOf(button.variantKeys).toEqualTypeOf<
      readonly ("tone" | "size")[]
    >();
  });

  it("lists the options and defaults of its variants", () => {
    expect(button.variantOptions).toStrictEqual({
      tone: ["primary", "ghost"],
      size: ["sm", "md"],
    });
    expect(button.defaultVariants).toStrictEqual({
      tone: "primary",
      size: "md",
    });
    expectTypeOf(button.variantOptions).toEqualTypeOf<{
      readonly tone: readonly ("primary" | "ghost")[];
      readonly size: readonly ("sm" | "md")[];
    }>();
  });

  it("infers its variants", () => {
    expect(button()).toBeDefined();
    expectTypeOf<VariantsOf<typeof button>>().toEqualTypeOf<{
      readonly tone?: "primary" | "ghost" | undefined;
      readonly size?: "sm" | "md" | undefined;
    }>();
  });

  it("returns the properties its config declares for each slot", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root", "icon"],
      base: { root: { flex: 1 } },
      variants: { size: { sm: { root: { height: 32 } } } },
      compoundVariants: [
        { variants: { size: "sm" }, styles: { root: { opacity: 0.5 } } },
      ],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: { flex: 1, height: 32, opacity: 0.5 },
      icon: {},
    });
    expectTypeOf(button).returns.toEqualTypeOf<{
      readonly root: {
        readonly borderRadius?: 8;
        readonly backgroundColor?: "#2563eb";
        readonly height?: 32 | 40;
      };
      readonly label: {
        readonly fontWeight?: "600";
        readonly color?: "#ffffff" | "#2563eb";
        readonly fontSize?: 14;
      };
    }>();
    expectTypeOf(recipe).returns.toHaveProperty("root").toEqualTypeOf<{
      readonly flex?: 1;
      readonly height?: 32;
      readonly opacity?: 0.5;
    }>();
    expectTypeOf<keyof ReturnType<typeof recipe>["icon"]>().toBeNever();
  });

  it("accepts a config declared beforehand", () => {
    const config = {
      slots: ["root", "icon"],
      variants: { size: { sm: { root: { height: 32 } } } },
      compoundVariants: [
        { variants: { size: "sm" }, styles: { root: { opacity: 0.5 } } },
        { variants: { size: "sm" }, styles: { icon: { width: 16 } } },
      ],
    } as const;
    const recipe = createSlotStyleRecipe(config);

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: { height: 32, opacity: 0.5 },
      icon: { width: 16 },
    });
    expectTypeOf(recipe).returns.toEqualTypeOf<{
      readonly root: { readonly height?: 32; readonly opacity?: 0.5 };
      readonly icon: { readonly width?: 16 };
    }>();
  });

  it("returns styles that fit the elements their properties fit", () => {
    expect(button()).toBeDefined();
    expectTypeOf(button().root).toExtend<StyleProp<ViewStyle>>();
    expectTypeOf(button().label).toExtend<StyleProp<TextStyle>>();
    expectTypeOf(button().label).not.toExtend<StyleProp<ViewStyle>>();
  });

  it("rejects properties that no style has", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root"],
      // @ts-expect-error colour is not a style property
      base: { root: { colour: "#111827", flex: 1 } },
      variants: {
        // @ts-expect-error fontSise is not a style property
        size: { sm: { root: { fontSize: 12, fontSise: 12 } } },
      },
      compoundVariants: [
        {
          variants: { size: "sm" },
          // @ts-expect-error opactiy is not a style property
          styles: { root: { opacity: 1, opactiy: 0.5 } },
        },
      ],
    });

    expect(recipe).toBeTypeOf("function");
  });

  it("rejects styles of undeclared slots", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root"],
      // @ts-expect-error icon is not a slot
      base: { root: { flex: 1 }, icon: { width: 16 } },
      variants: { size: { sm: { root: { height: 32 } } } },
      compoundVariants: [
        {
          variants: { size: "sm" },
          // @ts-expect-error icon is not a slot
          styles: { icon: { width: 16 } },
        },
      ],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: { flex: 1, height: 32 },
    });
  });

  it("accepts variants whose slot names are not known", () => {
    const variants: SlotStyleRecipeVariants = {
      size: { sm: { root: { height: 32 } } },
    };
    const recipe = createSlotStyleRecipe({
      slots: ["root", "label"],
      variants,
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: { height: 32 },
      label: {},
    });
  });
});
