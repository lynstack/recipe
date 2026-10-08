import { describe, expect, it } from "vitest";

import { createSlotRecipeKind } from "./slot-recipe-kind.js";

const listRecipe = createSlotRecipeKind({
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
});

describe("a slot that a slot recipe's config does not declare", () => {
  it("is rejected in an option, and the option's other slots are not", () => {
    const recipe = listRecipe({
      slots: ["root", "label"],
      variants: {
        size: {
          sm: {
            root: "h-8",
            // @ts-expect-error lable is not a slot
            lable: "text-sm",
          },
        },
      },
    });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: ["h-8"],
      label: [],
    });
  });
});
