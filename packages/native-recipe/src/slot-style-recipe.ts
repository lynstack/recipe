import type { KindRecipe, KindVariants } from "@lynstack/recipe";

import type {
  CompoundCondition,
  DefaultVariants,
  KeyOfEach,
  NativeStyle,
  NoUnknownProperties,
  OptionValue,
  PropertyOfEach,
  VariantSelection,
} from "./types.js";
import type {
  LooseSlotStyleRecipe,
  LooseSlotStyleRecipeConfig,
} from "./compile-slot-style-recipe.js";
import { buildSlotStyleRecipe } from "./compile-slot-style-recipe.js";

/**
 * Styles for some of a slot recipe's slots, keyed by slot name.
 *
 * @typeParam Slot - The names of the slots.
 */
type SlotStyles<Slot extends string> = Readonly<
  Partial<Record<Slot, NativeStyle | undefined>>
>;

/**
 * The variants of a {@link SlotStyleRecipeConfig}: for each variant name,
 * the styles of each slot for each of its options.
 */
type SlotStyleRecipeVariants = KindVariants<SlotStyles<string>>;

type NoUnknownSlotStyles<Styles, Slot extends string> = {
  readonly [Name in keyof Styles]: Name extends Slot
    ? NoUnknownProperties<NonNullable<Styles[Name]>>
    : never;
};

type NoUnknownVariantStyles<Variants, Slot extends string> = {
  readonly [Name in keyof Variants]: {
    readonly [Option in keyof Variants[Name]]: NoUnknownSlotStyles<
      Variants[Name][Option],
      Slot
    >;
  };
};

/**
 * Rejects the slots and style properties of the compound variants' styles,
 * given as a union, that the slot recipe does not have.
 */
type NoUnknownCompoundStyles<Styles, Slot extends string> = Readonly<
  Partial<Record<Exclude<KeyOfEach<Styles>, Slot>, never>>
> & {
  readonly [Name in Slot]?: NoUnknownProperties<DeclaredStyle<Styles, Name>>;
};

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
 */
interface SlotStyleRecipeConfig<
  Slot extends string,
  Variants,
  Base,
  Compounds,
  DefaultedName extends keyof Variants,
> {
  /** The names of the elements the recipe styles. */
  readonly slots: readonly Slot[];
  /** The style of each slot whatever the variants. */
  readonly base?:
    | (Base & SlotStyles<string> & NoUnknownSlotStyles<Base, NoInfer<Slot>>)
    | undefined;
  /** For each variant name, the style of each slot for each of its options. */
  readonly variants: Variants &
    SlotStyleRecipeVariants &
    NoUnknownVariantStyles<Variants, NoInfer<Slot>>;
  /**
   * Styles added to some slots when several variants have particular
   * options at the same time, applied in order after the styles of the
   * variants' options.
   */
  readonly compoundVariants?:
    | (Compounds &
        readonly SlotStyleCompoundVariant<
          NoInfer<Variants>,
          NoUnknownCompoundStyles<CompoundStyles<Compounds>, NoInfer<Slot>>
        >[])
    | undefined;
  /** The option each variant uses when a recipe is called without it. */
  readonly defaultVariants?:
    DefaultVariants<Variants, DefaultedName> | undefined;
}

/**
 * A function that returns the style of every slot for a selection of
 * variants, with the names of those variants in `variantKeys`.
 *
 * @typeParam Props - The variants the recipe accepts.
 * @typeParam Styles - The style of each slot, keyed by slot name.
 */
type SlotStyleRecipe<Props, Styles> = KindRecipe<Props, Styles>;

/** Every style that a slot recipe's config declares for `Slot`, as a union. */
type DeclaredStyle<Styles, Slot> = Styles extends unknown
  ? Slot extends keyof Styles
    ? Exclude<Styles[Slot], undefined>
    : never
  : never;

/** Every slot style that a slot recipe's config declares, as a union. */
type DeclaredSlotStyles<Variants, Base, Compounds> =
  Base | OptionValue<Variants> | CompoundStyles<Compounds>;

type CompoundStyles<Compounds> = Compounds extends readonly (infer Compound)[]
  ? Compound extends { readonly styles: infer Styles }
    ? Styles
    : never
  : never;

/**
 * The styles a slot recipe returns: for each slot, each property its config
 * declares for it, with the types the config gives it.
 */
type RecipeSlotStyles<Slot extends string, Variants, Base, Compounds> = {
  readonly [Name in Slot]: {
    readonly [
      Key in KeyOfEach<
        DeclaredStyle<DeclaredSlotStyles<Variants, Base, Compounds>, Name>
      >
    ]?: PropertyOfEach<
      DeclaredStyle<DeclaredSlotStyles<Variants, Base, Compounds>, Name>,
      Key
    >;
  };
};

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
 *
 * Every declared slot is present in the result, as an empty style when it
 * has none. A variant without a default is required, except a boolean
 * variant, whose only options are `"true"` and `"false"` and which defaults
 * to `false`. An option that the config does not declare adds no style, and
 * its styles are built on every call. Properties of the selection that are
 * not variants are ignored. The recipe's `variantKeys` property lists the
 * names of its variants.
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
 * @param config - The slots, base styles, variants, compound variants, and
 *   default variants of the recipe.
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
 * ```
 */
function createSlotStyleRecipe<
  const Slot extends string,
  const Variants extends SlotStyleRecipeVariants,
  const Base extends SlotStyles<string> = never,
  const Compounds extends readonly SlotStyleCompoundVariant<
    NoInfer<Variants>
  >[] = readonly [],
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotStyleRecipeConfig<Slot, Variants, Base, Compounds, DefaultedName>,
): SlotStyleRecipe<
  VariantSelection<Variants, DefaultedName>,
  RecipeSlotStyles<Slot, Variants, Base, Compounds>
>;

function createSlotStyleRecipe(
  config: LooseSlotStyleRecipeConfig,
): LooseSlotStyleRecipe {
  return buildSlotStyleRecipe(config);
}

export { createSlotStyleRecipe };
export type {
  RecipeSlotStyles,
  SlotStyleCompoundVariant,
  SlotStyleRecipe,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
  SlotStyles,
};
