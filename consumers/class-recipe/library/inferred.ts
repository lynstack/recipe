import type {
  RecipeConfig,
  RecipeVariants,
  SlotRecipeConfig,
  SlotRecipeVariants,
} from "@lynstack/class-recipe";
import { cva, sva } from "@lynstack/class-recipe";

// Helpers whose return types tsc infers, as most libraries write them.

/** Creates a recipe from its variants. */
function defineVariants<const Variants extends RecipeVariants>(
  variants: Variants,
) {
  return cva({ variants });
}

/** Creates a recipe from any config. */
function defineRecipe<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(config: RecipeConfig<Variants, DefaultedName>) {
  return cva(config);
}

/** Creates a slot recipe from any config. */
function defineSlotRecipe<
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(config: SlotRecipeConfig<Slot, Variants, DefaultedName>) {
  return sva(config);
}

export { defineRecipe, defineSlotRecipe, defineVariants };
