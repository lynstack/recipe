import { describe, expect, it } from "vitest";

import { createThemedRecipes } from "./themed-recipes.js";

interface Theme {
  readonly colors: { readonly primary: string };
  readonly radius: number;
}

const light: Theme = { colors: { primary: "#2563eb" }, radius: 8 };

const { createSlotStyleRecipe, createStyleRecipe } =
  createThemedRecipes<Theme>();

describe(createThemedRecipes, () => {
  it("rejects values that a style property does not take in the base style", () => {
    const literal = createStyleRecipe((theme) => ({
      base: {
        borderRadius: theme.radius,
        // @ts-expect-error "sideways" is not a flex direction
        flexDirection: "sideways",
      },
      variants: {},
    }));
    const textOnly = createStyleRecipe(() => ({
      // @ts-expect-error 650 is not a font weight
      base: { fontWeight: 650 },
      variants: {},
    }));
    const token = createStyleRecipe((theme) => ({
      // @ts-expect-error a color is not a font weight
      base: { fontWeight: theme.colors.primary },
      variants: {},
    }));

    expect(literal(light)).toStrictEqual({
      borderRadius: 8,
      flexDirection: "sideways",
    });
    expect(textOnly(light)).toStrictEqual({ fontWeight: 650 });
    expect(token(light)).toStrictEqual({ fontWeight: "#2563eb" });
  });

  it("rejects values that a style property does not take in the options", () => {
    const { themeToken } = createThemedRecipes<Theme>();
    const optionStyle = createStyleRecipe((theme) => ({
      variants: {
        tone: {
          // @ts-expect-error 650 is not a font weight
          bold: { fontWeight: 650 },
          // @ts-expect-error a theme object is not a color
          primary: { color: theme.colors },
        },
      },
    }));
    const tokenStyle = createStyleRecipe(() => ({
      variants: {
        // @ts-expect-error "middle" is not a text alignment
        align: { center: { textAlign: "middle" } },
        // @ts-expect-error "zoom" is not a resize mode
        fit: { cover: { resizeMode: "zoom" } },
      },
      base: { borderRadius: themeToken.radius },
    }));
    // @ts-expect-error a theme object is not a color
    const optionSlotStyles = createSlotStyleRecipe((theme: Theme) => ({
      slots: ["root", "label"],
      variants: {
        tone: {
          primary: { root: { padding: 4 }, label: { color: theme.colors } },
        },
      },
    }));

    expect(optionStyle(light, { tone: "bold" })).toStrictEqual({
      fontWeight: 650,
    });
    expect(tokenStyle(light, { align: "center", fit: "cover" })).toStrictEqual({
      borderRadius: 8,
      textAlign: "middle",
      resizeMode: "zoom",
    });
    expect(optionSlotStyles(light, { tone: "primary" })).toStrictEqual({
      root: { padding: 4 },
      label: { color: light.colors },
    });
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

  it("accepts compound styles that fit different elements", () => {
    const slotStyles = createSlotStyleRecipe((theme) => ({
      slots: ["root"],
      variants: { tone: { muted: {}, cover: {} } },
      compoundVariants: [
        {
          variants: { tone: "muted" },
          styles: { root: { color: theme.colors.primary } },
        },
        {
          variants: { tone: "cover" },
          styles: { root: { resizeMode: "cover" } },
        },
      ],
    }));

    expect(slotStyles(light, { tone: "cover" })).toStrictEqual({
      root: { resizeMode: "cover" },
    });
  });
});
