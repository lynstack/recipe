import type {
  ComposableKindSlotRecipe,
  ComposedDefaultedName,
  ComposedKindRecipe,
  ComposedSlot,
  ComposedVariants,
} from "./composition.js";
import type {
  KindCompoundCondition,
  KindDefaultVariants,
  NoUnknownSlots,
  RecipeKind,
} from "./types.js";
import type { LooseSlotValues, SlotsKind } from "./slots.js";
import type { SelectedVariants, WithVariants } from "./variants.js";
import { compileVariants, withVariants } from "./variants.js";
import { createRegistry, layerOf, mergeLayers } from "./compose.js";
import type { KindVariants } from "./recipe-kind.js";
import { createSelector } from "./selector.js";
import { createSlotsBuilder } from "./slots.js";

const slotRecipes = createRegistry<LooseSlotValues>("slot recipe");

const noSlotValues: readonly LooseSlotValues[] = Object.freeze([]);

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
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindSlotRecipe<Value>[] = readonly [],
> {
  /**
   * Slot recipes whose config the recipe adds to its own, in order, as if
   * it were written in one config: their slots and bases first, the values
   * of each of their options before its own, and their compound variants
   * first. A slot recipe composed several times counts once.
   */
  readonly composes?: Composed | undefined;
  /**
   * The names of the slots, in the order of the recipe's result, after
   * those of the slot recipes it composes.
   */
  readonly slots: readonly Slot[];
  /** The value of each slot that the values of every selection are added to. */
  readonly base?:
    SlotValues<NoInfer<ComposedSlot<Composed, Slot>>, Value> | undefined;
  /** For each variant name, the values of each slot for each of its options. */
  readonly variants: Variants &
    NoUnknownSlots<Variants, NoInfer<ComposedSlot<Composed, Slot>>>;
  /**
   * Values added to some slots when several variants have particular
   * options at the same time, applied in order after the values of the
   * variants' options.
   */
  readonly compoundVariants?:
    | readonly KindSlotCompoundVariant<
        NoInfer<ComposedVariants<Composed, Variants>>,
        NoInfer<ComposedSlot<Composed, Slot>>,
        Value
      >[]
    | undefined;
  /** The option each variant uses when the recipe is called without it. */
  readonly defaultVariants?:
    | KindDefaultVariants<ComposedVariants<Composed, Variants>, DefaultedName>
    | undefined;
  /** Whether the recipe caches its results. Defaults to the kind's `cache`. */
  readonly cache?: boolean | undefined;
}

/**
 * Creates slot recipes of one kind, the function that
 * {@link createSlotRecipeKind} returns.
 *
 * @typeParam Value - The value of a slot.
 * @typeParam Result - What a recipe of this kind returns for each slot.
 * @param config - The slot recipes it composes, and the slots, base values,
 *   variants, compound variants, and default variants of the slot recipe,
 *   and whether it caches its results.
 * @returns The slot recipe.
 */
type CreateKindSlotRecipe<Value, Result> = <
  const Slot extends string,
  const Variants extends KindSlotVariants<Value>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<Value>[] =
    readonly [],
>(
  config: KindSlotRecipeConfig<Slot, Value, Variants, DefaultedName, Composed>,
) => ComposedKindRecipe<
  ComposedVariants<Composed, Variants>,
  ComposedDefaultedName<Composed, DefaultedName>,
  Value,
  Readonly<Record<ComposedSlot<Composed, Slot>, Result>>,
  readonly ComposedSlot<Composed, Slot>[]
>;

interface LooseRecipeKind extends SlotsKind {
  readonly cache?: boolean | undefined;
}

interface LooseSlotRecipeConfig {
  readonly composes?: readonly unknown[] | undefined;
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
  readonly cache?: boolean | undefined;
}

type LooseSlotRecipe = WithVariants<
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
 * variants. The `cache` of a slot recipe's config overrides the kind's.
 * Variants, boolean variants, undeclared options, and the `variantKeys`,
 * `variantOptions`, and `defaultVariants` properties are as in
 * {@link createRecipeKind}.
 *
 * A slot recipe composes the slot recipes listed in `composes` as a recipe
 * composes recipes, and has the slots of each, theirs first. With
 * `kind.combine`, the values of each slot are combined as a recipe's are.
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
 * card.variantOptions; // => { tone: ["light", "dark"] }
 * card.defaultVariants; // => { tone: "light" }
 *
 * const dialog = slotStyleRecipe({
 *   composes: [card],
 *   slots: ["footer"],
 *   variants: { tone: { dark: { footer: { borderColor: "white" } } } },
 * });
 *
 * dialog({ tone: "dark" }).footer; // => { borderColor: "white" }
 * ```
 */
function createSlotRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindSlotRecipe<Value, Result>;

function createSlotRecipeKind(kind: LooseRecipeKind): unknown {
  const kindCache = kind.cache ?? true;

  return (config: LooseSlotRecipeConfig): LooseSlotRecipe => {
    const own = layerOf(config, config.slots);
    const layers = slotRecipes.layersOf(config.composes ?? [], own);
    const merged = mergeLayers(layers);
    const compiled = compileVariants<readonly LooseSlotValues[]>({
      ...merged,
      noValue: noSlotValues,
    });
    const build = createSlotsBuilder(kind, compiled, merged);
    const options = { cache: config.cache ?? kindCache };
    const recipe = createSelector(compiled, build, options);
    return slotRecipes.withLayers(withVariants(recipe, compiled), layers);
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
