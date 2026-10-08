import { describe, expect, it } from "vitest";

import type { SlotStyles } from "./types.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createThemedRecipes } from "./themed-recipes.js";

const wide: SlotStyles<string> = { root: { gap: 4 } };

describe("a slot style recipe given styles whose slot names are not known", () => {
  it("accepts them as its base", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root", "label"],
      base: wide,
      variants: {},
    });

    expect(recipe()).toStrictEqual({ root: { gap: 4 }, label: {} });
  });

  it("accepts them in a compound variant", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root", "label"],
      variants: { size: { sm: {} } },
      compoundVariants: [{ variants: { size: "sm" }, styles: wide }],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: { gap: 4 },
      label: {},
    });
  });

  it("accepts them in a themed recipe", () => {
    const themed = createThemedRecipes<{ readonly gap: number }>();
    const recipe = themed.createSlotStyleRecipe(() => ({
      slots: ["root", "label"],
      base: wide,
      variants: { size: { sm: {} } },
      compoundVariants: [{ variants: { size: "sm" }, styles: wide }],
    }));

    expect(recipe({ gap: 4 }, { size: "sm" })).toStrictEqual({
      root: { gap: 4 },
      label: {},
    });
  });
});
