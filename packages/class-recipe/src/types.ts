import type {
  KindRecipe,
  VariantKey as KindVariantKey,
  VariantsOf as KindVariantsOf,
  VariantSelection,
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

/** A recipe of the engine whose selection is the variants of `Props`. */
type KindRecipeOf<Props> = KindRecipe<Omit<Props, OverrideName>, unknown>;

/**
 * The names of the options of each variant in a recipe's props, as strings.
 *
 * @typeParam Props - The properties the recipe accepts.
 */
type VariantOptions<Props> = KindRecipeOf<Props>["variantOptions"];

/**
 * The option, as a string, that each variant a recipe's props may leave out
 * uses then.
 *
 * @typeParam Props - The properties the recipe accepts.
 */
type VariantDefaults<Props> = KindRecipeOf<Props>["defaultVariants"];

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
 * The props a recipe accepts: its variants, and its `className` override,
 * or `classNames` for a slot recipe. Use it to type a component that
 * passes these props on to its recipe.
 *
 * @typeParam Recipe - The type of a recipe made by `createRecipe` or
 *   `createSlotRecipe`.
 *
 * @example
 * ```ts
 * const button = createRecipe({ variants: { size: { sm: "h-8", md: "h-10" } } });
 *
 * type ButtonProps = PropsOf<typeof button>;
 * // => { readonly size: "sm" | "md"; readonly className?: string | undefined }
 * ```
 */
type PropsOf<Recipe extends (props: never) => unknown> = Simplify<
  NonNullable<Parameters<Recipe>[0]>
>;

/**
 * Removes the classes by slot that the props of a slot recipe with variant
 * names unknown at compile time allow next to options; an option is never
 * an object.
 */
type OptionsOnly<Variants> = {
  [Name in keyof Variants]: Exclude<Variants[Name], object>;
};

/**
 * Classes for some of a slot recipe's slots, keyed by slot name.
 *
 * @typeParam Slot - The names of the slots.
 */
type SlotClasses<Slot extends string> = Readonly<
  Partial<Record<Slot, string | undefined>>
>;

/**
 * The class name of every slot, keyed by slot name, as returned by a slot
 * recipe.
 *
 * @typeParam Slot - The names of the slots.
 */
type SlotClassNames<Slot extends string> = Readonly<Record<Slot, string>>;

/**
 * Rejects the slots of each option's classes that `Slot` does not name,
 * unless the option's slot names are not known at compile time.
 */
type NoUnknownSlots<Variants, Slot extends string> = {
  readonly [Name in keyof Variants]: {
    readonly [
      Option in keyof Variants[Name]
    ]: string extends keyof Variants[Name][Option]
      ? unknown
      : Readonly<Record<Exclude<keyof Variants[Name][Option], Slot>, never>>;
  };
};

/**
 * The variants of a slot recipe whose variant names are not known at
 * compile time. Every property but `classNames` is a variant, which
 * TypeScript cannot express, so a value may also be classes by slot.
 */
type WideSelection<Slot extends string> = Readonly<
  Record<string, string | SlotClasses<Slot> | undefined>
>;

/**
 * The properties a slot recipe accepts: its variants and a `classNames`
 * override for each slot.
 *
 * When the variant names are not known at compile time, every property but
 * `classNames` may be a variant, whose option is named by a string.
 * TypeScript cannot leave `classNames` out of those names, so a variant
 * also accepts classes by slot, which select no option.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 */
type SlotRecipeProps<
  Slot extends string,
  Variants,
  DefaultedName extends keyof Variants,
> = Simplify<
  (string extends keyof Variants
    ? WideSelection<Slot>
    : VariantSelection<Variants, DefaultedName>) & {
    /** Classes added last to each slot, after every class of the recipe. */
    readonly classNames?: SlotClasses<Slot> | undefined;
  }
>;

export type {
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantOption,
  VariantSelection,
} from "@lynstack/recipe";
export type {
  NoUnknownSlots,
  PropsOf,
  Simplify,
  SlotClasses,
  SlotClassNames,
  SlotRecipeProps,
  VariantDefaults,
  VariantKey,
  VariantOptions,
  VariantsOf,
};
