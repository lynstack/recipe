import type { ComposableKindRecipe, ComposedVariants, KindRecipeConfig, KindVariants } from "@lynstack/recipe";
import type { Style } from "./recipes.js";
/** Creates a recipe from its variants. */
declare function defineVariants<const Variants extends KindVariants<Style>>(variants: Variants): import("@lynstack/recipe").KindRecipe<import("@lynstack/recipe").KindSelection<Variants, never>, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<Variants, never, Readonly<Record<string, string | number>>, undefined>>;
/** Creates a recipe from any config. */
declare function defineRecipe<const Variants extends KindVariants<Style>, const DefaultedName extends keyof Variants = never>(config: KindRecipeConfig<Style, Variants, DefaultedName>): import("@lynstack/recipe").KindRecipe<import("@lynstack/recipe").KindSelection<Variants, DefaultedName>, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<Variants, DefaultedName, Readonly<Record<string, string | number>>, undefined>>;
/** Creates a recipe from any config, which may compose others. */
declare function defineComposedRecipe<const Variants extends KindVariants<Style>, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe<Style>[] = readonly []>(config: KindRecipeConfig<Style, Variants, DefaultedName, Composed>): import("@lynstack/recipe").KindRecipe<import("@lynstack/recipe").KindSelection<ComposedVariants<Composed, Variants>, DefaultedName | Extract<(Composed[number] extends infer T ? T extends Composed[number] ? T extends {
    readonly "~composition"?: infer Composition;
} ? Exclude<Composition, undefined> : never : never : never) extends infer T_1 ? T_1 extends (Composed[number] extends infer T ? T extends Composed[number] ? T extends {
    readonly "~composition"?: infer Composition;
} ? Exclude<Composition, undefined> : never : never : never) ? T_1 extends unknown ? "defaultedName" extends infer T_2 ? T_2 extends "defaultedName" ? T_2 extends keyof T_1 ? T_1[T_2] : never : never : never : never : never : never, keyof ComposedVariants<Composed, Variants>>>, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<ComposedVariants<Composed, Variants>, DefaultedName | Extract<(Composed[number] extends infer T ? T extends Composed[number] ? T extends {
    readonly "~composition"?: infer Composition;
} ? Exclude<Composition, undefined> : never : never : never) extends infer T_1 ? T_1 extends (Composed[number] extends infer T ? T extends Composed[number] ? T extends {
    readonly "~composition"?: infer Composition;
} ? Exclude<Composition, undefined> : never : never : never) ? T_1 extends unknown ? "defaultedName" extends infer T_2 ? T_2 extends "defaultedName" ? T_2 extends keyof T_1 ? T_1[T_2] : never : never : never : never : never : never, keyof ComposedVariants<Composed, Variants>>, Readonly<Record<string, string | number>>, undefined>>;
export { defineComposedRecipe, defineRecipe, defineVariants };
