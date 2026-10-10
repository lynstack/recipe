import type {
  ComposableKindRecipe,
  ComposedVariants,
  KindRecipeConfig,
  KindVariants,
} from "@lynstack/recipe";

import type { Style } from "./recipes.js";
import { styleRecipe } from "./recipes.js";

// Helpers whose return types tsc infers, as most libraries write them.

/** Creates a recipe from its variants. */
function defineVariants<const Variants extends KindVariants<Style>>(
  variants: Variants,
) {
  return styleRecipe({ variants });
}

/** Creates a recipe from any config. */
function defineRecipe<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(config: KindRecipeConfig<Style, Variants, DefaultedName>) {
  return styleRecipe(config);
}

/** Creates a recipe from any config, which may compose others. */
function defineComposedRecipe<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<Style>[] = readonly [],
>(config: KindRecipeConfig<Style, Variants, DefaultedName, Composed>) {
  return styleRecipe(config);
}

export { defineComposedRecipe, defineRecipe, defineVariants };
