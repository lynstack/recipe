import type {
  KindCompoundCondition,
  KindDefaultVariants,
  KindRecipe,
  KindSelection,
  KindVariants,
  RecipeKind,
} from "./recipe-kind.js";
import type { LooseSlotValues, SlotsKind } from "./slots.js";
import type { SelectedVariants, WithVariantKeys } from "./variants.js";
import { compileVariants, withVariantKeys } from "./variants.js";
import { createSelector } from "./selector.js";
import { createSlotsBuilder } from "./slots.js";

/**
 * Values for some of a slot recipe's slots, keyed by slot name.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Value - The value of a slot.
 */
type SlotValues<Slot extends string, Value> = Readonly<
  Partial<Record<Slot, Value | undefined>>
>;

/**
 * The variants of a {@link KindSlotRecipeConfig}: for each variant name,
 * the values of each slot for each of its options.
 *
 * @typeParam Value - The value of a slot.
 */
type KindSlotVariants<Value> = KindVariants<SlotValues<string, Value>>;

/**
 * Rejects the slots of each option's values that `Slot` does not name,
 * unless the option's slot names are not known at compile time.
 */
type NoUnknownSlots<Variants, Slot extends string> = {
  readonly [Name in keyof Variants]: {
    readonly [
      Option in keyof Variants[Name]
    ]: string extends keyof Variants[Name][Option]
      ? unknown
      : Readonly<
          Partial<Record<Exclude<keyof Variants[Name][Option], Slot>, never>>
        >;
  };
};

/**
 * Values added to some slots when several variants have particular options
 * at the same time.
 *
 * @typeParam Variants - The variant definitions of the slot recipe.
 * @typeParam Slot - The names of the slots.
 * @typeParam Value - The value of a slot.
 */
interface KindSlotCompoundVariant<Variants, Slot extends string, Value> {
  /**
   * The options that must all be selected for
   * {@link KindSlotCompoundVariant.value} to apply.
   */
  readonly variants: KindCompoundCondition<Variants>;
  /** The value added to each slot when the condition matches. */
  readonly value: SlotValues<Slot, Value>;
}

/**
 * The configuration of a slot recipe made from a {@link RecipeKind}.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Value - The value of a slot.
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
interface KindSlotRecipeConfig<
  Slot extends string,
  Value,
  Variants extends KindSlotVariants<Value>,
  DefaultedName extends keyof Variants,
> {
  /** The names of the slots, in the order of the recipe's result. */
  readonly slots: readonly Slot[];
  /** The value of each slot that the values of every selection are added to. */
  readonly base?: SlotValues<NoInfer<Slot>, Value> | undefined;
  /** For each variant name, the values of each slot for each of its options. */
  readonly variants: Variants & NoUnknownSlots<Variants, NoInfer<Slot>>;
  /**
   * Values added to some slots when several variants have particular
   * options at the same time, applied in order after the values of the
   * variants' options.
   */
  readonly compoundVariants?:
    | readonly KindSlotCompoundVariant<
        NoInfer<Variants>,
        NoInfer<Slot>,
        Value
      >[]
    | undefined;
  /** The option each variant uses when the recipe is called without it. */
  readonly defaultVariants?:
    KindDefaultVariants<Variants, DefaultedName> | undefined;
}

/**
 * Creates slot recipes of one kind, the function that
 * {@link createSlotRecipeKind} returns.
 *
 * @typeParam Value - The value of a slot.
 * @typeParam Result - What a recipe of this kind returns for each slot.
 * @param config - The slots, base values, variants, compound variants, and
 *   default variants of the slot recipe.
 * @returns The slot recipe.
 */
type CreateKindSlotRecipe<Value, Result> = <
  const Slot extends string,
  const Variants extends KindSlotVariants<Value>,
  const DefaultedName extends keyof Variants = never,
>(
  config: KindSlotRecipeConfig<Slot, Value, Variants, DefaultedName>,
) => KindRecipe<
  KindSelection<Variants, DefaultedName>,
  Readonly<Record<Slot, Result>>
>;

interface LooseRecipeKind extends SlotsKind {
  readonly cache?: boolean | undefined;
}

interface LooseSlotRecipeConfig {
  readonly slots: readonly string[];
  readonly base?: LooseSlotValues | undefined;
  readonly variants: KindSlotVariants<unknown>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: SelectedVariants;
        readonly value: LooseSlotValues;
      }[]
    | undefined;
  readonly defaultVariants?: SelectedVariants | undefined;
}

