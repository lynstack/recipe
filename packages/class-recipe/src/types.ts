/**
 * Turns a type's intersections into a single object type, so editors show
 * its properties instead of the types it was built from.
 */
type Simplify<Type> = { [Key in keyof Type]: Type[Key] };

type KeyName<Key> = Key extends string
  ? Key
  : Key extends number
    ? `${Key}`
    : never;

/**
 * The name of each variant in a recipe's props, as a string.
 *
 * @typeParam Props - The properties the recipe accepts.
 */
type VariantKey<Props> = KeyName<
  Exclude<keyof Props, "className" | "classNames">
>;

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
type VariantsOf<Recipe extends (props: never) => unknown> = Simplify<
  Omit<NonNullable<Parameters<Recipe>[0]>, "className" | "classNames">
>;

export type {
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantOption,
  VariantSelection,
} from "@lynstack/recipe";
export type { Simplify, VariantKey, VariantsOf };
