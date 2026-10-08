import type {
  CompoundCondition,
  DefaultVariants,
  NoUnknownComposedSlots,
  VariantOption,
  VariantSelection,
} from "./types.js";
import type { SlotValues } from "./slot-recipe-kind.js";

/**
 * Any selection, for variants whose names are not known at compile time,
 * such as `Record<string, Record<string, string>>`.
 */
type AnySelection = Readonly<Record<string, unknown>>;

/**
 * The selection that a recipe made from a `RecipeKind` accepts: the
 * {@link VariantSelection} of its variants, or any selection when the
 * variant names are not known at compile time. A function generic over a
 * config annotates the recipe it returns with it, as
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

/**
 * The type of `defaultVariants`: the defaults as written, checked. While an
 * editor completes them, TypeScript has not inferred their names and takes
 * `never`, which would allow no name; then it is a default for any variant.
 */
type WrittenKindDefaults<Variants, DefaultedName extends keyof Variants> = [
  DefaultedName,
] extends [never]
  ? {
      readonly [Name in keyof Variants]?: VariantOption<
        NoInfer<Variants>[Name]
      >;
    }
  : KindDefaultVariants<Variants, DefaultedName>;

/**
 * The check of the variants of a slot recipe: it rejects the slots that are
 * neither `Slot` nor `InheritedSlot`, and lists every slot in each option,
 * so that an editor completes their names and values. It leaves out the
 * slots named as a property of every object, such as `toString`, which an
 * option that does not give them would have with another type.
 */
type SlotVariantsCheck<
  Variants,
  Slot extends string,
  InheritedSlot extends string,
  Value,
> = NoUnknownComposedSlots<Variants, Slot, InheritedSlot> & {
  readonly [Name in keyof Variants]: {
    readonly [
      Option in keyof Variants[Name]
    ]: string extends keyof Variants[Name][Option]
      ? unknown
      : SlotValues<
          Exclude<Slot | InheritedSlot, keyof typeof Object.prototype>,
          Value
        >;
  };
};

export type {
  KindCompoundCondition,
  KindDefaultVariants,
  KindSelection,
  SlotVariantsCheck,
  WrittenKindDefaults,
};
