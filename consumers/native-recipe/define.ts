import type {
  ComposableKindRecipe,
  ComposedVariants,
  NativeStyle,
  SlotStyleRecipe,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
  SlotStyles,
  StyleRecipe,
  StyleRecipeConfig,
  StyleRecipeVariants,
  VariantSelection,
} from "@lynstack/native-recipe";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";

/** Creates a recipe from any config, as a library's own helper does. */
function define<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: StyleRecipeConfig<Variants, NativeStyle, readonly [], DefaultedName>,
): StyleRecipe<VariantSelection<Variants, DefaultedName>, NativeStyle> {
  return createStyleRecipe(config);
}

/** Creates a recipe that may compose others, as a library's own helper does. */
function defineComposed<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<NativeStyle>[] =
    readonly [],
>(
  config: StyleRecipeConfig<
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >,
): ReturnType<
  typeof createStyleRecipe<
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >
> {
  return createStyleRecipe(config);
}

/** Creates a slot recipe from any config, as a library's own helper does. */
function defineSlots<
  const Slot extends string,
  const Variants extends SlotStyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotStyleRecipeConfig<
    Slot,
    Variants,
    SlotStyles<Slot>,
    readonly [],
    DefaultedName
  >,
): SlotStyleRecipe<
  VariantSelection<Variants, DefaultedName>,
  SlotStyles<Slot>
> {
  return createSlotStyleRecipe(config);
}

export { define, defineComposed, defineSlots };
