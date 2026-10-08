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
 * The type of a slot name that names no slot, `Name`, among the slots
 * `Slot`: no value is assignable to it, so an error names both.
 */
interface UnknownSlot<Name, Slot extends string> {
  readonly "~unknownSlot": Name;
  readonly "~slots": Slot;
}

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
      : {
          readonly [
            Unknown in Exclude<
              Exclude<keyof Variants[Name][Option], Slot>,
              InheritedSlot
            >
          ]?: UnknownSlot<Unknown, Slot | InheritedSlot>;
        };
  };
};

export type { NoUnknownComposedSlots, NoUnknownSlots, UnknownSlot };
