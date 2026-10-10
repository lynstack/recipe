declare const level0: import("@lynstack/recipe").KindRecipe<{
    readonly size: "md" | "sm";
}, Readonly<Record<"root", string>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
}, never, string, readonly "root"[]>>;
declare const level1: import("@lynstack/recipe").KindRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
}, Readonly<Record<"icon" | "root", string>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
    readonly tone: {
        readonly danger: {
            readonly icon: "text-red-700";
        };
    };
}, never, string, readonly ("icon" | "root")[]>>;
declare const level2: import("@lynstack/recipe").KindRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, Readonly<Record<"label" | ("icon" | "root"), string>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
    readonly tone: {
        readonly danger: {
            readonly icon: "text-red-700";
        };
    };
    readonly weight: {
        readonly bold: {
            readonly label: "font-bold";
        };
    };
}, never, string, readonly ("label" | ("icon" | "root"))[]>>;
declare const level3: import("@lynstack/recipe").KindRecipe<{
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, Readonly<Record<"badge" | ("label" | ("icon" | "root")), string>>, import("@lynstack/recipe").RecipeComposition<{
    readonly shape: {
        readonly round: {
            readonly badge: "rounded-full";
        };
    };
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
    readonly tone: {
        readonly danger: {
            readonly icon: "text-red-700";
        };
    };
    readonly weight: {
        readonly bold: {
            readonly label: "font-bold";
        };
    };
}, never, string, readonly ("badge" | ("label" | ("icon" | "root")))[]>>;
declare const level4: import("@lynstack/recipe").KindRecipe<{
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, Readonly<Record<"hint" | ("badge" | ("label" | ("icon" | "root"))), string>>, import("@lynstack/recipe").RecipeComposition<{
    readonly muted: {
        readonly true: {
            readonly hint: "opacity-50";
        };
    };
    readonly shape: {
        readonly round: {
            readonly badge: "rounded-full";
        };
    };
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
    readonly tone: {
        readonly danger: {
            readonly icon: "text-red-700";
        };
    };
    readonly weight: {
        readonly bold: {
            readonly label: "font-bold";
        };
    };
}, never, string, readonly ("hint" | ("badge" | ("label" | ("icon" | "root"))))[]>>;
export { level0, level1, level2, level3, level4 };
