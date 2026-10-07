import type {
  CompoundCondition,
  DefaultVariants,
  KindRecipe,
  KindSlotVariants,
  NoUnknownSlots,
  RecipeFunction,
  SlotValues,
  VariantSelection,
} from "@lynstack/recipe";
import { overrideStyle, slotStyleRecipe } from "./kinds.ts";
import type { Style } from "./kinds.ts";

interface SlotStyleVariantsConfig<
  Slot extends string,
  Variants extends KindSlotVariants<Style>,
  DefaultedName extends keyof Variants,
> {
  readonly slots: readonly Slot[];
  readonly base?: SlotValues<NoInfer<Slot>, Style>;
  readonly variants: Variants & NoUnknownSlots<Variants, NoInfer<Slot>>;
  readonly compoundVariants?: readonly {
    readonly variants: CompoundCondition<NoInfer<Variants>>;
    readonly styles: SlotValues<NoInfer<Slot>, Style>;
  }[];
  readonly defaultVariants?: DefaultVariants<Variants, DefaultedName>;
}

type SlotStyles<Slot extends string> = Readonly<Record<Slot, Style>>;

type SlotStyleVariants<Slot extends string, Selection> = RecipeFunction<
  Selection & { readonly styles?: SlotValues<Slot, Style> },
  SlotStyles<Slot>
> &
  Pick<
    KindRecipe<Selection, SlotStyles<Slot>>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

interface LooseSlotConfig {
  readonly slots: readonly string[];
  readonly base?: SlotValues<string, Style>;
  readonly variants: KindSlotVariants<Style>;
  readonly compoundVariants?: readonly {
    readonly variants: Readonly<Record<string, unknown>>;
    readonly styles: SlotValues<string, Style>;
  }[];
  readonly defaultVariants?: Readonly<Record<string, unknown>>;
}

type LooseSlotProps = Readonly<Record<string, unknown>> & {
  readonly styles?: SlotValues<string, Style>;
};

type LooseSlotStyleVariants = SlotStyleVariants<
  string,
  Readonly<Record<string, unknown>>
>;

/** Overrides the slots that `overrides` names, in a new object. */
function overrideSlots(
  styles: SlotStyles<string>,
  overrides: SlotValues<string, Style>,
): SlotStyles<string> {
  const overridden = Object.entries(overrides).filter(
    ([slot, override]: readonly [string, Style | undefined]) =>
      Object.hasOwn(styles, slot) && override !== undefined,
  );
  if (overridden.length === 0) {
    return styles;
  }
  const result: Record<string, Style> = { ...styles };
  for (const [slot, override = {}] of overridden) {
    result[slot] = overrideStyle(styles[slot] ?? {}, override);
  }
  return Object.freeze(result);
}

export function slotSv<
  const Slot extends string,
  const Variants extends KindSlotVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotStyleVariantsConfig<Slot, Variants, DefaultedName>,
): SlotStyleVariants<Slot, VariantSelection<Variants, DefaultedName>>;

export function slotSv(config: LooseSlotConfig): LooseSlotStyleVariants {
  const recipe = slotStyleRecipe({
    ...config,
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      variants: compound.variants,
      value: compound.styles,
    })),
  });
  const slotStyleVariants = (props: LooseSlotProps = {}): SlotStyles<string> =>
    props.styles === undefined
      ? recipe(props)
      : overrideSlots(recipe(props), props.styles);
  const { defaultVariants, variantKeys, variantOptions } = recipe;
  return Object.assign(slotStyleVariants, {
    defaultVariants,
    variantKeys,
    variantOptions,
  });
}
