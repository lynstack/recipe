import type {
  VariantKey as KindVariantKey,
  VariantsOf as KindVariantsOf,
} from "@lynstack/recipe";

/**
 * Turns a type's intersections into a single object type, so editors show
 * its properties instead of the types it was built from.
 */
type Simplify<Type> = { [Key in keyof Type]: Type[Key] };

/** The props of a recipe that override its classes, which are not variants. */
type OverrideName = "className" | "classNames";

/**
 * The name of each variant in a recipe's props, as a string.
 *
 * @typeParam Props - The properties the recipe accepts.
 */
type VariantKey<Props> = KindVariantKey<Omit<Props, OverrideName>>;

/**
 * The variants a recipe accepts, without its `className` or `classNames`
 * property. Use it to type the props of a component built on a recipe.
 *
 * @typeParam Recipe - The type of a recipe made by `createRecipe` or
 *   `createSlotRecipe`.
 *
 * @example
 * ```ts
 * const button = createRecipe({ variants: { size: { sm: "h-8", md: "h-10" } } });
 *
 * type ButtonVariants = VariantsOf<typeof button>;
 * // => { readonly size: "sm" | "md" }
 * ```
 */
type VariantsOf<Recipe extends (props: never) => unknown> = OptionsOnly<
  Omit<KindVariantsOf<Recipe>, OverrideName>
>;

/**
 * Removes the classes by slot that the props of a slot recipe with variant
 * names unknown at compile time allow next to options; an option is never
 * an object.
 */
type OptionsOnly<Variants> = {
  [Name in keyof Variants]: Exclude<Variants[Name], object>;
};

export type {
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantOption,
  VariantSelection,
} from "@lynstack/recipe";
export type { Simplify, VariantKey, VariantsOf };
