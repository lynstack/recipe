declare const text: import("@lynstack/recipe").KindRecipe<{
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "muted";
}, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly fontSize: 16;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
    };
    readonly tone: {
        readonly muted: {
            readonly opacity: 0.6;
        };
    };
}, "size", Readonly<Record<string, string | number>>, undefined>>;
declare const card: import("@lynstack/recipe").KindRecipe<{
    readonly raised?: "false" | "true" | boolean | undefined;
}, Readonly<Record<"root" | "title", Readonly<Record<string, string | number>>>>, import("@lynstack/recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    };
}, never, Readonly<Record<string, string | number>>, readonly ("root" | "title")[]>>;
/** Calls and configs that the types reject, one of each mistake. */
declare function misuses(): void;
export { card, misuses, text };
