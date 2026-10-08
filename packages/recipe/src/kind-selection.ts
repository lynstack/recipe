import type {
  CompoundCondition,
  DefaultVariants,
  VariantSelection,
} from "./types.js";

/**
 * Any selection, for variants whose names are not known at compile time,
 * such as `Record<string, Record<string, string>>`.
 */
type AnySelection = Readonly<Record<string, unknown>>;

/**
 * The selection that a recipe made from a `RecipeKind` accepts: the
 * {@link VariantSelection} of its variants, or any selection when the
 * variant names are not known at compile time. Annotate with it the recipe
 * that a function generic over a config returns, as
 * `KindRecipe<KindSelection<Variants, DefaultedName>, Result>`.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
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

export type { KindCompoundCondition, KindDefaultVariants, KindSelection };
