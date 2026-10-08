import { describe, expect, expectTypeOf, it } from "vitest";

import type { ComposableKindSlotRecipe } from "./composition.js";
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
    expect(select.variantOptions).toStrictEqual({
      size: ["sm", "md", "lg"],
      invalid: ["false", "true"],
    });
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

  it("accepts its own slots in a function generic over the slot recipe it composes", () => {
    const footed = withFooter(field);

    expect(footed({ dense: true })).toStrictEqual({
      root: ["field", "field-sm"],
      label: ["field-label"],
      footer: ["footer", "footer-dense"],
    });
    expectTypeOf<VariantsOf<typeof footed>>().toEqualTypeOf<{
      readonly size?: "sm" | "md" | undefined;
      readonly invalid?: boolean | "true" | "false" | undefined;
      readonly dense?: boolean | "true" | "false" | undefined;
    }>();
  });

  it("rejects a slot that it does not declare in a function generic over the slot recipe it composes", () => {
    expect(Object.keys(withIcon(field)())).toStrictEqual([
      "root",
      "label",
      "footer",
    ]);
  });
});

/** Adds a footer to any slot recipe, as a library's own helper does. */
function withFooter<const Base extends ComposableKindSlotRecipe<string>>(
  base: Base,
): ReturnType<
  typeof slotListRecipe<
    "footer",
    { readonly dense: { readonly true: { readonly footer: "footer-dense" } } },
    never,
    readonly [Base]
  >
> {
  return slotListRecipe({
    composes: [base],
    slots: ["footer"],
    base: { footer: "footer" },
    variants: { dense: { true: { footer: "footer-dense" } } },
  });
}

/** Adds a footer, and a value for a slot that no recipe declares. */
function withIcon<const Base extends ComposableKindSlotRecipe<string>>(
  base: Base,
): ReturnType<
  typeof slotListRecipe<
    "footer",
    { readonly dense: { readonly true: { readonly footer: "footer-dense" } } },
    never,
    readonly [Base]
  >
> {
  return slotListRecipe({
    composes: [base],
    slots: ["footer"],
    // @ts-expect-error: icon is not a slot of the recipe.
    base: { icon: "icon" },
    variants: { dense: { true: { footer: "footer-dense" } } },
  });
}
