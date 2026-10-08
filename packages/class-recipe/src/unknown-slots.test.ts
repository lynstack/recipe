import { describe, expect, it } from "vitest";

import { createSlotRecipe } from "./slot-recipe.js";

describe("a slot that an sva config does not declare", () => {
  it("rejects only the undeclared slot of an option", () => {
    const recipe = createSlotRecipe({
      slots: ["root", "label"],
      variants: {
        size: {
          md: {
            root: "p-4",
            // @ts-expect-error lable is not a slot
            lable: "text-label",
          },
        },
      },
    });

    expect(recipe({ size: "md" })).toStrictEqual({ root: "p-4", label: "" });
  });
});
