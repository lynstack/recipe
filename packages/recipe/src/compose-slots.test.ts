import { describe, expect, expectTypeOf, it } from "vitest";

import type { VariantsOf } from "./types.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

const listKind = {
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
};

const slotListRecipe = createSlotRecipeKind(listKind);

const field = slotListRecipe({
  slots: ["root", "label"],
  base: { root: "field", label: "field-label" },
  variants: {
    size: {
      sm: { root: "field-sm" },
      md: { root: "field-md", label: "field-label-md" },
    },
    invalid: { true: { label: "field-invalid" } },
  },
  compoundVariants: [
    { variants: { size: "md", invalid: true }, value: { root: "field-md-x" } },
  ],
  defaultVariants: { size: "sm" },
});

const select = slotListRecipe({
  composes: [field],
  slots: ["label", "trigger"],
  base: { root: "select", trigger: "select-trigger" },
  variants: {
    size: { md: { trigger: "select-md" }, lg: { root: "select-lg" } },
  },
  compoundVariants: [
    { variants: { invalid: true }, value: { trigger: "select-invalid" } },
  ],
});

describe("a slot recipe that composes slot recipes", () => {
  it("has the slots of every slot recipe, in order", () => {
    expect(Object.keys(select())).toStrictEqual(["root", "label", "trigger"]);
    expectTypeOf(select).returns.toEqualTypeOf<
      Readonly<Record<"root" | "label" | "trigger", readonly string[]>>
    >();
  });

  it("reduces the values of each slot as one config would", () => {
    expect(select({ size: "md", invalid: true })).toStrictEqual({
      root: ["field", "select", "field-md", "field-md-x"],
      label: ["field-label", "field-label-md", "field-invalid"],
      trigger: ["select-trigger", "select-md", "select-invalid"],
    });
  });

  it("declares the variants and options of every slot recipe", () => {
    expect(select({ size: "lg" }).root).toStrictEqual([
      "field",
      "select",
      "select-lg",
    ]);
    expect(select.variantKeys).toStrictEqual(["size", "invalid"]);
    expectTypeOf<VariantsOf<typeof select>>().toEqualTypeOf<{
      readonly size?: "sm" | "md" | "lg" | undefined;
      readonly invalid?: boolean | "true" | "false" | undefined;
    }>();
  });

  it("returns the same result for the same selection", () => {
    expect(select({ size: "sm" })).toBe(select());
    expect(Object.isFrozen(select())).toBe(true);
  });

  it("composes only the slot recipes that the engine created", () => {
    const listRecipe = createRecipeKind(listKind);
    const sizes = listRecipe({ variants: { size: { sm: "a" } } });

    expect(() =>
      slotListRecipe({
        // @ts-expect-error: a slot recipe composes no recipe without slots.
        composes: [sizes],
        slots: ["root"],
        variants: {},
      }),
    ).toThrow(
      "A slot recipe composes only slot recipes created by @lynstack/recipe.",
    );
  });

  it("rejects a slot that no slot recipe declares", () => {
    const labeled = slotListRecipe({
      composes: [field],
      slots: [],
      // @ts-expect-error: icon is not a slot.
      base: { icon: "a" },
      variants: {},
    });

    expect(Object.keys(labeled())).toStrictEqual(["root", "label"]);
  });
});
