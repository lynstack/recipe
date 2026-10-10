declare const box: import("@lynstack/native-recipe").StyleRecipe<{
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "muted";
}, {
    readonly height?: 32 | 40 | undefined;
    readonly opacity?: 0.6 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly height: 40;
        };
        readonly sm: {
            readonly height: 32;
        };
    };
    readonly tone: {
        readonly muted: {
            readonly opacity: 0.6;
        };
    };
}, "size", import("@lynstack/native-recipe").NativeStyle, undefined>>;
declare const card: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly raised?: "false" | "true" | boolean | undefined;
}, {
    readonly root: {
        readonly elevation?: 2 | undefined;
    };
    readonly title: {};
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    };
}, never, import("@lynstack/native-recipe").NativeStyle, readonly ("root" | "title")[]>>;
/** Configs whose styles are arrays of styles, which the types reject. */
declare function createArrayStyleRecipes(): void;
/** Calls and configs that the types reject, one of each mistake. */
declare function misuses(): void;
export { box, card, createArrayStyleRecipes, misuses };