type LooseSlotRecipe = WithVariantKeys<
  (selection?: SelectedVariants | null) => Readonly<Record<string, unknown>>
>;

/**
 * Creates a kind of slot recipe from how it turns the values of each slot
 * into that slot's result, and returns the function that creates slot
 * recipes of that kind. A slot recipe maps a selection of variants to the
 * result of each of several slots, such as the class names or the styles of
 * the elements of a component, as `sva` of `@lynstack/class-recipe` does.
 *
 * @remarks
 * A slot recipe reduces the values of each slot as a recipe of the same
 * kind from {@link createRecipeKind} would: `kind.initial` returns the
 * accumulator for the slot's base value, `kind.reduce` adds the slot's
 * value of each variant's selected option, in the order of `variants`, and
 * of each matching compound variant, in the order of `compoundVariants`,
 * and `kind.finish` turns the accumulator into the slot's result. A slot
 * without values gets the result of its accumulator for an `undefined`
 * base, so every slot is in the result.
 *
 * The result is a frozen object of each slot's result, keyed by slot name
 * in the order of `slots`. With the cache, a slot recipe builds it once for
 * each declared selection and returns the same object for the same
 * variants. Variants, default variants, boolean variants, and undeclared
 * options behave as in {@link createRecipeKind}, and the recipe's
 * `variantKeys` property lists the names of its variants.
 *
 * @typeParam Value - The value of a slot, inferred from the `value`
 *   parameter of `kind.reduce` or the `base` parameter of `kind.initial`.
 * @typeParam Accumulator - What the values of a slot are reduced to,
 *   inferred from `kind.initial`.
 * @typeParam Result - What a slot recipe returns for each slot, inferred
 *   from `kind.finish`, or the accumulator without it.
 * @param kind - How a slot recipe turns the values of each slot into its
 *   result, and whether it caches its results. The same kind can create
 *   recipes with {@link createRecipeKind}.
 * @returns The function that creates slot recipes of this kind.
 *
 * @example
 * ```ts
 * type Style = Readonly<Record<string, string | number>>;
 *
 * const styleKind = {
 *   initial: (base?: Style): Record<string, string | number> => ({ ...base }),
 *   reduce: (style: Record<string, string | number>, value: Style) =>
 *     Object.assign(style, value),
 *   finish: (style: Record<string, string | number>): Style =>
 *     Object.freeze(style),
 * };
 *
 * const slotStyleRecipe = createSlotRecipeKind(styleKind);
 *
 * const card = slotStyleRecipe({
 *   slots: ["root", "title"],
 *   base: { root: { padding: 16 }, title: { fontSize: 18 } },
 *   variants: {
 *     tone: {
 *       light: { root: { backgroundColor: "white" } },
 *       dark: { root: { backgroundColor: "black" }, title: { color: "white" } },
 *     },
 *   },
 *   compoundVariants: [
 *     { variants: { tone: "dark" }, value: { title: { fontWeight: 600 } } },
 *   ],
 *   defaultVariants: { tone: "light" },
 * });
 *
 * card();
 * // => { root: { padding: 16, backgroundColor: "white" }, title: { fontSize: 18 } }
 *
 * card({ tone: "dark" });
 * // => {
 * //   root: { padding: 16, backgroundColor: "black" },
 * //   title: { fontSize: 18, color: "white", fontWeight: 600 },
 * // }
 *
 * card.variantKeys; // => ["tone"]
 * ```
 */
function createSlotRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindSlotRecipe<Value, Result>;

function createSlotRecipeKind(kind: LooseRecipeKind): unknown {
  const options = { cache: kind.cache ?? true };

  return (config: LooseSlotRecipeConfig): LooseSlotRecipe => {
    const compiled = compileVariants<LooseSlotValues | undefined>({
      compoundVariants: config.compoundVariants ?? [],
      defaultVariants: config.defaultVariants ?? {},
      noValue: undefined,
      variants: config.variants,
    });
    const build = createSlotsBuilder(kind, compiled, config);
    return withVariantKeys(createSelector(compiled, build, options), compiled);
  };
}

export { createSlotRecipeKind };
export type {
  CreateKindSlotRecipe,
  KindSlotCompoundVariant,
  KindSlotRecipeConfig,
  KindSlotVariants,
  SlotValues,
};
