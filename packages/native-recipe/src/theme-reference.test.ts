import { describe, expect, expectTypeOf, it } from "vitest";

import { createThemedRecipes } from "./themed-recipes.js";

interface Theme {
  readonly colors: { readonly primary: string };
  readonly gap: number;
}

const light: Theme = { colors: { primary: "#2563eb" }, gap: 4 };
const dark: Theme = { colors: { primary: "#60a5fa" }, gap: 6 };

describe("the themeToken of createThemedRecipes", () => {
  const { createSlotStyleRecipe, createStyleRecipe, themeToken } =
    createThemedRecipes<Theme>();

  const button = createStyleRecipe(() => ({
    base: { gap: themeToken.gap * 2 },
    variants: {
      tone: { primary: { backgroundColor: themeToken.colors.primary } },
    },
    defaultVariants: { tone: "primary" },
  }));

  it("has the type of the theme", () => {
    expectTypeOf(themeToken).toEqualTypeOf<Theme>();
    expectTypeOf(button).parameter(0).toEqualTypeOf<Theme>();
    expect(button(light)).toStrictEqual({
      backgroundColor: "#2563eb",
      gap: 8,
    });
  });

  it("reads the theme whose recipe is being built", () => {
    expect(button(light)).toStrictEqual({
      backgroundColor: "#2563eb",
      gap: 8,
    });
    expect(button(dark)).toStrictEqual({
      backgroundColor: "#60a5fa",
      gap: 12,
    });
    expect(button(light)).toBe(button(light, { tone: "primary" }));
  });

  it("composes the recipe of the theme being built", () => {
    const icon = createStyleRecipe(() => ({
      composes: [button.withTheme(themeToken)],
      base: { width: themeToken.gap * 10 },
      variants: {},
    }));

    expect(icon(dark)).toStrictEqual({
      backgroundColor: "#60a5fa",
      gap: 12,
      width: 60,
    });
    expect(icon(light)).toStrictEqual({
      backgroundColor: "#2563eb",
      gap: 8,
      width: 40,
    });
  });

  it("spreads and lists the properties of the theme", () => {
    const field = createSlotStyleRecipe(() => ({
      slots: ["root"],
      base: { root: { gap: { ...themeToken }.gap } },
      variants: {
        wide: { true: { root: { width: Object.keys(themeToken).length } } },
      },
    }));

    expect(field(light, { wide: true })).toStrictEqual({
      root: { gap: 4, width: 2 },
    });
  });

  it("throws when it is read outside a config function", () => {
    expect(() => themeToken.gap).toThrow(
      new TypeError(
        "The themeToken of createThemedRecipes is read outside the config function of a recipe. Read it inside the function, as in `createStyleRecipe(() => ({ base: { gap: themeToken.gap } }))`.",
      ),
    );
    expect(() => "gap" in themeToken).toThrow(TypeError);
    expect(() => button(themeToken)).toThrow(TypeError);
    expect(() => button.withTheme(themeToken)).toThrow(TypeError);
  });

  it("is not needed by a config function that takes the theme", () => {
    const chip = createStyleRecipe((current: Theme) => ({
      base: { gap: current.gap },
      variants: {},
    }));

    expect(chip(dark)).toStrictEqual({ gap: 6 });
  });
});
