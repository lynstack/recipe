import { describe, expect, it } from "vitest";

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

const listRecipe = createRecipeKind(listKind);
const listSlotRecipe = createSlotRecipeKind(listKind);

describe("a recipe's config from untyped code", () => {
  it("needs variants", () => {
    expect(() =>
      // @ts-expect-error: variants is required.
      listRecipe({ base: "a" }),
    ).toThrow(
      new TypeError(
        "A recipe's config needs `variants`, an object of the options of each variant. Use `variants: {}` for a recipe without variants.",
      ),
    );
  });

  it("needs a config object", () => {
    expect(() =>
      // @ts-expect-error: a recipe needs a config.
      listRecipe(),
    ).toThrow(new TypeError("A recipe needs a config object."));
  });

  it("needs an object of options for each variant", () => {
    expect(() =>
      // @ts-expect-error: a variant's options are an object.
      listRecipe({ variants: { size: "sm" } }),
    ).toThrow(
      new TypeError('The variant "size" needs an object of its options.'),
    );
  });

  it("needs an array of compound variants", () => {
    expect(() =>
      listRecipe({
        variants: { size: { sm: "a" } },
        // @ts-expect-error: compoundVariants is an array.
        compoundVariants: { variants: { size: "sm" }, value: "b" },
      }),
    ).toThrow(
      new TypeError("`compoundVariants` needs an array of compound variants."),
    );
  });

  it("needs the variants of each compound variant", () => {
    expect(() =>
      listRecipe({
        variants: { size: { sm: "a" } },
        compoundVariants: [
          { variants: { size: "sm" }, value: "b" },
          // @ts-expect-error: a compound variant names its variants in variants.
          { size: "sm", value: "c" },
        ],
      }),
    ).toThrow(
      new TypeError(
        "Compound variant 1 needs `variants`, an object of the options it matches.",
      ),
    );
  });

  it("accepts any value, which has the type of the kind", () => {
    const recipe = listRecipe({
      variants: { size: { sm: "a" } },
      compoundVariants: [{ variants: { size: "sm" }, value: "b" }],
    });

    expect(recipe({ size: "sm" })).toStrictEqual(["a", "b"]);
  });
});

describe("a slot recipe's config from untyped code", () => {
  it("needs slots", () => {
    expect(() =>
      // @ts-expect-error: slots is required.
      listSlotRecipe({ variants: {} }),
    ).toThrow(
      new TypeError(
        "A slot recipe's config needs `slots`, an array of the names of its slots.",
      ),
    );
  });

  it("needs variants", () => {
    expect(() =>
      // @ts-expect-error: variants is required.
      listSlotRecipe({ slots: ["root"] }),
    ).toThrow(TypeError);
  });

  it("needs a value for each slot in base, options, and compound variants", () => {
    expect(() =>
      // @ts-expect-error: base has a value for each slot.
      listSlotRecipe({ slots: ["root"], base: "a", variants: {} }),
    ).toThrow(
      new TypeError(
        "The `base` of a slot recipe needs an object of the value of each slot.",
      ),
    );
    expect(() =>
      listSlotRecipe({
        slots: ["root"],
        // @ts-expect-error: an option has a value for each slot.
        variants: { size: { sm: "a" } },
      }),
    ).toThrow(
      new TypeError(
        'The option "sm" of the variant "size" needs an object of the value of each slot.',
      ),
    );
    expect(() =>
      listSlotRecipe({
        slots: ["root"],
        variants: { size: { sm: { root: "a" } } },
        // @ts-expect-error: a compound variant has a value for each slot.
        compoundVariants: [{ variants: { size: "sm" }, value: "b" }],
      }),
    ).toThrow(
      new TypeError(
        "The `value` of compound variant 0 needs an object of the value of each slot.",
      ),
    );
  });

  it("accepts a slot recipe without a base or values for every slot", () => {
    const card = listSlotRecipe({
      slots: ["root", "title"],
      variants: { size: { sm: { root: "a" }, md: {} } },
    });

    expect(card({ size: "sm" })).toStrictEqual({ root: ["a"], title: [] });
  });
});
