/**
 * Recipes for values of any type: create a kind of recipe from how it
 * combines values, such as class names or style objects, then create
 * recipes of that kind, which map a selection of variants to a result.
 * `@lynstack/class-recipe` builds its class name recipes on it.
 *
 * @packageDocumentation
 */

export { createRecipeKind } from "./recipe-kind.js";
export type {
  CreateKindRecipe,
  KindCompoundVariant,
  KindRecipe,
  KindRecipeConfig,
  KindVariants,
  RecipeKind,
} from "./recipe-kind.js";
export type {
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantOption,
  VariantSelection,
} from "./types.js";
