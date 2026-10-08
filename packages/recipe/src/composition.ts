import type { KindRecipe } from "./recipe-kind.js";
import type { KindSelection } from "./kind-selection.js";

/**
 * What a recipe passes on, in its type only, to the recipes that compose
 * it.
 *
 * @typeParam Variants - The variant definitions of the recipe, keyed by
 *   variant name.
 * @typeParam DefaultedName - The names of its variants that have a default.
 * @typeParam Value - The value of an option.
 * @typeParam Slots - The names of the slots of a slot recipe, as a list,
 *   or `undefined` for a recipe without slots.
 */
interface RecipeComposition<Variants, DefaultedName, Value, Slots> {
  readonly variants: Variants;
  readonly defaultedName: DefaultedName;
  readonly value: Value;
  readonly slots: Slots;
}

/**
 * Marks the type of a recipe that other recipes can compose, with what it
 * passes on to them, under `~composition`. The property exists in the type
 * only: a recipe never has it at runtime.
 *
 * @typeParam Composition - What the recipe passes on, a
 *   {@link RecipeComposition}, or `unknown` for a recipe that cannot be
 *   composed, which the type then leaves unmarked.
 */
type Composable<Composition> = unknown extends Composition
  ? unknown
  : { readonly "~composition"?: Composition | undefined };

/** What a recipe of type `Recipe` passes on to the recipes that compose it. */
type CompositionOf<Recipe> = Recipe extends {
  readonly "~composition"?: infer Composition;
}
  ? Exclude<Composition, undefined>
  : never;

/** What the recipes of `Composed` pass on under `Part`, as a union. */
type ComposedPart<
  Composed extends readonly unknown[],
  Part extends keyof RecipeComposition<unknown, unknown, unknown, unknown>,
> = ValueOfEach<CompositionOf<Composed[number]>, Part>;

/** The keys of each type of the union `Union`. */
type KeyOfEach<Union> = Union extends unknown ? keyof Union : never;

/** The values that the types of the union `Union` give to `Key`. */
type ValueOfEach<Union, Key extends PropertyKey> = Union extends unknown
  ? Key extends keyof Union
    ? Union[Key]
    : never
  : never;

/** One object with the keys of each object of `Union`. */
type MergeEach<Union> = {
  readonly [Key in KeyOfEach<Union>]: ValueOfEach<Union, Key>;
};

/**
 * The variants of a recipe that composes the recipes of `Composed`: the
 * variants of each, and of `Variants`, with the options of each variant
 * that any of them declares.
 *
 * @typeParam Composed - The types of the recipes composed.
 * @typeParam Variants - The variant definitions of the recipe's own config.
 */
type ComposedVariants<Composed extends readonly unknown[], Variants> = [
  Composed[number],
] extends [never]
  ? Variants
  : MergeVariants<ComposedPart<Composed, "variants"> | Variants>;

type MergeVariants<Union> = {
  readonly [Name in KeyOfEach<Union>]: MergeEach<ValueOfEach<Union, Name>>;
};

/**
 * The names of the variants with a default in a recipe that composes the
 * recipes of `Composed`: those of each, and `DefaultedName`.
 *
 * @typeParam Composed - The types of the recipes composed.
 * @typeParam DefaultedName - The names of the variants with a default in the
 *   recipe's own config.
 */
type ComposedDefaultedName<Composed extends readonly unknown[], DefaultedName> =
  DefaultedName | ComposedPart<Composed, "defaultedName">;

/**
 * The names of the variants that the recipes of `Composed` give a default,
 * among the variants of a recipe that composes them with its own
 * `Variants`. Kept apart from the recipe's own defaulted names, so that a
 * recipe that composes nothing has exactly those, even when they are
 * generic.
 */
type InheritedDefaultedName<
  Composed extends readonly unknown[],
  Variants,
> = Extract<
  ComposedPart<Composed, "defaultedName">,
  keyof ComposedVariants<Composed, Variants>
>;

/**
 * The slots of a slot recipe that composes the slot recipes of `Composed`:
 * those of each, and `Slot`.
 *
 * @typeParam Composed - The types of the slot recipes composed.
 * @typeParam Slot - The names of the slots of the recipe's own config.
 */
type ComposedSlot<Composed extends readonly unknown[], Slot extends string> =
  Slot | SlotOf<ComposedPart<Composed, "slots">>;

type SlotOf<Slots> = Slots extends readonly (infer Slot extends string)[]
  ? Slot
  : never;

/**
 * A recipe that a recipe whose values are of type `Value` can compose: a
 * recipe without slots, whose values are of type `Value`.
 *
 * @typeParam Value - The value of an option of the recipe that composes it.
 */
type ComposableKindRecipe<Value> = Composable<
  RecipeComposition<object, PropertyKey, Value, undefined>
>;

/**
 * A slot recipe that a slot recipe whose values are of type `Value` can
 * compose: a slot recipe whose values are of type `Value`.
 *
 * @typeParam Value - The value of a slot of the slot recipe that composes
 *   it.
 */
type ComposableKindSlotRecipe<Value> = Composable<
  RecipeComposition<object, PropertyKey, Value, readonly string[]>
>;

/**
 * The recipe of a config whose variants, once composed, are `Variants`, and
 * whose variants with a default are `DefaultedName`.
 */
type ComposedKindRecipe<
  Variants,
  DefaultedName extends keyof Variants,
  Value,
  Result,
  Slots,
> = KindRecipe<
  KindSelection<Variants, DefaultedName>,
  Result,
  RecipeComposition<Variants, DefaultedName, Value, Slots>
>;

export type {
  Composable,
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedDefaultedName,
  ComposedKindRecipe,
  ComposedSlot,
  ComposedVariants,
  InheritedDefaultedName,
  RecipeComposition,
};
