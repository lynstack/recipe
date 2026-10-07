import { describe, expect, expectTypeOf, it } from "vitest";

import type { NoUnknownSlots, VariantKey, VariantsOf } from "./types.js";
import { createRecipeKind } from "./recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
  finish: (style: Style): Style => Object.freeze(style),
});

const box = styleRecipe({
  variants: {
    size: { sm: { padding: 4 }, md: { padding: 8 } },
    tone: { neutral: { color: "gray" }, danger: { color: "red" } },
    muted: { true: { opacity: 0.6 } },
  },
  defaultVariants: { size: "md" },
});

describe("the variants of a recipe", () => {
  it("returns the variants a recipe accepts", () => {
    expect(box({ tone: "danger" })).toStrictEqual({
      padding: 8,
      color: "red",
    });
    expectTypeOf<VariantsOf<typeof box>>().toEqualTypeOf<{
      readonly size?: "sm" | "md" | undefined;
      readonly tone: "neutral" | "danger";
      readonly muted?: boolean | "true" | "false" | undefined;
    }>();
  });

  it("returns the variants when the argument is optional", () => {
    const stack = styleRecipe({
      variants: { gap: { sm: { gap: 8 }, md: { gap: 16 } } },
      defaultVariants: { gap: "md" },
    });

    expect(stack()).toStrictEqual({ gap: 16 });
    expectTypeOf<VariantsOf<typeof stack>>().toEqualTypeOf<{
      readonly gap?: "sm" | "md" | undefined;
    }>();
  });
});

describe("the variant names of a recipe", () => {
  it("names the variants of a selection as strings", () => {
    const sized = styleRecipe({ variants: { 2: { sm: { padding: 4 } } } });

    expect(sized.variantKeys).toStrictEqual(["2"]);
    expectTypeOf<VariantKey<VariantsOf<typeof box>>>().toEqualTypeOf<
      "size" | "tone" | "muted"
    >();
    expectTypeOf(sized.variantKeys).toEqualTypeOf<
      readonly VariantKey<VariantsOf<typeof sized>>[]
    >();
  });
});

describe("the slots a slot recipe's variants name", () => {
  type SlotVariants = Readonly<
    Record<string, Readonly<Record<string, Readonly<Record<string, Style>>>>>
  >;

  /** The config of a library's slot recipe, which rejects unknown slots. */
  interface SlotConfig<Slot extends string, Variants extends SlotVariants> {
    readonly slots: readonly Slot[];
    readonly variants: Variants & NoUnknownSlots<Variants, NoInfer<Slot>>;
  }

  /** Returns a library's slot recipe config, typed. */
  function slotConfig<
    const Slot extends string,
    const Variants extends SlotVariants,
  >(config: SlotConfig<Slot, Variants>): SlotConfig<Slot, Variants> {
    return config;
  }

  it("rejects a value for a slot that the config does not name", () => {
    const config = slotConfig({
      slots: ["root"],
      variants: { size: { sm: { root: { padding: 4 } } } },
    });
    const unknownSlot = slotConfig({
      slots: ["root"],
      // @ts-expect-error: title is not a slot.
      variants: { size: { sm: { title: { padding: 4 } } } },
    });

    expect(config.variants.size.sm.root).toStrictEqual({ padding: 4 });
    expect(unknownSlot.slots).toStrictEqual(["root"]);
    expectTypeOf<
      NoUnknownSlots<{ size: { sm: { title: Style } } }, "root">
    >().toEqualTypeOf<{
      readonly size: {
        readonly sm: Readonly<Partial<Record<"title", never>>>;
      };
    }>();
  });
});
