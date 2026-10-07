import type {
  Composable,
  ComposableKindSlotRecipe,
  ComposedDefaultedName,
  ComposedSlot,
  ComposedVariants,
  KindVariants,
  RecipeComposition,
} from "@lynstack/recipe";

import type {
  CompoundCondition,
  DefaultVariants,
  NoUnknownSlots,
  RecipeFunction,
  SlotClassNames,
  SlotClasses,
  SlotRecipeProps,
  VariantKey,
} from "./types.js";
import type {
  LooseSlotRecipe,
  LooseSlotRecipeConfig,
} from "./compile-slot-recipe.js";
import type { BuildOptions } from "./build-options.js";
import { buildSlotRecipe } from "./compile-slot-recipe.js";
import { defaultBuildOptions } from "./build-options.js";

/**
 * The variants of a {@link SlotRecipeConfig}: for each variant name, the
 * classes of each slot for each of its options.
 */
type SlotRecipeVariants = KindVariants<SlotClasses<string>>;

/**
 * Classes added to some slots when several variants have particular options
 * at the same time.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Variants - The variant definitions of the slot recipe.
 */
interface SlotCompoundVariant<Slot extends string, Variants> {
  /**
   * The options that must all be selected for
   * {@link SlotCompoundVariant.classNames} to apply.
   */
  readonly variants: CompoundCondition<Variants>;
  /** The classes added to each slot when the condition matches. */
  readonly classNames: SlotClasses<Slot>;
}

/**
 * The configuration of a slot recipe made by `createSlotRecipe`.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Variants - The variant definitions, keyed by variant name.
 * @typeParam DefaultedName - The names of the variants that have a default.
 * @typeParam Composed - The types of the slot recipes that it composes.
 */
interface SlotRecipeConfig<
  Slot extends string,
  Variants extends SlotRecipeVariants,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindSlotRecipe<string>[] = readonly [],
