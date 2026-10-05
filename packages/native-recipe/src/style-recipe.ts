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
  LooseStyleRecipe,
  LooseStyleRecipeConfig,
} from "./compile-style-recipe.js";
import { buildStyleRecipe } from "./compile-style-recipe.js";

/**
 * The variants of a {@link StyleRecipeConfig}: for each variant name, the
 * style of each of its options.
 */
type StyleRecipeVariants = KindVariants<NativeStyle>;

type NoUnknownStyles<Variants> = {
  readonly [Name in keyof Variants]: {
    readonly [Option in keyof Variants[Name]]: NoUnknownProperties<
      Variants[Name][Option]
    >;
  };
};

/**
 * A style added when several variants have particular options at the same
 * time.
 *
 * @typeParam Variants - The variant definitions of the recipe.
 * @typeParam Style - The style added.
 */
interface StyleCompoundVariant<Variants, Style = NativeStyle> {
  /**
   * The options that must all be selected for
   * {@link StyleCompoundVariant.style} to apply.
   */
  readonly variants: CompoundCondition<Variants>;
  /** The style added when the condition matches. */
  readonly style: Style;
}

/**
 * The configuration of a recipe made by {@link createStyleRecipe}.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam Base - The base style.
 * @typeParam Compounds - The compound variants.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
interface StyleRecipeConfig<
  Variants,
  Base,
  Compounds,
  DefaultedName extends keyof Variants,
> {
  /** The style applied whatever the variants. */
  readonly base?: (Base & NativeStyle & NoUnknownProperties<Base>) | undefined;
  /** For each variant name, the style of each of its options. */
  readonly variants: Variants & StyleRecipeVariants & NoUnknownStyles<Variants>;
  /**
   * Styles added when several variants have particular options at the same
   * time, applied in order after the styles of the variants' options.
   */
  readonly compoundVariants?:
    | (Compounds &
        readonly StyleCompoundVariant<
          NoInfer<Variants>,
          NoUnknownProperties<CompoundStyle<Compounds>>
        >[])
    | undefined;
  /** The option each variant uses when a recipe is called without it. */
  readonly defaultVariants?:
    DefaultVariants<Variants, DefaultedName> | undefined;
}

/** Every style that a recipe's config declares, as a union. */
type DeclaredStyle<Variants, Base, Compounds> =
  Base | OptionValue<Variants> | CompoundStyle<Compounds>;

type CompoundStyle<Compounds> = Compounds extends readonly (infer Compound)[]
  ? Compound extends { readonly style: infer Style }
    ? Style
    : never
  : never;

/**
 * The style a recipe returns: each property its config declares, with the
 * types the config gives it.
 */
type RecipeStyle<Variants, Base, Compounds> = {
  readonly [
    Key in KeyOfEach<DeclaredStyle<Variants, Base, Compounds>>
  ]?: PropertyOfEach<DeclaredStyle<Variants, Base, Compounds>, Key>;
};

/**
 * A function that returns the style of one element for a selection of
 * variants, with the names of those variants in `variantKeys`.
 *
 * @typeParam Props - The variants the recipe accepts.
 * @typeParam Style - The style the recipe returns.
 */
type StyleRecipe<Props, Style> = KindRecipe<Props, Style>;

/**
 * Creates a style recipe: a function that returns the style of one element
 * for a selection of variants.
 *
 * @remarks
 * The style of a selection merges the base style, the style of each
 * variant's selected option, in the order of `variants`, and the style of
 * each matching compound variant, in the order of `compoundVariants`; a
 * later style overrides the properties of an earlier one, as in
 * `StyleSheet.flatten`.
 *
 * The style of each selection is built once and cached in a frozen object,
 * so calling a recipe again with the same variants returns the same object.
 * Passing it to the `style` prop of a component keeps the prop unchanged
 * between renders, which lets React skip the style and a memoized child
 * skip rendering.
 *
 * A variant without a default is required, except a boolean variant, whose
 * only options are `"true"` and `"false"` and which defaults to `false`. An
 * option that the config does not declare adds no style, and its style is
 * built on every call. Properties of the selection that are not variants
 * are ignored. The recipe's `variantKeys` property lists the names of its
 * variants.
 *
 * Each style is checked against the styles of React Native, as in
 * `StyleSheet.create`, and the recipe's result keeps the types of the
 * properties the config declares.
 *
 * @typeParam Variants - The variant definitions, inferred from
 *   `config.variants`.
 * @typeParam Base - The base style, inferred from `config.base`.
 * @typeParam Compounds - The compound variants, inferred from
 *   `config.compoundVariants`.
 * @typeParam DefaultedName - The names of the variants that have a
 *   default, inferred from `config.defaultVariants`.
 * @param config - The base style, variants, compound variants, and default
 *   variants of the recipe.
 * @returns The recipe.
 *
 * @example
 * ```ts
 * const button = createStyleRecipe({
 *   base: { alignItems: "center", borderRadius: 8 },
 *   variants: {
 *     tone: {
 *       neutral: { backgroundColor: "#f3f4f6" },
 *       danger: { backgroundColor: "#dc2626" },
 *     },
 *     size: { sm: { height: 32 }, md: { height: 40 } },
 *   },
 *   compoundVariants: [
 *     { variants: { tone: "danger", size: "md" }, style: { borderWidth: 2 } },
 *   ],
 *   defaultVariants: { size: "md" },
 * });
 *
 * button({ tone: "danger" });
 * // => { alignItems: "center", borderRadius: 8, backgroundColor: "#dc2626", height: 40, borderWidth: 2 }
 *
 * button({ tone: "neutral", size: "sm" });
 * // => { alignItems: "center", borderRadius: 8, backgroundColor: "#f3f4f6", height: 32 }
 *
 * button({ tone: "danger" }) === button({ tone: "danger" }); // => true
 *
 * button.variantKeys; // => ["tone", "size"]
 * ```
 */
function createStyleRecipe<
  const Variants extends StyleRecipeVariants,
  const Base extends NativeStyle = never,
  const Compounds extends readonly StyleCompoundVariant<NoInfer<Variants>>[] =
    readonly [],
  const DefaultedName extends keyof Variants = never,
>(
  config: StyleRecipeConfig<Variants, Base, Compounds, DefaultedName>,
): StyleRecipe<
  VariantSelection<Variants, DefaultedName>,
  RecipeStyle<Variants, Base, Compounds>
>;

function createStyleRecipe(config: LooseStyleRecipeConfig): LooseStyleRecipe {
  return buildStyleRecipe(config);
}

export { createStyleRecipe };
export type {
  RecipeStyle,
  StyleCompoundVariant,
  StyleRecipe,
  StyleRecipeConfig,
  StyleRecipeVariants,
};
