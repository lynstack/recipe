declare const level0: import("@lynstack/recipe").KindRecipe<{
    readonly size: "md" | "sm";
}, string, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: "h-8";
        readonly sm: "h-6";
    };
}, never, string, undefined>>;
declare const level1: import("@lynstack/recipe").KindRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
}, string, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: "h-8";
        readonly sm: "h-6";
    };
    readonly tone: {
        readonly danger: "text-red-700";
    };
}, never, string, undefined>>;
declare const level2: import("@lynstack/recipe").KindRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, string, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: "h-8";
        readonly sm: "h-6";
    };
    readonly tone: {
        readonly danger: "text-red-700";
    };
    readonly weight: {
        readonly bold: "font-bold";
    };
}, never, string, undefined>>;
declare const level3: import("@lynstack/recipe").KindRecipe<{
    readonly shape?: "round" | "square" | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, string, import("@lynstack/recipe").RecipeComposition<{
    readonly shape: {
        readonly round: "rounded-full";
        readonly square: "rounded-none";
    };
    readonly size: {
        readonly md: "h-8";
        readonly sm: "h-6";
    };
    readonly tone: {
        readonly danger: "text-red-700";
    };
    readonly weight: {
        readonly bold: "font-bold";
    };
}, "shape", string, undefined>>;
declare const level4: import("@lynstack/recipe").KindRecipe<{
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape?: "round" | "square" | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, string, import("@lynstack/recipe").RecipeComposition<{
    readonly muted: {
        readonly true: "opacity-50";
    };
    readonly shape: {
        readonly round: "rounded-full";
        readonly square: "rounded-none";
    };
    readonly size: {
        readonly md: "h-8";
        readonly sm: "h-6";
    };
    readonly tone: {
        readonly danger: "text-red-700";
    };
    readonly weight: {
        readonly bold: "font-bold";
    };
}, "shape", string, undefined>>;
export { level0, level1, level2, level3, level4 };
