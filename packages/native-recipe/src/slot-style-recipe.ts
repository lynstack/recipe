import type {
  ComposableKindSlotRecipe,
  ComposedSlot,
  ComposedVariants,
  KindRecipe,
  KindVariants,
  RecipeComposition,
} from "@lynstack/recipe";

import type {
  CompoundCondition,
  CompoundStyles,
  DefaultVariants,
  InheritedDefaultedName,
  NativeStyle,
  NoUnknownCompoundStyles,
  NoUnknownSlotStyles,
  NoUnknownVariantStyles,
  RecipeSlotStyles,
  SlotStyles,
  VariantSelection,
} from "./types.js";
import type {
  LooseSlotStyleRecipe,
  LooseSlotStyleRecipeConfig,
} from "./compile-slot-style-recipe.js";
import { buildSlotStyleRecipe } from "./compile-slot-style-recipe.js";

/**
 * The variants of a {@link SlotStyleRecipeConfig}: for each variant name,
 * the styles of each slot for each of its options.
 */
type SlotStyleRecipeVariants = KindVariants<SlotStyles<string>>;

/**
 * Styles added to some slots when several variants have particular options
 * at the same time.
 *
 * @typeParam Variants - The variant definitions of the slot recipe.
 * @typeParam Styles - The styles added, keyed by slot name.
 */
interface SlotStyleCompoundVariant<Variants, Styles = SlotStyles<string>> {
  /**
   * The options that must all be selected for
   * {@link SlotStyleCompoundVariant.styles} to apply.
   */
  readonly variants: CompoundCondition<Variants>;
  /** The style added to each slot when the condition matches. */
  readonly styles: Styles;
}

/**
 * The configuration of a slot recipe made by {@link createSlotStyleRecipe}.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam Base - The base styles, keyed by slot name.
 * @typeParam Compounds - The compound variants.
 * @typeParam DefaultedName - The names of the variants that have a default.
 * @typeParam Composed - The types of the slot recipes that it composes.
 */
interface SlotStyleRecipeConfig<
  Slot extends string,
  Variants,
  Base,
  Compounds,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindSlotRecipe<NativeStyle>[] =
    readonly [],
> {
  /**
   * Slot recipes whose config the recipe adds to its own, in order, as if
   * it were written in one config: their slots and base styles first, the
   * styles of each of their options before its own, and their compound
   * variants first. A slot recipe composed several times counts once.
   */
  readonly composes?: Composed | undefined;
  /**
   * The names of the elements the recipe styles, after those of the slot
   * recipes it composes.
   */
  readonly slots: readonly Slot[];
  /** The style of each slot whatever the variants. */
  readonly base?:
    | (Base &
        SlotStyles<string> &
        NoUnknownSlotStyles<Base, NoInfer<ComposedSlot<Composed, Slot>>>)
    | undefined;
  /** For each variant name, the style of each slot for each of its options. */
  readonly variants: Variants &
    SlotStyleRecipeVariants &
    NoUnknownVariantStyles<Variants, NoInfer<ComposedSlot<Composed, Slot>>>;
  /**
   * Styles added to some slots when several variants have particular
   * options at the same time, applied in order after the styles of the
   * variants' options.
   */
  readonly compoundVariants?:
    | (Compounds &
        readonly SlotStyleCompoundVariant<
          NoInfer<ComposedVariants<Composed, Variants>>,
          NoUnknownCompoundStyles<
            CompoundStyles<Compounds>,
            NoInfer<ComposedSlot<Composed, Slot>>
          >
        >[])
    | undefined;
  /** The option each variant uses when a recipe is called without it. */
  readonly defaultVariants?:
    | DefaultVariants<ComposedVariants<Composed, Variants>, DefaultedName>
    | undefined;
  /**
   * Whether the recipe caches the styles of each declared selection.
   * Defaults to `true`.
   */
  readonly cache?: boolean | undefined;
}

/**
 * A function that returns the style of every slot for a selection of
 * variants, with the names of those variants in `variantKeys`, their
 * options in `variantOptions`, and their defaults in `defaultVariants`.
 *
 * @typeParam Props - The variants the recipe accepts.
 * @typeParam Styles - The style of each slot, keyed by slot name.
 * @typeParam Composition - What the slot recipe passes on to the slot
 *   recipes that compose it, under a `~composition` property that exists in
 *   the type only. Without it, the type does not allow composing it.
 */
type SlotStyleRecipe<Props, Styles, Composition = unknown> = KindRecipe<
  Props,
  Styles,
  Composition
>;

/**
 * The slot recipe of a config with the slot recipes it composes, whose
 * slots are `Slot`, whose variants are `Variants`, whose variants with a
 * default are `DefaultedName`, and which returns `Styles`.
 */
type ComposedSlotStyleRecipe<
  Slot extends string,
  Variants,
  DefaultedName extends keyof Variants,
  Styles,
