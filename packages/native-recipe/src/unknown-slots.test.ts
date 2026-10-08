import { describe, expect, it } from "vitest";

import { createSlotStyleRecipe } from "./slot-style-recipe.js";

describe("a slot that a slot style recipe's config does not declare", () => {
  it("rejects only the undeclared slot of its base and of an option", () => {
    const recipe = createSlotStyleRecipe({
      slots: ["root", "label"],
      base: {
        root: { borderRadius: 8 },
        // @ts-expect-error lable is not a slot
        lable: { fontWeight: "600" },
      },
      variants: {
        size: {
          sm: {
            root: { height: 32 },
            // @ts-expect-error lable is not a slot
            lable: { fontSize: 12 },
          },
        },
      },
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: { borderRadius: 8, height: 32 },
      label: {},
    });
  });
});
