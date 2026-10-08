import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  KindRecipe,
  KindRecipeConfig,
  KindVariants,
} from "./recipe-kind.js";
import type {
  KindSlotRecipeConfig,
  KindSlotVariants,
} from "./slot-recipe-kind.js";
import type {
  NoUnknownSlots,
  VariantKey,
  VariantSelection,
  VariantsOf,
} from "./types.js";
import type { KindSelection } from "./kind-selection.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
  finish: (style: Style): Style => Object.freeze(style),
});

const slotStyleRecipe = createSlotRecipeKind({
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

/** Creates a recipe from any config, as a library's own helper does. */
function defineStyle<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: KindRecipeConfig<Style, Variants, DefaultedName>,
): KindRecipe<KindSelection<Variants, DefaultedName>, Style> {
  return styleRecipe(config);
}

/** Creates a slot recipe from any config, as a library's own helper does. */
function defineSlotStyles<
  const Slot extends string,
  const Variants extends KindSlotVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: KindSlotRecipeConfig<Slot, Style, Variants, DefaultedName>,
): KindRecipe<
  KindSelection<Variants, DefaultedName>,
  Readonly<Record<Slot, Style>>
> {
  return slotStyleRecipe(config);
}

describe("the selection of a recipe", () => {
  it("is the selection of its variants when their names are known", () => {
    expect(box({ tone: "neutral" })).toStrictEqual({
      padding: 8,
      color: "gray",
    });
    expectTypeOf<
      KindSelection<{ size: { sm: Style }; muted: { true: Style } }, never>
    >().toEqualTypeOf<
      VariantSelection<{ size: { sm: Style }; muted: { true: Style } }, never>
    >();
  });

  it("is any selection when the variant names are not known", () => {
    const looseVariants: Readonly<
      Record<string, Readonly<Record<string, Style>>>
    > = { size: { sm: { padding: 4 } } };
    const loose = styleRecipe({
      variants: looseVariants,
    });

    expect(loose({ size: "sm" })).toStrictEqual({ padding: 4 });
    expectTypeOf<
      KindSelection<Readonly<Record<string, Record<string, Style>>>, never>
    >().toEqualTypeOf<Readonly<Record<string, unknown>>>();
  });
});

describe("a function generic over a config", () => {
  it("returns the recipe of its config as a KindRecipe", () => {
    const badge = defineStyle({
      variants: {
        tone: { neutral: { color: "gray" }, danger: { color: "red" } },
      },
      defaultVariants: { tone: "neutral" },
    });

    expect(badge({})).toStrictEqual({ color: "gray" });
    expectTypeOf<VariantsOf<typeof badge>>().toEqualTypeOf<{
      readonly tone?: "neutral" | "danger" | undefined;
    }>();
  });

  it("returns the slot recipe of its config as a KindRecipe", () => {
    const field = defineSlotStyles({
      slots: ["label", "input"],
      variants: { invalid: { true: { input: { borderColor: "red" } } } },
    });

    expect(field({ invalid: true })).toStrictEqual({
      label: {},
      input: { borderColor: "red" },
    });
    expectTypeOf<VariantsOf<typeof field>>().toEqualTypeOf<{
      readonly invalid?: boolean | "true" | "false" | undefined;
    }>();
  });
});
