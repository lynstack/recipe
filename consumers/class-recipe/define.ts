import type {
  Recipe,
  RecipeConfig,
  RecipeProps,
  RecipeVariants,
  SlotRecipe,
  SlotRecipeConfig,
  SlotRecipeProps,
  SlotRecipeVariants,
} from "@lynstack/class-recipe";
import { cva, sva } from "@lynstack/class-recipe";

/** Creates a recipe from any config, as a library's own helper does. */
function define<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: RecipeConfig<Variants, DefaultedName>,
): Recipe<RecipeProps<Variants, DefaultedName>> {
  return cva(config);
}

/** Creates a slot recipe from any config, as a library's own helper does. */
function defineSlots<
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotRecipeConfig<Slot, Variants, DefaultedName>,
): SlotRecipe<Slot, SlotRecipeProps<Slot, Variants, DefaultedName>> {
  return sva(config);
}

export { define, defineSlots };
