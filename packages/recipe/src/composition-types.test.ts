import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  Composable,
  ComposedDefaultedName,
  ComposedSlot,
  RecipeComposition,
} from "./composition.js";
import type {
  KindSlotCompoundVariant,
  SlotValues,
} from "./slot-recipe-kind.js";
import type { KindCompoundVariant } from "./recipe-kind.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};

const styleRecipe = createRecipeKind(styleKind);
const slotStyleRecipe = createSlotRecipeKind(styleKind);

const sizes = {
  size: { md: { padding: 8 }, sm: { padding: 4 } },
} as const;

const tones = {
  tone: { danger: { color: "red" }, neutral: { color: "gray" } },
} as const;

const box = styleRecipe({ defaultVariants: { size: "md" }, variants: sizes });

const card = slotStyleRecipe({
  defaultVariants: { size: "md" },
  slots: ["root"],
  variants: { size: { md: { root: { padding: 8 } }, sm: { root: {} } } },
});

describe("what a recipe passes on to the recipes that compose it", () => {
  it("is its variants, defaulted names, value, and slots", () => {
    expectTypeOf<NonNullable<(typeof box)["~composition"]>>().toEqualTypeOf<
      RecipeComposition<typeof sizes, "size", Style, undefined>
    >();
    expectTypeOf<
      NonNullable<(typeof card)["~composition"]>["slots"]
    >().toEqualTypeOf<readonly "root"[]>();
    expect(box()).toStrictEqual({ padding: 8 });
    expect(card()).toStrictEqual({ root: { padding: 8 } });
  });

  it("exists in the type only", () => {
    expect(Reflect.ownKeys(box)).not.toContain("~composition");
    expect(Reflect.ownKeys(card)).not.toContain("~composition");
  });
});

describe("a composable type", () => {
  it("is an optional ~composition property", () => {
    type Composition = RecipeComposition<
      typeof sizes,
      "size",
      Style,
      undefined
    >;

    expectTypeOf<Composable<Composition>>().toEqualTypeOf<{
      readonly "~composition"?: Composition | undefined;
    }>();
    expectTypeOf(box).toExtend<Composable<Composition>>();
    expect(box.variantKeys).toStrictEqual(["size"]);
  });

  it("adds nothing without a composition", () => {
    expectTypeOf<Composable<unknown>>().toEqualTypeOf<unknown>();
    expect(Object.keys(box)).toStrictEqual([
      "defaultVariants",
      "variantKeys",
      "variantOptions",
    ]);
  });
});

describe("the slots of a slot recipe that composes others", () => {
  it("are its own slots and those of the slot recipes it composes", () => {
    const panel = slotStyleRecipe({
      composes: [card],
      slots: ["footer"],
      variants: {},
    });

    expectTypeOf<
      ComposedSlot<readonly [typeof card], "footer">
    >().toEqualTypeOf<"footer" | "root">();
    expectTypeOf<
      ComposedSlot<readonly [], "footer">
    >().toEqualTypeOf<"footer">();
    expect(panel()).toStrictEqual({ footer: {}, root: { padding: 8 } });
  });
});

describe("the defaulted names of a recipe that composes others", () => {
  it("are its own and those of the recipes it composes", () => {
    const badge = styleRecipe({
      composes: [box],
      defaultVariants: { tone: "neutral" },
      variants: tones,
    });

    expectTypeOf<
      ComposedDefaultedName<readonly [typeof box], "tone">
    >().toEqualTypeOf<"size" | "tone">();
    expectTypeOf(badge.defaultVariants).toEqualTypeOf<{
      readonly size: "md" | "sm";
      readonly tone: "danger" | "neutral";
    }>();
    expect(badge.defaultVariants).toStrictEqual({
      size: "md",
      tone: "neutral",
    });
  });
});

describe("a compound variant of a recipe", () => {
  it("is declared before the config that lists it", () => {
    const compound: KindCompoundVariant<typeof sizes & typeof tones, Style> = {
      value: { borderWidth: 1 },
      variants: { size: "sm", tone: ["danger", "neutral"] },
    };
    const badge = styleRecipe({
      compoundVariants: [compound],
      variants: { ...sizes, ...tones },
    });

    expect(badge({ size: "sm", tone: "danger" })).toStrictEqual({
      borderWidth: 1,
      color: "red",
      padding: 4,
    });
  });

  it("rejects an option that a variant does not declare", () => {
    const compound: KindCompoundVariant<typeof sizes, Style> = {
      value: { borderWidth: 1 },
      // @ts-expect-error: lg is not an option of size.
      variants: { size: "lg" },
    };

    expect(compound.variants).toStrictEqual({ size: "lg" });
  });
});

describe("a compound variant of a slot recipe", () => {
  it("adds values to the slots it names", () => {
    const compound: KindSlotCompoundVariant<
      typeof tones,
      "label" | "root",
      Style
    > = { value: { label: { fontWeight: 700 } }, variants: { tone: "danger" } };
    const field = slotStyleRecipe({
      compoundVariants: [compound],
      slots: ["root", "label"],
      variants: { tone: { danger: { root: { color: "red" } }, neutral: {} } },
    });

    expect(field({ tone: "danger" })).toStrictEqual({
      label: { fontWeight: 700 },
      root: { color: "red" },
    });
  });

  it("rejects a slot that the slot recipe does not name", () => {
    const compound: KindSlotCompoundVariant<typeof tones, "root", Style> = {
      // @ts-expect-error: label is not a slot.
      value: { label: { fontWeight: 700 } },
      variants: { tone: "danger" },
    };

    expect(compound.value).toStrictEqual({ label: { fontWeight: 700 } });
  });
});

describe("the values of some slots", () => {
  it("are optional values keyed by slot name", () => {
    const base: SlotValues<"label" | "root", Style> = { root: { padding: 4 } };
    const field = slotStyleRecipe({
      base,
      slots: ["root", "label"],
      variants: {},
    });

    expectTypeOf<SlotValues<"label" | "root", Style>>().toEqualTypeOf<{
      readonly label?: Style | undefined;
      readonly root?: Style | undefined;
    }>();
    expect(field()).toStrictEqual({ label: {}, root: { padding: 4 } });
  });

  it("reject a slot they do not name", () => {
    // @ts-expect-error: label is not a slot.
    const base: SlotValues<"root", Style> = { label: { padding: 4 } };

    expect(base).toStrictEqual({ label: { padding: 4 } });
  });
});
