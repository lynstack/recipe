import type { ComposableKindRecipe, ComposableKindSlotRecipe, ComposedVariants, NativeStyle, SlotStyleCompoundVariant, SlotStyleRecipeConfig, SlotStyleRecipeVariants, SlotStyles, StyleCompoundVariant, StyleRecipeConfig, StyleRecipeVariants } from "@lynstack/native-recipe";
import { createSlotStyleRecipe, createStyleRecipe } from "@lynstack/native-recipe";
/** Creates a recipe from any config. */
declare function define<const Variants extends StyleRecipeVariants, const Base extends NativeStyle = never, const Compounds extends readonly StyleCompoundVariant<NoInfer<Variants>>[] = readonly [], const DefaultedName extends keyof Variants = never>(config: StyleRecipeConfig<Variants, Base, Compounds, DefaultedName>): ReturnType<typeof createStyleRecipe<Variants, Base, Compounds, DefaultedName>>;
/** Creates a recipe that may compose others. */
declare function defineComposed<const Variants extends StyleRecipeVariants, const Base extends NativeStyle = never, const Compounds extends readonly StyleCompoundVariant<NoInfer<ComposedVariants<Composed, Variants>>>[] = readonly [], const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe<NativeStyle>[] = readonly []>(config: StyleRecipeConfig<Variants, Base, Compounds, DefaultedName, Composed>): ReturnType<typeof createStyleRecipe<Variants, Base, Compounds, DefaultedName, Composed>>;
/** Creates a slot recipe from any config. */
declare function defineSlots<const Slot extends string, const Variants extends SlotStyleRecipeVariants, const Base extends SlotStyles<string> = never, const Compounds extends readonly SlotStyleCompoundVariant<NoInfer<Variants>>[] = readonly [], const DefaultedName extends keyof Variants = never>(config: SlotStyleRecipeConfig<Slot, Variants, Base, Compounds, DefaultedName>): ReturnType<typeof createSlotStyleRecipe<Slot, Variants, Base, Compounds, DefaultedName>>;
/** Adds a footer to any slot recipe. */
declare function withFooter<const Base extends ComposableKindSlotRecipe<NativeStyle>>(base: Base): ReturnType<typeof createSlotStyleRecipe<"footer", {
    readonly dense: {
        readonly true: {
            readonly footer: {
                readonly borderStyle: "dashed";
            };
        };
    };
}, {
    readonly footer: {
        readonly borderStyle: "solid";
    };
}, readonly [], never, readonly [Base]>>;
export { define, defineComposed, defineSlots, withFooter };