> = SlotStyleRecipe<
  VariantSelection<Variants, DefaultedName>,
  Styles,
  RecipeComposition<Variants, DefaultedName, NativeStyle, readonly Slot[]>
>;

/**
 * Creates a slot style recipe: a function that returns the style of each
 * element of a component, its slots, for a selection of variants.
 *
 * @remarks
 * The style of each slot merges its base style, its style for each
 * variant's selected option, in the order of `variants`, and its style for
 * each matching compound variant, in the order of `compoundVariants`; a
 * later style overrides the properties of an earlier one, as in
 * `StyleSheet.flatten`.
 *
 * The styles of each selection are built once and cached in a frozen
 * object, so calling a slot recipe again with the same variants returns the
 * same object, with the same style for each slot. Passing them to the
 * `style` prop of each element keeps the props unchanged between renders.
 * With `cache: false`, the recipe builds a new object on every call
 * instead.
 *
 * Every declared slot is present in the result, as an empty style when it
 * has none. A variant without a default is required, except a boolean
 * variant, whose only options are `"true"` and `"false"` and which defaults
 * to `false`. An option that the config does not declare adds no style, and
 * its styles are built on every call. Properties of the selection that are
 * not variants are ignored. Its `variantKeys`, `variantOptions`, and
 * `defaultVariants` properties list its variants as those of
 * `createStyleRecipe` do.
 *
 * A slot recipe composes the slot recipes listed in `composes` as a recipe
 * composes recipes, and has the slots of each, theirs first.
 *
 * Each style is checked against the styles of React Native, as in
 * `StyleSheet.create`, and the style of each slot in the recipe's result
 * keeps the types of the properties the config declares for it.
 *
 * @typeParam Slot - The names of the slots, inferred from `config.slots`.
 * @typeParam Variants - The variant definitions, inferred from
 *   `config.variants`.
 * @typeParam Base - The base styles, inferred from `config.base`.
 * @typeParam Compounds - The compound variants, inferred from
 *   `config.compoundVariants`.
 * @typeParam DefaultedName - The names of the variants that have a
 *   default, inferred from `config.defaultVariants`.
 * @typeParam Composed - The types of the slot recipes it composes, inferred
 *   from `config.composes`.
 * @param config - The slot recipes it composes, and the slots, base styles,
 *   variants, compound variants, and default variants of the recipe.
 * @returns The slot recipe.
 *
 * @example
 * ```ts
 * const button = createSlotStyleRecipe({
 *   slots: ["root", "label"],
 *   base: { root: { borderRadius: 8 }, label: { fontWeight: "600" } },
 *   variants: {
 *     tone: {
 *       primary: {
 *         root: { backgroundColor: "#2563eb" },
 *         label: { color: "#ffffff" },
 *       },
 *       ghost: { label: { color: "#2563eb" } },
 *     },
 *     size: { sm: { root: { height: 32 } }, md: { root: { height: 40 } } },
 *   },
 *   defaultVariants: { tone: "primary", size: "md" },
 * });
 *
 * const styles = button({ size: "sm" });
 * styles.root; // => { borderRadius: 8, backgroundColor: "#2563eb", height: 32 }
 * styles.label; // => { fontWeight: "600", color: "#ffffff" }
 *
 * button({ size: "sm" }) === styles; // => true
 *
 * button.variantKeys; // => ["tone", "size"]
 * button.defaultVariants; // => { tone: "primary", size: "md" }
 *
 * const iconButton = createSlotStyleRecipe({
 *   composes: [button],
 *   slots: ["icon"],
 *   base: { root: { gap: 8 }, icon: { width: 16, height: 16 } },
 *   variants: {},
 * });
 *
 * iconButton().root; // => { borderRadius: 8, gap: 8, backgroundColor: "#2563eb", height: 40 }
 * iconButton().icon; // => { width: 16, height: 16 }
 * ```
 */
function createSlotStyleRecipe<
  const Slot extends string,
  const Variants extends SlotStyleRecipeVariants,
  const Base extends SlotStyles<string> = never,
  const Compounds extends readonly SlotStyleCompoundVariant<
    NoInfer<ComposedVariants<Composed, Variants>>
  >[] = readonly [],
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<NativeStyle>[] =
    readonly [],
>(
  config: SlotStyleRecipeConfig<
    Slot,
    Variants,
    Base,
    Compounds,
    DefaultedName,
    Composed
  >,
): ComposedSlotStyleRecipe<
  // Not ComposedSlot, which declarations print with each composed type.
  Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
  ComposedVariants<Composed, Variants>,
  NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>,
  RecipeSlotStyles<
    | Slot
    | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
    Variants,
    Base,
    Compounds,
    Composed
  >
>;

function createSlotStyleRecipe(
  config: LooseSlotStyleRecipeConfig,
): LooseSlotStyleRecipe {
  return buildSlotStyleRecipe(config);
}

export { createSlotStyleRecipe };
export type {
  ComposedSlotStyleRecipe,
  SlotStyleCompoundVariant,
  SlotStyleRecipe,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
};
