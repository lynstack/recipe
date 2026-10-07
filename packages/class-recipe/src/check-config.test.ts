import { describe, expect, it } from "vitest";

import { createRecipe } from "./recipe.js";
import { createSlotRecipe } from "./slot-recipe.js";

describe("a recipe's config from untyped code", () => {
  it("needs variants", () => {
    expect(() =>
      // @ts-expect-error: variants is required.
      createRecipe({ base: "rounded" }),
    ).toThrow(
      new TypeError(
        "A recipe's config needs `variants`, an object of the options of each variant. Use `variants: {}` for a recipe without variants.",
      ),
    );
  });

  it("needs strings of classes", () => {
    expect(() =>
      // @ts-expect-error: base is a string.
      createRecipe({ base: ["rounded", "px-4"], variants: {} }),
    ).toThrow(new TypeError("`base` needs a string of classes."));
    expect(() =>
      // @ts-expect-error: an option's classes are a string.
      createRecipe({ variants: { size: { sm: ["h-8", "px-3"] } } }),
    ).toThrow(
      new TypeError(
        'The option "sm" of the variant "size" needs a string of classes.',
      ),
    );
    expect(() =>
      // @ts-expect-error: an option's classes are a string.
      createRecipe({ variants: { size: { sm: null } } }),
    ).toThrow(TypeError);
  });

  it("names the classes of a compound variant className", () => {
    expect(() =>
      createRecipe({
        variants: { size: { sm: "h-8" } },
        // @ts-expect-error: the classes of a compound variant are className.
        compoundVariants: [{ variants: { size: "sm" }, class: "px-3" }],
      }),
    ).toThrow(
      new TypeError(
        "Compound variant 0 needs `className`, the classes it adds. Rename `class` to `className`.",
      ),
    );
  });

  it("needs the variants of a compound variant", () => {
    expect(() =>
      createRecipe({
        variants: { size: { sm: "h-8" } },
        // @ts-expect-error: a compound variant names its variants in variants.
        compoundVariants: [{ size: "sm", className: "px-3" }],
      }),
    ).toThrow(
      new TypeError(
        "Compound variant 0 needs `variants`, an object of the options it matches.",
      ),
    );
  });

  it("accepts empty classes", () => {
    const recipe = createRecipe({
      base: "",
      variants: { size: { sm: "", md: "h-10" } },
      compoundVariants: [{ variants: { size: "md" }, className: "" }],
    });

    expect(recipe({ size: "md" })).toBe("h-10");
  });
});

describe("a slot recipe's config from untyped code", () => {
  it("needs the classes of each slot", () => {
    expect(() =>
      // @ts-expect-error: base has the classes of each slot.
      createSlotRecipe({ slots: ["root"], base: "p-4", variants: {} }),
    ).toThrow(
      new TypeError(
        '`base` needs the classes of each slot, such as `{ root: "p-4" }`.',
      ),
    );
    expect(() =>
      createSlotRecipe({
        slots: ["root"],
        // @ts-expect-error: an option has the classes of each slot.
        variants: { size: { sm: "p-2" } },
      }),
    ).toThrow(
      new TypeError(
        'The option "sm" of the variant "size" needs the classes of each slot, such as `{ root: "p-4" }`.',
      ),
    );
    expect(() =>
      createSlotRecipe({
        slots: ["root"],
        // @ts-expect-error: the classes of a slot are a string.
        variants: { size: { sm: { root: ["p-2"] } } },
      }),
    ).toThrow(TypeError);
  });

  it("names the classes of a compound variant classNames", () => {
    expect(() =>
      createSlotRecipe({
        slots: ["root"],
        variants: { size: { sm: { root: "p-2" } } },
        // @ts-expect-error: the classes of a compound variant are classNames.
        compoundVariants: [{ variants: { size: "sm" }, class: { root: "x" } }],
      }),
    ).toThrow(
      new TypeError(
        "Compound variant 0 needs `classNames`, the classes it adds. Rename `class` to `classNames`.",
      ),
    );
    expect(() =>
      createSlotRecipe({
        slots: ["root"],
        variants: { size: { sm: { root: "p-2" } } },
        // @ts-expect-error: classNames has the classes of each slot.
        compoundVariants: [{ variants: { size: "sm" }, classNames: "x" }],
      }),
    ).toThrow(
      new TypeError(
        'The `classNames` of compound variant 0 needs the classes of each slot, such as `{ root: "p-4" }`.',
      ),
    );
  });

  it("accepts a slot without classes", () => {
    const card = createSlotRecipe({
      slots: ["root", "title"],
      base: { root: "p-4", title: undefined },
      variants: { size: { sm: { title: "text-sm" } } },
    });

    expect(card({ size: "sm" })).toStrictEqual({
      root: "p-4",
      title: "text-sm",
    });
  });
});
