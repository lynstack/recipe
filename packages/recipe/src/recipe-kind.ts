import type {
  Composable,
  ComposableKindRecipe,
  ComposedKindRecipe,
  ComposedVariants,
  InheritedDefaultedName,
} from "./composition.js";
import type {
  KindCompoundCondition,
  WrittenKindDefaults,
} from "./kind-selection.js";
import type { LooseKindRecipeConfig, LooseRecipeKind } from "./build-recipe.js";
import type {
  LooseVariants,
  SelectedVariants,
  WithVariants,
} from "./variants.js";
import type {
  RecipeFunction,
  RecipeKind,
  SelectionDefaults,
  VariantKey,
  VariantOptions,
} from "./types.js";
import { compileLayer, compileMergedLayers } from "./build-recipe.js";
import { createRegistry, layerOf, mergeLayers } from "./compose.js";
import { checkRecipeConfig } from "./check-config.js";
import { createSelector } from "./selector.js";
import { warnUnknownNames } from "./check-names.js";
import { withVariants } from "./variants.js";

const recipes = createRegistry<unknown>("recipe");

/**
 * The variants of a {@link KindRecipeConfig}: for each variant name, the
 * value of each of its options.
 *
 * @typeParam Value - The value of an option.
 */
type KindVariants<Value> = LooseVariants<Value>;

/**
 * A value added when several variants have particular options at the same
 * time.
 *
 * @typeParam Variants - The variant definitions of the recipe.
 * @typeParam Value - The value of an option.
 */
interface KindCompoundVariant<Variants, Value> {
  /**
   * The options that must all be selected for
   * {@link KindCompoundVariant.value} to apply.
   */
  readonly variants: KindCompoundCondition<Variants>;
  /** The value added when the condition matches. */
  readonly value: Value;
}

/**
 * The configuration of a recipe made from a {@link RecipeKind}.
 *
 * @typeParam Value - The value of an option.
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 * @typeParam Composed - The types of the recipes that the recipe composes.
 */
interface KindRecipeConfig<
  Value,
  Variants extends KindVariants<Value>,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindRecipe<Value>[] = readonly [],
> {
  /**
   * Recipes whose config the recipe adds to its own, in order, as if it
   * were written in one config: their bases first, the values of each of
   * their options before its own, and their compound variants first. A
   * recipe composed several times counts once.
   */
  readonly composes?: Composed | undefined;
  /** The value that the values of every selection are added to. */
  readonly base?: Value | undefined;
  /** For each variant name, the value of each of its options. */
  readonly variants: Variants;
  /**
   * Values added when several variants have particular options at the same
   * time, applied in order after the values of the variants' options.
   */
  readonly compoundVariants?:
    | readonly KindCompoundVariant<
        NoInfer<ComposedVariants<Composed, Variants>>,
        Value
      >[]
    | undefined;
  /** The option each variant uses when the recipe is called without it. */
  readonly defaultVariants?:
    | WrittenKindDefaults<ComposedVariants<Composed, Variants>, DefaultedName>
    | undefined;
  /** Whether the recipe caches its results. Defaults to the kind's `cache`. */
  readonly cache?: boolean | undefined;
}

/**
 * A recipe made from a {@link RecipeKind}: a function that returns the
 * result of a selection of variants, with the names of those variants in
 * `variantKeys`, the names of their options in `variantOptions`, and the
 * option each uses when a selection leaves it out in `defaultVariants`.
 *
 * @typeParam Selection - The variants the recipe accepts.
 * @typeParam Result - What the recipe returns.
 * @typeParam Composition - What the recipe passes on to the recipes that
 *   compose it, a `RecipeComposition`. Without it, the type does not
 *   allow composing the recipe.
 */
type KindRecipe<Selection, Result, Composition = unknown> = RecipeFunction<
  Selection,
  Result
> & {
  /**
   * The names of the recipe's variants, in the order of
   * `Object.keys(config.variants)`, after those of the recipes it
   * composes.
   */
  readonly variantKeys: readonly VariantKey<Selection>[];
  /**
   * The names of the options of each variant, as strings, in the order in
   * which the recipe numbers them: integer names first, then `"false"` and
   * `"true"`, which a variant that declares either one has, then the
   * others in the order of the config. A frozen object, keyed in the order
   * of `variantKeys`.
   */
  readonly variantOptions: VariantOptions<Selection>;
  /**
   * The option, as a string, that each variant uses when a selection
   * leaves it out: its default, or `"false"` for a variant whose only
   * options are `"true"` and `"false"`. A frozen object, keyed in the
   * order of `variantKeys`, without the variants that have no default.
   */
  readonly defaultVariants: SelectionDefaults<Selection>;
} & Composable<Composition>;

/**
 * Creates recipes of one kind, the function that {@link createRecipeKind}
 * returns.
 *
 * @typeParam Value - The value of an option.
 * @typeParam Result - What a recipe of this kind returns.
 * @param config - The base value, variants, compound variants, and default
 *   variants of the recipe, and whether it caches its results.
 * @returns The recipe.
 */
type CreateKindRecipe<Value, Result> = <
  const Variants extends KindVariants<Value>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<Value>[] = readonly [],
>(
  config: KindRecipeConfig<Value, Variants, DefaultedName, Composed>,
) => ComposedKindRecipe<
  ComposedVariants<Composed, Variants>,
  DefaultedName | InheritedDefaultedName<Composed, Variants>,
  Value,
  Result,
  undefined
