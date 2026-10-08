import type {
  ComposableKindRecipe,
  ComposedVariants,
  KindRecipe,
  KindVariants,
  RecipeComposition,
} from "@lynstack/recipe";

import type {
  ComposedStyle,
  CompoundCondition,
  DefaultVariants,
  InheritedDefaultedName,
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
 * @typeParam Composed - The types of the recipes that the recipe composes.
 */
interface StyleRecipeConfig<
  Variants,
  Base,
  Compounds,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindRecipe<NativeStyle>[] = readonly [],
> {
  /**
   * Recipes whose config the recipe adds to its own, in order, as if it
   * were written in one config: their base styles first, the style of each
   * of their options before its own, and their compound variants first. A
   * recipe composed several times counts once.
   */
  readonly composes?: Composed | undefined;
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
          NoInfer<ComposedVariants<Composed, Variants>>,
          NoUnknownProperties<CompoundStyle<Compounds>>
        >[])
    | undefined;
  /** The option each variant uses when a recipe is called without it. */
  readonly defaultVariants?:
    | DefaultVariants<ComposedVariants<Composed, Variants>, DefaultedName>
    | undefined;
  /**
   * Whether the recipe caches the style of each declared selection.
   * Defaults to `true`.
   */
  readonly cache?: boolean | undefined;
}

/**
 * Every style that a recipe's config declares, and the style of each recipe
 * it composes, as a union.
 */
type DeclaredStyle<Variants, Base, Compounds, Composed = readonly []> =
  | Base
  | OptionValue<Variants>
  | CompoundStyle<Compounds>
  | ComposedStyle<Composed>;

type CompoundStyle<Compounds> = Compounds extends readonly (infer Compound)[]
  ? Compound extends { readonly style: infer Style }
    ? Style
    : never
  : never;

/**
 * The style a recipe returns: each property its config and the recipes it
 * composes declare, with the types they give it.
 */
type RecipeStyle<Variants, Base, Compounds, Composed = readonly []> = {
  readonly [
    Key in KeyOfEach<DeclaredStyle<Variants, Base, Compounds, Composed>>
  ]?: PropertyOfEach<DeclaredStyle<Variants, Base, Compounds, Composed>, Key>;
};

/**
 * A function that returns the style of one element for a selection of
 * variants, with the names of those variants in `variantKeys`, their
 * options in `variantOptions`, and their defaults in `defaultVariants`.
 *
 * @typeParam Props - The variants the recipe accepts.
 * @typeParam Style - The style the recipe returns.
 * @typeParam Composition - What the recipe passes on to the recipes that
 *   compose it, which its type carries under a `~composition` property that
 *   exists in the type only. Without it, the type does not allow composing
 *   the recipe.
 */
type StyleRecipe<Props, Style, Composition = unknown> = KindRecipe<
  Props,
  Style,
  Composition
>;

/**
 * The recipe of a config whose variants, with those of the recipes it
 * composes, are `Variants`, whose variants with a default are
 * `DefaultedName`, and which returns `Style`.
 */
type ComposedStyleRecipe<
  Variants,
  DefaultedName extends keyof Variants,
  Style,
> = StyleRecipe<
  VariantSelection<Variants, DefaultedName>,
  Style,
  RecipeComposition<Variants, DefaultedName, NativeStyle, undefined>
>;

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
 * skip rendering. With `cache: false`, the recipe builds a new object on
 * every call instead.
 *
 * A variant without a default is required, except a boolean variant, whose
 * only options are `"true"` and `"false"` and which defaults to `false`. An
 * option that the config does not declare adds no style, and its style is
 * built on every call. Properties of the selection that are not variants
 * are ignored. Creating the recipe warns once, with `console.warn`, about a
 * default or a compound variant that names a variant or an option that the
 * config does not declare, which adds no style. The recipe's `variantKeys`
 * property lists the names of its variants, `variantOptions` the names of
 * the options of each, and `defaultVariants` the option each uses when the
 * recipe is called without it.
 *
 * A recipe composes the recipes listed in its config's `composes` as if
 * their configs and its own were one: their base styles first, then the
 * style of each option, in the order of the recipes, then their compound
 * variants before its own; the default of a variant is the last one given.
 * A recipe composed several times counts once.
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
 * @typeParam Composed - The types of the recipes it composes, inferred from
 *   `config.composes`.
 * @param config - The recipes it composes, and the base style, variants,
 *   compound variants, and default variants of the recipe.
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
 * button.variantOptions; // => { tone: ["neutral", "danger"], size: ["sm", "md"] }
 * button.defaultVariants; // => { size: "md" }
 *
 * const iconButton = createStyleRecipe({
 *   composes: [button],
 *   variants: { size: { icon: { height: 40, width: 40 } } },
 * });
 *
 * iconButton({ tone: "neutral", size: "icon" });
 * // => { alignItems: "center", borderRadius: 8, backgroundColor: "#f3f4f6", height: 40, width: 40 }
 * ```
 */
function createStyleRecipe<
  const Variants extends StyleRecipeVariants,
  const Base extends NativeStyle = never,
  const Compounds extends readonly StyleCompoundVariant<
    NoInfer<ComposedVariants<Composed, Variants>>
  >[] = readonly [],
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<NativeStyle>[] =
    readonly [],
>(
  config: StyleRecipeConfig<Variants, Base, Compounds, DefaultedName, Composed>,
): ComposedStyleRecipe<
  ComposedVariants<Composed, Variants>,
  NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>,
  RecipeStyle<Variants, Base, Compounds, Composed>
>;

function createStyleRecipe(config: LooseStyleRecipeConfig): LooseStyleRecipe {
  return buildStyleRecipe(config);
}

export { createStyleRecipe };
export type {
  ComposedStyleRecipe,
  RecipeStyle,
  StyleCompoundVariant,
  StyleRecipe,
  StyleRecipeConfig,
  StyleRecipeVariants,
};
