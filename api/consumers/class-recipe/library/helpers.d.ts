import type { ComposableKindRecipe, ComposableKindSlotRecipe, ComposedVariants, Recipe, RecipeConfig, RecipeProps, RecipeVariants, SlotRecipe, SlotRecipeConfig, SlotRecipeProps, SlotRecipeVariants } from "@lynstack/class-recipe";
import { cva, sva } from "@lynstack/class-recipe";
/** Creates a recipe from any config. */
declare function define<const Variants extends RecipeVariants, const DefaultedName extends keyof Variants = never>(config: RecipeConfig<Variants, DefaultedName>): Recipe<RecipeProps<Variants, DefaultedName>>;
/** Creates a recipe that may compose others. */
declare function defineComposed<const Variants extends RecipeVariants, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe<string>[] = readonly []>(config: RecipeConfig<Variants, DefaultedName, Composed>): ReturnType<typeof cva<Variants, DefaultedName, Composed>>;
/** Creates a slot recipe from any config. */
declare function defineSlots<const Slot extends string, const Variants extends SlotRecipeVariants, const DefaultedName extends keyof Variants = never>(config: SlotRecipeConfig<Slot, Variants, DefaultedName>): SlotRecipe<Slot, SlotRecipeProps<Slot, Variants, DefaultedName>>;
/** Creates a slot recipe that may compose others. */
declare function defineComposedSlots<const Slot extends string, const Variants extends SlotRecipeVariants, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe<string>[] = readonly []>(config: SlotRecipeConfig<Slot, Variants, DefaultedName, Composed>): ReturnType<typeof sva<Slot, Variants, DefaultedName, Composed>>;
/** Adds a footer to any slot recipe. */
declare function withFooter<const Base extends ComposableKindSlotRecipe<string>>(base: Base): ReturnType<typeof sva<"footer", {
    readonly dense: {
        readonly true: {
            readonly footer: "pt-2";
        };
    };
}, never, readonly [Base]>>;
export { define, defineComposed, defineComposedSlots, defineSlots, withFooter };
