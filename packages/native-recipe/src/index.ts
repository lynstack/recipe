/**
 * Fast, type-safe React Native style recipes with variants, compound
 * variants, and slots. A recipe returns the same frozen style for the same
 * variants, so the `style` prop keeps its identity between renders.
 *
 * @packageDocumentation
 */

export { createSlotStyleRecipe } from "./slot-style-recipe.js";
export type {
  SlotStyleCompoundVariant,
  SlotStyleRecipe,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
} from "./slot-style-recipe.js";
export { createStyleRecipe } from "./style-recipe.js";
export type {
  StyleCompoundVariant,
  StyleRecipe,
  StyleRecipeConfig,
  StyleRecipeVariants,
} from "./style-recipe.js";
export { createThemedRecipes } from "./themed-recipes.js";
export type { ThemedRecipe, ThemedRecipeCreators } from "./themed-recipes.js";
export type {
  ComposedSlot,
  CompoundCondition,
  DefaultVariants,
  KindRecipe,
  NativeStyle,
  RecipeComposition,
  RecipeFunction,
  SlotStyles,
  VariantOption,
  VariantSelection,
  VariantsOf,
} from "./types.js";
