import type { ComposableKindSlotRecipe, ComposedVariants, NativeStyle, SlotStyleRecipeConfig, SlotStyleRecipeVariants, StyleRecipeConfig, StyleRecipeVariants, ThemedRecipe, VariantSelection } from "@lynstack/native-recipe";
import { createSlotStyleRecipe } from "@lynstack/native-recipe";
interface Palette {
    readonly colors: {
        readonly primary: string;
        readonly surface: string;
    };
    readonly radius: number;
}
declare const themed: import("@lynstack/native-recipe").ThemedRecipeCreators<Palette>;
/** Creates a themed recipe from any config, as a library's helper does. */
declare function defineThemed<const Variants extends StyleRecipeVariants, const DefaultedName extends keyof Variants = never>(config: (theme: Palette) => StyleRecipeConfig<Variants, NativeStyle, readonly [], DefaultedName>): ThemedRecipe<Palette, VariantSelection<Variants, DefaultedName>, NativeStyle>;
/** Creates a themed recipe, typed as the themed creator types it. */
declare function defineThemedAsCreated<const Variants extends StyleRecipeVariants, const DefaultedName extends keyof Variants = never>(config: (theme: Palette) => StyleRecipeConfig<Variants, never, readonly [], DefaultedName>): ReturnType<typeof themed.createStyleRecipe<Variants, never, readonly [], DefaultedName>>;
/** Creates a slot recipe that may compose others, as a library's helper does. */
declare function defineComposedSlots<const Slot extends string, const Variants extends SlotStyleRecipeVariants, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe<NativeStyle>[] = readonly []>(config: SlotStyleRecipeConfig<Slot, Variants, never, readonly [], DefaultedName, Composed>): ReturnType<typeof createSlotStyleRecipe<Slot, Variants, never, readonly [], DefaultedName, Composed>>;
export { defineComposedSlots, defineThemed, defineThemedAsCreated, themed };
export type { Palette };
