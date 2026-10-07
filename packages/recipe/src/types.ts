/**
 * Turns a type's intersections into a single object type, so editors show
 * its properties instead of the types it was built from.
 */
type Simplify<Type> = { [Key in keyof Type]: Type[Key] };

type OptionName<Options> = `${Extract<keyof Options, string | number>}`;

type BooleanName = "true" | "false";

type NumberOption<Options> = Extract<keyof Options, number>;

type BooleanOption<Name extends string> = [Extract<Name, BooleanName>] extends [
  never,
]
  ? never
  : BooleanName | boolean;

type BooleanVariantName<Variants> = {
  [Name in keyof Variants]: [OptionName<Variants[Name]>] extends [never]
    ? never
    : [OptionName<Variants[Name]>] extends [BooleanName]
      ? Name
      : never;
}[keyof Variants];

/**
 * The values accepted for one variant: the names of its options, as
 * strings or, for numeric names, as numbers, plus `true`, `false`, `"true"`,
 * and `"false"` when it declares an option named `"true"` or `"false"`.
 *
 * @typeParam Options - The options of the variant, keyed by option name.
 */
type VariantOption<Options> =
  | OptionName<Options>
  | NumberOption<Options>
  | BooleanOption<OptionName<Options>>;

/**
 * The variants a selection names. A variant with a default may be omitted,
 * and so may a boolean variant, whose only options are `"true"` and
 * `"false"`; any other variant is required.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
type VariantSelection<
  Variants,
  DefaultedName extends keyof Variants,
> = Simplify<
  {
    readonly [
      Name in Exclude<
        keyof Variants,
        DefaultedName | BooleanVariantName<Variants>
      >
    ]: VariantOption<Variants[Name]>;
  } & {
    readonly [Name in DefaultedName | BooleanVariantName<Variants>]?:
      VariantOption<Variants[Name]> | undefined;
  }
>;

/**
 * The option each defaulted variant uses when a selection leaves it out.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
type DefaultVariants<Variants, DefaultedName extends keyof Variants> = {
  readonly [Name in DefaultedName]: VariantOption<NoInfer<Variants>[Name]>;
};

/**
 * The condition of a compound variant: for each variant it names, the option
 * or the list of options that it matches. A variant left out matches any
 * option.
 *
 * @typeParam Variants - The variant definitions, keyed by variant name.
 */
type CompoundCondition<Variants> = {
  readonly [Name in keyof Variants]?:
    | VariantOption<Variants[Name]>
    | readonly VariantOption<Variants[Name]>[]
    | undefined;
};

/**
 * A function that takes the properties of a selection, whose argument is
 * optional when every property of `Props` is.
 *
 * @typeParam Props - The properties the function accepts.
 * @typeParam Result - What the function returns.
 */
type RecipeFunction<Props, Result> =
  Partial<Props> extends Props
    ? (props?: Props) => Result
    : (props: Props) => Result;

type KeyName<Key> = Key extends string
  ? Key
  : Key extends number
    ? `${Key}`
    : never;

/**
 * The name of each variant in a selection, as a string, as a recipe lists
 * it in `variantKeys`.
 *
 * @typeParam Selection - The variants a recipe accepts.
 */
type VariantKey<Selection> = KeyName<keyof Selection>;

/**
 * The variants a recipe accepts. Use it to type the props of a component
 * built on a recipe.
 *
 * @typeParam Recipe - The type of a recipe, such as one created by the
 *   function that `createRecipeKind` returns.
 *
 * @example
 * ```ts
 * const box = styleRecipe({
 *   variants: { size: { sm: { padding: 4 }, md: { padding: 8 } } },
 *   defaultVariants: { size: "md" },
 * });
 *
 * type BoxVariants = VariantsOf<typeof box>;
 * // => { readonly size?: "sm" | "md" | undefined }
 * ```
 */
type VariantsOf<Recipe extends (props: never) => unknown> = Simplify<
  NonNullable<Parameters<Recipe>[0]>
>;

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

export type {
  AnySelection,
  KindCompoundCondition,
  KindDefaultVariants,
  KindSelection,
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  Simplify,
  VariantOption,
  VariantKey,
  VariantSelection,
  VariantsOf,
};
