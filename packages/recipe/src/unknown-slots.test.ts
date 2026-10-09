import { describe, expect, expectTypeOf, it } from "vitest";

import type { NoUnknownSlots, UnknownSlot } from "./unknown-slots.js";
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

describe("the type of a slot that a slot recipe does not declare", () => {
  it("names the slot and the slots the recipe declares", () => {
    const variants = { size: { sm: { lable: "text-sm" } } } as const;

    expectTypeOf<
      NoUnknownSlots<typeof variants, "label" | "root">
    >().toEqualTypeOf<{
      readonly size: {
        readonly sm: {
          readonly lable?: UnknownSlot<"lable", "label" | "root">;
        };
      };
    }>();
    // @ts-expect-error lable is not a slot
    const recipe = listRecipe({ slots: ["root", "label"], variants });

    expect(recipe({ size: "sm" })).toStrictEqual({ root: [], label: [] });
  });
});