>;

type LooseKindRecipe = WithVariants<
  (selection?: SelectedVariants | null) => unknown
>;

/**
 * Creates a kind of recipe from how it turns the values of a selection into
 * its result, and returns the function that creates recipes of that kind.
 * A recipe maps a selection of variants to a result, as `cva` of
 * `@lynstack/class-recipe` does for class names, for values of any type,
 * such as style objects.
 *
 * @remarks
 * For each selection, a recipe reduces the value of each variant's selected
 * option and the value of each matching compound variant, with
 * `kind.reduce`, into the accumulator that `kind.initial` returns for the
 * recipe's base, then passes it to `kind.finish`. A variant whose only
 * options are `"true"` and `"false"` defaults to `false`, an option that the
 * config does not declare adds no value, and properties of the selection
 * that are not variants are ignored. A recipe's `variantKeys` property lists
 * the names of its variants, `variantOptions` the names of the options of
 * each, and `defaultVariants` the option each uses when a selection leaves
 * it out, so that a library can list every selection of a recipe.
 *
 * Creating a recipe warns once, with `console.warn`, about a default or a
 * compound variant's condition that names a variant or an option that no
 * config of the recipe declares. Such a default is ignored, and such a
 * condition never matches.
 *
 * With the cache, a recipe builds the result of each declared selection
 * once, and calling it again with the same variants returns the same
 * result. Freeze an object result in `kind.finish` so that callers cannot
 * change a result that later calls share. A selection with an undeclared
 * option is built on every call. A recipe keeps up to one result for each
 * combination of declared options; set `cache: false` in the config of a
 * recipe whose variants come from untrusted input, which overrides the kind.
 *
 * When the variant names are not known at compile time, as in a library
 * that passes on a config it received, a recipe accepts any selection.
 *
 * A recipe composes the recipes listed in its config's `composes`, of any
 * kind whose values have its type, as if their configs and its own were one:
 * the accumulator starts from the first base, and the other bases are
 * reduced first; every option of each is declared, with its values reduced
 * in the order of the recipes; their compound variants come before its own;
 * and a variant's default is the last one given. A recipe composed several
 * times counts once. With `kind.combine`, the bases, and the values that
 * the recipes give one option, are combined into one when the recipe is
 * created, so that it reduces one value for each.
 *
 * @typeParam Value - The value of an option, inferred from the `value`
 *   parameter of `kind.reduce` or the `base` parameter of `kind.initial`.
 * @typeParam Accumulator - What the values are reduced to, inferred from
 *   `kind.initial`.
 * @typeParam Result - What a recipe returns, inferred from `kind.finish`,
 *   or the accumulator without it.
 * @param kind - How a recipe turns the values of a selection into its
 *   result, and whether it caches the result.
 * @returns The function that creates recipes of this kind.
 *
 * @example
 * ```ts
 * type Style = Readonly<Record<string, string | number>>;
 *
 * const styleRecipe = createRecipeKind({
 *   initial: (base?: Style): Record<string, string | number> => ({ ...base }),
 *   reduce: (style, value: Style) => Object.assign(style, value),
 *   combine: (first, second) => ({ ...first, ...second }),
 *   finish: (style): Style => Object.freeze(style),
 * });
 *
 * const text = styleRecipe({
 *   base: { color: "black" },
 *   variants: {
 *     size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
 *     muted: { true: { opacity: 0.6 } },
 *   },
 *   compoundVariants: [
 *     { variants: { size: "lg", muted: true }, value: { fontWeight: 300 } },
 *   ],
 *   defaultVariants: { size: "sm" },
 * });
 *
 * text(); // => { color: "black", fontSize: 12 }
 *
 * text({ size: "lg", muted: true });
 * // => { color: "black", fontSize: 24, opacity: 0.6, fontWeight: 300 }
 *
 * text.variantKeys; // => ["size", "muted"]
 * text.variantOptions; // => { size: ["sm", "lg"], muted: ["false", "true"] }
 * text.defaultVariants; // => { size: "sm", muted: "false" }
 *
 * const heading = styleRecipe({
 *   composes: [text],
 *   base: { fontWeight: 700 },
 *   variants: { size: { xl: { fontSize: 32 } } },
 * });
 *
 * heading({ size: "xl" });
 * // => { color: "black", fontWeight: 700, fontSize: 32 }
 * ```
 */
function createRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindRecipe<Value, Result>;

function createRecipeKind(kind: LooseRecipeKind): unknown {
  const kindCache = kind.cache ?? true;

  return (config: LooseKindRecipeConfig): LooseKindRecipe => {
    const own = layerOf(checkRecipeConfig(config), []);
    const layers = recipes.layersOf(config.composes ?? [], own);
    warnUnknownNames(own, layers, false);
    const { compiled, build } =
      layers.length === 1
        ? compileLayer(kind, own)
        : compileMergedLayers(kind, mergeLayers(layers));
    const options = { cache: config.cache ?? kindCache };
    const recipe = createSelector(compiled, build, options);
    return recipes.withLayers(withVariants(recipe, compiled), layers);
  };
}

export { createRecipeKind };
export type {
  CreateKindRecipe,
  KindCompoundVariant,
  KindRecipe,
  KindRecipeConfig,
  KindVariants,
};
