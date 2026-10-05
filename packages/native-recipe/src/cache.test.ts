import { describe, expect, it } from "vitest";

import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";
import { createThemedRecipes } from "./themed-recipes.js";

describe("the cache setting of a style recipe's config", () => {
  it("builds a new frozen style on every call without the cache", () => {
    const uncached = createStyleRecipe({
      cache: false,
      variants: { size: { sm: { height: 32 } } },
    });
    const cached = createStyleRecipe({
      variants: { size: { sm: { height: 32 } } },
    });

    expect(uncached({ size: "sm" })).not.toBe(uncached({ size: "sm" }));
    expect(uncached({ size: "sm" })).toStrictEqual({ height: 32 });
    expect(Object.isFrozen(uncached({ size: "sm" }))).toBe(true);
    expect(cached({ size: "sm" })).toBe(cached({ size: "sm" }));
  });

  it("builds new styles on every call of a slot style recipe", () => {
    const card = createSlotStyleRecipe({
      cache: false,
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(card({ size: "sm" })).not.toBe(card({ size: "sm" }));
    expect(card({ size: "sm" })).toStrictEqual({ root: { height: 32 } });
  });

  it("applies to the recipe of each theme", () => {
    const theme: { readonly radius: number } = { radius: 8 };
    const { createStyleRecipe: createThemedStyleRecipe } =
      createThemedRecipes<typeof theme>();
    const box = createThemedStyleRecipe((tokens) => ({
      cache: false,
      base: { borderRadius: tokens.radius },
      variants: { size: { sm: { height: 32 } } },
    }));

    expect(box(theme, { size: "sm" })).not.toBe(box(theme, { size: "sm" }));
    expect(box(theme, { size: "sm" })).toStrictEqual({
      borderRadius: 8,
      height: 32,
    });
  });

  it("rejects a setting that is not a boolean", () => {
    const box = createStyleRecipe({
      // @ts-expect-error cache must be a boolean
      cache: "no",
      variants: { size: { sm: { height: 32 } } },
    });
    const card = createSlotStyleRecipe({
      // @ts-expect-error cache must be a boolean
      cache: "no",
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(box({ size: "sm" })).toStrictEqual({ height: 32 });
    expect(card({ size: "sm" })).toStrictEqual({ root: { height: 32 } });
  });
});
