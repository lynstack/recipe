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

/** The name of an option that a selection accepts, as a string. */
type OptionNameOf<Option> = Option extends string | number | boolean
  ? `${Option}`
  : string;

/**
 * The names of the options of each variant in a selection, as strings, as a
 * recipe lists them in `variantOptions`.
 *
 * @typeParam Selection - The variants a recipe accepts.
 */
type VariantOptions<Selection> = {
  readonly [Name in keyof Selection as KeyName<Name>]-?: readonly OptionNameOf<
    Exclude<Selection[Name], undefined>
  >[];
};

/**
 * The option, as a string, that each variant a selection may leave out
 * uses then, as a recipe lists it in `defaultVariants`.
 *
 * @typeParam Selection - The variants a recipe accepts.
 */
type SelectionDefaults<Selection> = string extends keyof Selection
  ? Readonly<Record<string, string>>
  : {
      readonly [
        Name in keyof Selection as Pick<Selection, Name> extends Required<
          Pick<Selection, Name>
        >
          ? never
          : KeyName<Name>
      ]-?: OptionNameOf<Exclude<Selection[Name], undefined>>;
    };

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
   * Returns one value that adds to an accumulator what `first` then
   * `second` add. A recipe that composes other recipes calls it when it is
   * created, to combine the bases of its recipes, and the values that its
   * recipes give one option, so that it reduces one value for each, as the
   * one config it stands for would. Without it, such a recipe reduces each
   * value. It must not change `first` or `second`, which other recipes
   * share, and the kind must then follow two rules. In each, the two
   * accumulators must be interchangeable: `finish` returns the same result
   * for both, and again after the same values are reduced into each.
   *
   * - Reducing `first` then `second` into an accumulator gives what
   *   reducing `combine(first, second)` gives.
   * - `initial(base)` gives what reducing `base` into `initial(undefined)`
   *   gives.
   */
  readonly combine?: ((first: Value, second: Value) => Value) | undefined;
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
 * Rejects the slots of each option's values that `Slot` does not name,
 * unless the option's slot names are not known at compile time. A library
 * that wraps slot recipes intersects its variants with it, as
 * `KindSlotRecipeConfig` does, so that a value for an unknown slot is a
 * type error.
 *
 * @typeParam Variants - The variants of a slot recipe's config.
 * @typeParam Slot - The names of the slots.
 *
 * @example
 * ```ts
 * interface SlotConfig<Slot extends string, Variants> {
 *   readonly slots: readonly Slot[];
 *   readonly variants: Variants & NoUnknownSlots<Variants, NoInfer<Slot>>;
 * }
 * ```
 */
type NoUnknownSlots<Variants, Slot extends string> = NoUnknownComposedSlots<
  Variants,
  Slot,
  never
>;

/**
 * Rejects the slots of the variants' options that are neither `Slot` nor
 * `InheritedSlot`. A recipe's own slots are excluded first, so that they
 * are accepted even when the inherited slots are generic.
 */
type NoUnknownComposedSlots<
  Variants,
  Slot extends string,
  InheritedSlot extends string,
> = {
  readonly [Name in keyof Variants]: {
    readonly [
      Option in keyof Variants[Name]
    ]: string extends keyof Variants[Name][Option]
      ? unknown
      : Readonly<
          Partial<
            Record<
              Exclude<
                Exclude<keyof Variants[Name][Option], Slot>,
                InheritedSlot
              >,
              never
            >
          >
        >;
  };
};

export type {
  CompoundCondition,
  DefaultVariants,
  NoUnknownComposedSlots,
  NoUnknownSlots,
  RecipeFunction,
  RecipeKind,
  SelectionDefaults,
  Simplify,
  VariantOption,
  VariantKey,
  VariantOptions,
  VariantSelection,
  VariantsOf,
};
