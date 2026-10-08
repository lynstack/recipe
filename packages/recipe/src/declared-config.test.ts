import { describe, expect, expectTypeOf, it } from "vitest";

import { createSlotRecipeKind } from "./slot-recipe-kind.js";

const slotListRecipe = createSlotRecipeKind({
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
});

describe("a slot recipe whose slots are declared without as const", () => {
  it("takes any string as a slot name", () => {
    const slots = ["root", "title"];
    const wide = slotListRecipe({
      slots,
      base: { body: "p-4" },
      variants: { size: { sm: { root: "p-2", titel: "text-sm" } } },
    });
    const result = wide({ size: "sm" });

    expectTypeOf(slots).toEqualTypeOf<string[]>();
    expectTypeOf(result).toEqualTypeOf<
      Readonly<Record<string, readonly string[]>>
    >();
    expect(result).toStrictEqual({ root: ["p-2"], title: [] });
  });
});
