/**
 * Recipes for values of any type: create a kind of recipe from how it
 * combines values, such as class names or style objects, then create
 * recipes of that kind, which map a selection of variants to a result, or
 * slot recipes, which map it to the result of each of several slots.
 * `@lynstack/class-recipe` builds its class name recipes on it.
 *
 * @packageDocumentation
 */

export { createRecipeKind } from "./recipe-kind.js";
export type {
  CreateKindRecipe,
  KindCompoundVariant,
  KindRecipeConfig,
  KindVariants,
} from "./recipe-kind.js";
export type { KindRecipeOf, KindSlotRecipeOf } from "./recipe-of.js";
export { createSlotRecipeKind } from "./slot-recipe-kind.js";
export type {
  CreateKindSlotRecipe,
  KindSlotCompoundVariant,
  KindSlotRecipeConfig,
  KindSlotVariants,
  SlotValues,
} from "./slot-recipe-kind.js";
export type {
  Composable,
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedDefaultedName,
  ComposedSlot,
  ComposedVariants,
  InheritedDefaultedName,
  InheritedSlot,
  RecipeComposition,
} from "./composition.js";
export type {
  CompoundCondition,
  DefaultVariants,
  KindRecipe,
  RecipeFunction,
  RecipeKind,
  VariantKey,
  VariantOption,
  VariantSelection,
  VariantsOf,
} from "./types.js";
export type { KindSelection } from "./kind-selection.js";
export type { NoUnknownSlots, UnknownSlot } from "./unknown-slots.js";
