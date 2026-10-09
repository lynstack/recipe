import { describe, expect, expectTypeOf, it } from "vitest";

import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";

describe("a config declared before the call", () => {
  it("rejects values that only a text or image style rejects in the options", () => {
    const style = {
      variants: { align: { center: { textAlign: "middle" } } },
    } as const;
    const slotStyles = {
      slots: ["root", "label"],
      variants: { tone: { muted: { label: { color: { light: "#6b7280" } } } } },
    } as const;

    // @ts-expect-error "middle" is not a text alignment
    const recipe = createStyleRecipe(style);
    // @ts-expect-error an object is not a color
    const slotRecipe = createSlotStyleRecipe(slotStyles);

    expect(recipe({ align: "center" })).toStrictEqual({ textAlign: "middle" });
    expect(slotRecipe({ tone: "muted" })).toStrictEqual({
      root: {},
      label: { color: { light: "#6b7280" } },
    });
  });

  it("keeps the variants of a config whose options fit a text style", () => {
    const style = {
      variants: { align: { center: { textAlign: "center" } } },
    } as const;
    const recipe = createStyleRecipe(style);

    expect(recipe({ align: "center" })).toStrictEqual({ textAlign: "center" });
    expectTypeOf(recipe).toBeCallableWith({ align: "center" });
    // @ts-expect-error the variant declares no option "end"
    expect(recipe({ align: "end" })).toStrictEqual({});
  });
});