> {
  /**
   * Slot recipes whose config the recipe adds to its own, in order, as if
   * it were written in one config: their slots and base classes first, the
   * classes of each of their options before its own, and their compound
   * variants first. A slot recipe composed several times counts once.
   */
  readonly composes?: Composed | undefined;
  /**
   * The names of the elements the recipe styles, after those of the slot
   * recipes it composes.
   */
  readonly slots: readonly Slot[];
  /** Classes applied to each slot whatever the variants. */
  readonly base?:
    SlotClasses<NoInfer<ComposedSlot<Composed, Slot>>> | undefined;
  /**
   * For each variant name, the classes of each slot for each of its options.
   * The names `className` and `classNames` are reserved for overrides.
   */
  readonly variants: Variants &
    NoUnknownSlots<Variants, NoInfer<ComposedSlot<Composed, Slot>>> & {
      readonly className?: never;
      readonly classNames?: never;
    };
  /**
   * Classes added to some slots when several variants have particular
   * options at the same time, applied in order after the variants' own
   * classes.
   */
  readonly compoundVariants?:
    | readonly SlotCompoundVariant<
        NoInfer<ComposedSlot<Composed, Slot>>,
        NoInfer<ComposedVariants<Composed, Variants>>
      >[]
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
 * A function that returns the class name of every slot for a selection of
 * variants, with the names of those variants in `variantKeys`.
 *
 * @typeParam Slot - The names of the slots.
 * @typeParam Props - The properties the recipe accepts; see
 *   {@link SlotRecipeProps}.
 * @typeParam Composition - What the slot recipe passes on to the slot
 *   recipes that compose it, under a `~composition` property that exists in
 *   the type only. Without it, the type does not allow composing it.
 */
type SlotRecipe<
  Slot extends string,
  Props,
  Composition = unknown,
> = RecipeFunction<Props, SlotClassNames<Slot>> & {
  /**
   * The names of the recipe's variants, in the order of
   * `Object.keys(config.variants)`. Use it to split a component's props into
   * the recipe's variants and the rest.
   */
  readonly variantKeys: readonly VariantKey<Props>[];
} & Composable<Composition>;

/**
 * The type of {@link createSlotRecipe}.
 *
 * @typeParam Slot - The names of the slots, inferred from `config.slots`.
 * @typeParam Variants - The variant definitions, inferred from
 *   `config.variants`.
 * @typeParam DefaultedName - The names of the variants that have a
 *   default, inferred from `config.defaultVariants`.
 * @typeParam Composed - The types of the slot recipes it composes, inferred
 *   from `config.composes`.
 * @param config - The slot recipes it composes, and the slots, base
 *   classes, variants, compound variants, and default variants of the
 *   recipe.
 * @returns The slot recipe.
 */
type CreateSlotRecipe = <
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<string>[] =
    readonly [],
>(
  config: SlotRecipeConfig<Slot, Variants, DefaultedName, Composed>,
) => ComposedSlotRecipe<
  ComposedSlot<Composed, Slot>,
  ComposedVariants<Composed, Variants>,
  ComposedDefaultedName<Composed, DefaultedName>
>;

/** The slot recipe of a config with the slot recipes it composes. */
type ComposedSlotRecipe<
  Slot extends string,
  Variants,
  DefaultedName,
> = SlotRecipe<
  Slot,
  SlotRecipeProps<Slot, Variants, Extract<DefaultedName, keyof Variants>>,
  RecipeComposition<
    Variants,
    Extract<DefaultedName, keyof Variants>,
    string,
    readonly Slot[]
  >
>;

/**
 * Returns a `createSlotRecipe` whose recipes combine their classes with
 * `options.join` and cache them unless `options.cache` is false.
 */
function makeCreateSlotRecipe(options: BuildOptions): CreateSlotRecipe;

function makeCreateSlotRecipe(options: BuildOptions): unknown {
  return (config: LooseSlotRecipeConfig): LooseSlotRecipe =>
    buildSlotRecipe(config, options);
}

/**
 * Creates a slot recipe: a function that returns the class name of each
 * element of a component, its slots, for a selection of variants. Their
 * classes are joined with {@link cx}; use `createRecipes` to join them with
 * another function, such as `twMerge`, or to turn off the cache.
 *
 * @remarks
 * The class names of each selection are built once and cached in a frozen
 * object, so calling a slot recipe again with the same variants returns the
 * same object. Passing `classNames` with classes for at least one slot
 * returns a new frozen object, with each override joined after the cached
 * classes of its slot. The cache keeps up to one object for each
 * combination of declared options; set `cache: false` in the config of a
 * slot recipe whose variants come from untrusted input.
 *
 * Every declared slot is present in the result, as `""` when it has no
 * classes. A variant without a default is required, except a boolean
 * variant, whose only options are `"true"` and `"false"` and which defaults
 * to `false`. An option that the config does not declare adds no classes.
 * The recipe's `variantKeys` property lists the names of its variants.
 *
 * A slot recipe composes the slot recipes listed in `composes` as a recipe
 * composes recipes, and has the slots of each, theirs first.
 *
 * Classes are added, never removed, so without a join function that merges
 * them, set each CSS property of an element in one place; see
 * {@link https://lynstack.github.io/recipe/class-recipe/conflict-free-recipes/ | Writing conflict-free recipes}.
 *
 * @example
 * ```ts
 * const card = createSlotRecipe({
 *   slots: ["root", "title"],
 *   base: { root: "rounded-lg border", title: "font-medium" },
 *   variants: {
 *     size: {
 *       sm: { root: "p-2", title: "text-sm" },
 *       md: { root: "p-4", title: "text-base" },
 *     },
 *   },
 *   defaultVariants: { size: "md" },
 * });
 *
 * const classNames = card({ classNames: { root: "shadow" } });
 * classNames.root; // => "rounded-lg border p-4 shadow"
 * classNames.title; // => "font-medium text-base"
 * card.variantKeys; // => ["size"]
 *
 * const dialog = createSlotRecipe({
 *   composes: [card],
 *   slots: ["footer"],
 *   base: { root: "shadow-lg", footer: "flex justify-end" },
 *   variants: {},
 * });
 *
 * dialog().root; // => "rounded-lg border shadow-lg p-4"
 * dialog().footer; // => "flex justify-end"
 * ```
 */
const createSlotRecipe: CreateSlotRecipe =
  makeCreateSlotRecipe(defaultBuildOptions);

/**
 * A shorter name for {@link createSlotRecipe}: the same function, taking the
 * same config.
 *
 * @example
 * ```ts
 * const field = sva({
 *   slots: ["label", "input"],
 *   base: { label: "text-sm", input: "rounded-md border" },
 *   variants: {
 *     invalid: {
 *       true: { label: "text-red-700", input: "border-red-600" },
 *       false: { input: "border-gray-300" },
 *     },
 *   },
 * });
 *
 * const classNames = field({ invalid: true });
 * classNames.label; // => "text-sm text-red-700"
 * classNames.input; // => "rounded-md border border-red-600"
 * ```
 */
const sva: CreateSlotRecipe = createSlotRecipe;

export { createSlotRecipe, makeCreateSlotRecipe, sva };
export type {
  CreateSlotRecipe,
  SlotCompoundVariant,
  SlotRecipe,
  SlotRecipeConfig,
  SlotRecipeVariants,
};
