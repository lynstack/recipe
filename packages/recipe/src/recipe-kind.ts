import type {
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantKey,
  VariantSelection,
} from "./types.js";
import type {
  LooseVariants,
  SelectedVariants,
  WithVariantKeys,
} from "./variants.js";
import { compileVariants, withVariantKeys } from "./variants.js";
import { createSelector } from "./selector.js";
import { reduceValues } from "./reduce-values.js";

/**
 * How a kind of recipe turns the values of a selection into its result,
 * such as by joining class names or merging style objects.
 *
 * @typeParam Value - The value of an option.
 * @typeParam Accumulator - What the values of a selection are reduced to.
 * @typeParam Result - What a recipe of this kind returns.
 */
interface RecipeKind<Value, Accumulator, Result> {
  /**
   * Returns the accumulator that the values of a selection are reduced
   * into, starting from the recipe's `base`, which is `undefined` when the
   * recipe has none. It is called for each result a recipe builds, so it
   * can return a new object each time.
   */
  readonly initial: (base: Value | undefined) => Accumulator;
  /**
   * Adds a value to the accumulator and returns the accumulator. It is
   * called with the values that apply to a selection, in order of
   * precedence: the value of each variant's selected option, in the order
   * of `variants`, then the value of each matching compound variant, in the
   * order of `compoundVariants`. An option or compound variant whose value
   * is `undefined` adds nothing.
   */
  readonly reduce: (accumulator: Accumulator, value: Value) => Accumulator;
  /**
   * Turns the accumulator into the result, for example by freezing it.
   * Without it, the result is the accumulator.
   */
  readonly finish?: ((accumulator: Accumulator) => Result) | undefined;
  /**
   * Whether a recipe builds the result of each declared selection once and
   * returns it again for the same selection, unless its config sets
   * `cache`. Defaults to `true`.
   */
  readonly cache?: boolean | undefined;
}

/**
 * Any selection, for variants whose names are not known at compile time,
 * such as `Record<string, Record<string, string>>`.
 */
type AnySelection = Readonly<Record<string, unknown>>;

/** The selection of a recipe, or any selection for unknown variant names. */
type KindSelection<
  Variants,
  DefaultedName extends keyof Variants,
> = string extends keyof Variants
  ? AnySelection
  : VariantSelection<Variants, DefaultedName>;

/** The condition of a compound variant, or any for unknown variant names. */
type KindCompoundCondition<Variants> = string extends keyof Variants
  ? AnySelection
  : CompoundCondition<Variants>;

/** The default variants of a recipe, or any for unknown variant names. */
type KindDefaultVariants<
  Variants,
  DefaultedName extends keyof Variants,
> = string extends keyof Variants
  ? AnySelection
  : DefaultVariants<Variants, DefaultedName>;

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
 */
interface KindRecipeConfig<
  Value,
  Variants extends KindVariants<Value>,
  DefaultedName extends keyof Variants,
> {
  /** The value that the values of every selection are added to. */
  readonly base?: Value | undefined;
  /** For each variant name, the value of each of its options. */
  readonly variants: Variants;
  /**
   * Values added when several variants have particular options at the same
   * time, applied in order after the values of the variants' options.
   */
  readonly compoundVariants?:
    readonly KindCompoundVariant<NoInfer<Variants>, Value>[] | undefined;
  /** The option each variant uses when the recipe is called without it. */
  readonly defaultVariants?:
    KindDefaultVariants<Variants, DefaultedName> | undefined;
  /** Whether the recipe caches its results. Defaults to the kind's `cache`. */
  readonly cache?: boolean | undefined;
}

/**
 * A recipe made from a {@link RecipeKind}: a function that returns the
 * result of a selection of variants, with the names of those variants in
 * `variantKeys`.
 *
 * @typeParam Selection - The variants the recipe accepts.
 * @typeParam Result - What the recipe returns.
 */
type KindRecipe<Selection, Result> = RecipeFunction<Selection, Result> & {
  /**
   * The names of the recipe's variants, in the order of
   * `Object.keys(config.variants)`.
   */
  readonly variantKeys: readonly VariantKey<Selection>[];
};

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
  const DefaultedName extends keyof Variants = never,
>(
  config: KindRecipeConfig<Value, Variants, DefaultedName>,
) => KindRecipe<KindSelection<Variants, DefaultedName>, Result>;

interface LooseRecipeKind {
  readonly initial: (base: unknown) => unknown;
  readonly reduce: (accumulator: unknown, value: unknown) => unknown;
  readonly finish?: ((accumulator: unknown) => unknown) | undefined;
  readonly cache?: boolean | undefined;
}

interface LooseKindRecipeConfig {
  readonly base?: unknown;
  readonly variants: KindVariants<unknown>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: SelectedVariants;
        readonly value: unknown;
      }[]
    | undefined;
  readonly defaultVariants?: SelectedVariants | undefined;
  readonly cache?: boolean | undefined;
}

type LooseKindRecipe = WithVariantKeys<
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
 * the names of its variants.
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
 * ```
 */
function createRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindRecipe<Value, Result>;

function createRecipeKind(kind: LooseRecipeKind): unknown {
  const { initial, reduce, finish } = kind;
  const kindCache = kind.cache ?? true;

  return (config: LooseKindRecipeConfig): LooseKindRecipe => {
    const { base } = config;
    const compiled = compileVariants<unknown>({
      compoundVariants: config.compoundVariants ?? [],
      defaultVariants: config.defaultVariants ?? {},
      noValue: undefined,
      variants: config.variants,
    });
    const reducer = { initial: (): unknown => initial(base), reduce };
    const build =
      finish === undefined
        ? (indexes: Int32Array): unknown =>
            reduceValues(compiled, indexes, reducer)
        : (indexes: Int32Array): unknown =>
            finish(reduceValues(compiled, indexes, reducer));
    const options = { cache: config.cache ?? kindCache };
    return withVariantKeys(createSelector(compiled, build, options), compiled);
  };
}

export { createRecipeKind };
export type {
  CreateKindRecipe,
  KindCompoundCondition,
  KindCompoundVariant,
  KindDefaultVariants,
  KindRecipe,
  KindRecipeConfig,
  KindSelection,
  KindVariants,
  RecipeKind,
};
