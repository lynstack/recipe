import type { ComposableKindRecipe, ComposableKindSlotRecipe, ComposedVariants, CreateKindRecipe, CreateKindSlotRecipe, KindRecipe, KindRecipeConfig, KindSelection, KindSlotRecipeConfig, KindSlotVariants, KindVariants } from "@lynstack/recipe";
type Style = Readonly<Record<string, string | number>>;
declare const styleRecipe: CreateKindRecipe<Style, Style>;
declare const slotStyleRecipe: CreateKindSlotRecipe<Style, Style>;
/** Creates a recipe from any config. */
declare function define<const Variants extends KindVariants<Style>, const DefaultedName extends keyof Variants = never>(config: KindRecipeConfig<Style, Variants, DefaultedName>): KindRecipe<KindSelection<Variants, DefaultedName>, Style>;
/** Creates a slot recipe from any config. */
declare function defineSlots<const Slot extends string, const Variants extends KindSlotVariants<Style>, const DefaultedName extends keyof Variants = never>(config: KindSlotRecipeConfig<Slot, Style, Variants, DefaultedName>): KindRecipe<KindSelection<Variants, DefaultedName>, Readonly<Record<Slot, Style>>>;
/** Creates a recipe that may compose others. */
declare function defineComposed<const Variants extends KindVariants<Style>, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe<Style>[] = readonly []>(config: KindRecipeConfig<Style, Variants, DefaultedName, Composed>): ReturnType<typeof styleRecipe<Variants, DefaultedName, Composed>>;
/** Creates a slot recipe that may compose others. */
declare function defineComposedSlots<const Slot extends string, const Variants extends KindSlotVariants<Style>, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe<Style>[] = readonly []>(config: KindSlotRecipeConfig<Slot, Style, Variants, DefaultedName, Composed>): ReturnType<typeof slotStyleRecipe<Slot, Variants, DefaultedName, Composed>>;
/** Adds a footer to any slot recipe. */
declare function withFooter<const Base extends ComposableKindSlotRecipe<Style>>(base: Base): ReturnType<typeof slotStyleRecipe<"footer", {
    readonly dense: {
        readonly true: {
            readonly footer: {
                readonly borderStyle: "dashed";
            };
        };
    };
}, never, readonly [Base]>>;
export { define, defineComposed, defineComposedSlots, defineSlots, withFooter };
