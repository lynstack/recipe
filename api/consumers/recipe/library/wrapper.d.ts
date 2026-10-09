import type { Composable, ComposableKindRecipe, ComposedVariants, CompoundCondition, DefaultVariants, InheritedDefaultedName, KindRecipe, KindVariants, RecipeComposition, RecipeFunction, VariantSelection } from "@lynstack/recipe";
import type { Style } from "./recipes.js";
interface StyleVariantsConfig<Variants extends KindVariants<Style>, DefaultedName extends keyof ComposedVariants<Composed, Variants>, Composed extends readonly ComposableKindRecipe<Style>[]> {
    readonly composes?: Composed;
    readonly base?: Style;
    readonly variants: Variants;
    readonly compoundVariants?: readonly {
        readonly variants: CompoundCondition<NoInfer<ComposedVariants<Composed, Variants>>>;
        readonly style: Style;
    }[];
    readonly defaultVariants?: DefaultVariants<ComposedVariants<Composed, Variants>, DefaultedName>;
}
type StyleVariants<Variants, DefaultedName extends keyof Variants> = RecipeFunction<VariantSelection<Variants, DefaultedName> & {
    readonly style?: Style;
}, Style> & Pick<KindRecipe<VariantSelection<Variants, DefaultedName>, Style>, "variantKeys" | "variantOptions" | "defaultVariants"> & Composable<RecipeComposition<Variants, DefaultedName, Style, undefined>>;
/**
 * Creates a recipe whose calls take a style that overrides theirs, as
 * the docs build it: a library's own creator, wrapping the engine's.
 */
declare function sv<const Variants extends KindVariants<Style>, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe<Style>[] = readonly []>(config: StyleVariantsConfig<Variants, DefaultedName, Composed>): StyleVariants<ComposedVariants<Composed, Variants>, DefaultedName | InheritedDefaultedName<Composed, Variants>>;
declare const surface: StyleVariants<{
    readonly tone: {
        readonly muted: {
            readonly opacity: 0.6;
        };
    };
}, never>;
declare const panel: StyleVariants<{
    readonly tone: {
        readonly loud: {
            readonly fontWeight: 700;
        };
        readonly muted: {
            readonly opacity: 0.6;
        };
    };
}, "tone">;
export { panel, surface, sv };
