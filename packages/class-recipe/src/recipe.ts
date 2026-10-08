import type {
  Composable,
  ComposableKindRecipe,
  ComposedVariants,
  KindVariants,
  RecipeComposition,
} from "@lynstack/recipe";

import type {
  CompoundCondition,
  DefaultVariants,
  InheritedDefaultedName,
  RecipeFunction,
  Simplify,
  VariantDefaults,
  VariantKey,
  VariantOptions,
  VariantSelection,
} from "./types.js";
import type { LooseRecipe, LooseRecipeConfig } from "./compile-recipe.js";
import type { BuildOptions } from "./build-options.js";
import { createRecipeBuilder } from "./compile-recipe.js";
import { defaultBuildOptions } from "./build-options.js";

/**
 * The variants of a {@link RecipeConfig}: for each variant name, the classes
 * of each of its options.
 */
type RecipeVariants = KindVariants<string>;

/**
 * Classes added when several variants have particular options at the same
 * time.
 *
 * @typeParam Variants - The variant definitions of the recipe.
 */
interface CompoundVariant<Variants> {
  /**
   * The options that must all be selected for
   * {@link CompoundVariant.className} to apply.
   */
  readonly variants: CompoundCondition<Variants>;
  /** The classes added when the condition matches. */
  readonly className: string;
}

/**
 * The configuration of a recipe made by `createRecipe`.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 * @typeParam Composed - The types of the recipes that the recipe composes.
 */
interface RecipeConfig<
  Variants extends RecipeVariants,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindRecipe<string>[] = readonly [],
> {
  /**
   * Recipes whose config the recipe adds to its own, in order, as if it
   * were written in one config: their base classes first, the classes of
   * each of their options before its own, and their compound variants
   * first. A recipe composed several times counts once.
   */
  readonly composes?: Composed | undefined;
  /** Classes applied whatever the variants. */
  readonly base?: string | undefined;
  /**
   * For each variant name, the classes of each of its options. The names
   * `className` and `classNames` are reserved for overrides.
   */
  readonly variants: Variants & {
    readonly className?: never;
    readonly classNames?: never;
  };
  /**
   * Classes added when several variants have particular options at the same
   * time, applied in order after the variants' own classes.
   */
  readonly compoundVariants?:
    | readonly CompoundVariant<NoInfer<ComposedVariants<Composed, Variants>>>[]
    | undefined;
  /** The option each variant uses when a recipe is called without it. */
  readonly defaultVariants?:
    | DefaultVariants<ComposedVariants<Composed, Variants>, DefaultedName>
    | undefined;
  /**
   * Whether the recipe caches the class names of each declared selection.
   * Defaults to the `cache` option of `createRecipes`, which is `true`.
   */
  readonly cache?: boolean | undefined;
}

/**
 * The properties a recipe accepts: its variants and a `className` override.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
type RecipeProps<Variants, DefaultedName extends keyof Variants> = Simplify<
  VariantSelection<Variants, DefaultedName> & {
    /** Classes added last, after every class of the recipe. */
    readonly className?: string | undefined;
  }
>;

/**
 * A function that returns the class name for a selection of variants, with
 * the names of those variants in `variantKeys`, their options in
 * `variantOptions`, and their defaults in `defaultVariants`.
 *
 * @typeParam Props - The properties the recipe accepts; see
 *   {@link RecipeProps}.
 * @typeParam Composition - What the recipe passes on to the recipes that
 *   compose it, which its type carries under a `~composition` property that
 *   exists in the type only. Without it, the type does not allow composing
 *   the recipe.
 */
type Recipe<Props, Composition = unknown> = RecipeFunction<Props, string> & {
  /**
   * The names of the recipe's variants, in the order of
   * `Object.keys(config.variants)`. Use it to split a component's props into
   * the recipe's variants and the rest.
   */
  readonly variantKeys: readonly VariantKey<Props>[];
  /**
   * The names of the options of each variant, as strings, in the order in
   * which the recipe numbers them: integer names first, then `"false"` and
   * `"true"`, which a variant that declares either one has, then the others
   * in the order of the config. Use it to list every selection of the
   * recipe, such as in a story of each option.
   */
  readonly variantOptions: VariantOptions<Props>;
  /**
   * The option, as a string, that each variant uses when the recipe is
   * called without it: its default, or `"false"` for a variant whose only
   * options are `"true"` and `"false"`.
   */
  readonly defaultVariants: VariantDefaults<Props>;
} & Composable<Composition>;

/**
 * The recipe of a config whose variants, with those of the recipes it
 * composes, are `Variants`, and whose variants with a default are
 * `DefaultedName`.
 */
type ComposedRecipe<Variants, DefaultedName extends keyof Variants> = Recipe<
  RecipeProps<Variants, DefaultedName>,
  RecipeComposition<Variants, DefaultedName, string, undefined>
