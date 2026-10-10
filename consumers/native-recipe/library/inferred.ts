import type {
  NativeStyle,
  SlotStyleCompoundVariant,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
  SlotStyles,
  StyleCompoundVariant,
  StyleRecipeConfig,
  StyleRecipeVariants,
} from "@lynstack/native-recipe";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";

import type { Theme } from "./recipes";
import { themed } from "./recipes";

// Helpers whose return types tsc infers, as most libraries write them.

/** Creates a recipe from any config. */
function defineRecipe<
  const Variants extends StyleRecipeVariants,
  const Base extends NativeStyle = never,
  const Compounds extends readonly StyleCompoundVariant<NoInfer<Variants>>[] =
    readonly [],
  const DefaultedName extends keyof Variants = never,
>(config: StyleRecipeConfig<Variants, Base, Compounds, DefaultedName>) {
  return createStyleRecipe(config);
}

/** Creates a slot recipe from any config. */
function defineSlotRecipe<
  const Slot extends string,
  const Variants extends SlotStyleRecipeVariants,
  const Base extends SlotStyles<string> = never,
  const Compounds extends readonly SlotStyleCompoundVariant<
    NoInfer<Variants>
  >[] = readonly [],
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotStyleRecipeConfig<Slot, Variants, Base, Compounds, DefaultedName>,
) {
  return createSlotStyleRecipe(config);
}

/** Creates a themed recipe from any config of a theme. */
function defineThemedRecipe<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: (
    theme: Theme,
  ) => StyleRecipeConfig<Variants, never, readonly [], DefaultedName>,
) {
  return themed.createStyleRecipe(config);
}

export { defineRecipe, defineSlotRecipe, defineThemedRecipe };
