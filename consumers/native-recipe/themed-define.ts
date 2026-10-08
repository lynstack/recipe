import type {
  ComposableKindSlotRecipe,
  ComposedVariants,
  NativeStyle,
  SlotStyleRecipeConfig,
  SlotStyleRecipeVariants,
  StyleRecipeConfig,
  StyleRecipeVariants,
  ThemedRecipe,
  VariantSelection,
} from "@lynstack/native-recipe";
import {
  createSlotStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";

interface Palette {
  readonly colors: { readonly primary: string; readonly surface: string };
  readonly radius: number;
}

const themed = createThemedRecipes<Palette>();

/** Creates a themed recipe from any config, as a library's helper does. */
function defineThemed<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: (
    theme: Palette,
  ) => StyleRecipeConfig<Variants, NativeStyle, readonly [], DefaultedName>,
): ThemedRecipe<
  Palette,
  VariantSelection<Variants, DefaultedName>,
  NativeStyle
> {
  return themed.createStyleRecipe(config);
}

/** Creates a themed recipe, typed as the themed creator types it. */
function defineThemedAsCreated<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: (
    theme: Palette,
  ) => StyleRecipeConfig<Variants, never, readonly [], DefaultedName>,
): ReturnType<
  typeof themed.createStyleRecipe<Variants, never, readonly [], DefaultedName>
> {
  return themed.createStyleRecipe(config);
}

/** Creates a slot recipe that may compose others, as a library's helper does. */
function defineComposedSlots<
  const Slot extends string,
  const Variants extends SlotStyleRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<NativeStyle>[] =
    readonly [],
>(
  config: SlotStyleRecipeConfig<
    Slot,
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >,
): ReturnType<
  typeof createSlotStyleRecipe<
    Slot,
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >
> {
  return createSlotStyleRecipe(config);
}

export { defineComposedSlots, defineThemed, defineThemedAsCreated, themed };
export type { Palette };