>;

/**
 * The type of {@link createRecipe}.
 *
 * @typeParam Variants - The variant definitions, inferred from
 *   `config.variants`.
 * @typeParam DefaultedName - The names of the variants that have a
 *   default, inferred from `config.defaultVariants`.
 * @typeParam Composed - The types of the recipes it composes, inferred from
 *   `config.composes`.
 * @param config - The recipes it composes, and the base classes, variants,
 *   compound variants, and default variants of the recipe.
 * @returns The recipe.
 */
type CreateRecipe = <
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<string>[] = readonly [],
>(
  config: RecipeConfig<Variants, DefaultedName, Composed>,
) => ComposedRecipe<
  ComposedVariants<Composed, Variants>,
  DefaultedName | InheritedDefaultedName<Composed, Variants>
>;

/**
 * Returns a `createRecipe` whose recipes combine their classes with
 * `options.join` and cache them unless `options.cache` is false.
 */
function makeCreateRecipe(options: BuildOptions): CreateRecipe;

function makeCreateRecipe(options: BuildOptions): unknown {
  const buildRecipe = createRecipeBuilder(options);
  return (config: LooseRecipeConfig): LooseRecipe => buildRecipe(config);
}

/**
 * Creates a recipe: a function that returns the class name of one element
 * for a selection of variants. Its classes are joined with {@link cx}; use
 * `createRecipes` to join them with another function, such as `twMerge`, or
 * to turn off the cache.
 *
 * @remarks
 * The class name of each selection is built once and cached, so calling a
 * recipe again with the same variants costs one lookup per variant and one
 * for the cache. A `className` passed to the recipe is joined after the
 * cached classes. The cache keeps up to one class name for each combination
 * of declared options; set `cache: false` in the config of a recipe whose
 * variants come from untrusted input.
 *
 * A variant without a default is required, except a boolean variant, whose
 * only options are `"true"` and `"false"` and which defaults to `false`. An
 * option that the config does not declare adds no classes. The recipe's
 * `variantKeys` property lists the names of its variants, `variantOptions`
 * the names of the options of each, and `defaultVariants` the option each
 * uses when the recipe is called without it.
 *
 * A recipe composes the recipes listed in its config's `composes` as if
 * their configs and its own were one: their base classes first, then the
 * classes of each option, in the order of the recipes, then their compound
 * variants before its own; the default of a variant is the last one given.
 * A recipe composed several times counts once.
 *
 * Classes are added, never removed, so without a join function that merges
 * them, set each CSS property of an element in one place; see
 * {@link https://lynstack.github.io/recipe/class-recipe/conflict-free-recipes/ | Writing conflict-free recipes}.
 *
 * @example
 * ```ts
 * const button = createRecipe({
 *   base: "inline-flex items-center rounded-md",
 *   variants: {
 *     tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
 *     size: { sm: "h-8 px-2", md: "h-10 px-4" },
 *   },
 *   compoundVariants: [
 *     { variants: { tone: "danger", size: "md" }, className: "font-semibold" },
 *   ],
 *   defaultVariants: { size: "md" },
 * });
 *
 * button({ tone: "danger" });
 * // => "inline-flex items-center rounded-md bg-red-600 text-white h-10 px-4 font-semibold"
 *
 * button({ tone: "neutral", size: "sm", className: "w-full" });
 * // => "inline-flex items-center rounded-md bg-gray-100 h-8 px-2 w-full"
 *
 * button.variantKeys; // => ["tone", "size"]
 * button.variantOptions; // => { tone: ["neutral", "danger"], size: ["sm", "md"] }
 * button.defaultVariants; // => { size: "md" }
 *
 * const iconButton = createRecipe({
 *   composes: [button],
 *   variants: { size: { icon: "size-10" } },
 * });
 *
 * iconButton({ tone: "neutral", size: "icon" });
 * // => "inline-flex items-center rounded-md bg-gray-100 size-10"
 * ```
 */
const createRecipe: CreateRecipe = makeCreateRecipe(defaultBuildOptions);

/**
 * A shorter name for {@link createRecipe}: the same function, taking the
 * same config.
 *
 * @example
 * ```ts
 * const badge = cva({
 *   base: "rounded-full px-2 text-xs",
 *   variants: { tone: { neutral: "bg-gray-100", danger: "bg-red-100" } },
 * });
 *
 * badge({ tone: "danger" }); // => "rounded-full px-2 text-xs bg-red-100"
 * ```
 */
const cva: CreateRecipe = createRecipe;

export { createRecipe, cva, makeCreateRecipe };
export type {
  CompoundVariant,
  CreateRecipe,
  Recipe,
  RecipeConfig,
  RecipeProps,
  RecipeVariants,
};
