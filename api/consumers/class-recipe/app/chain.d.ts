declare const level0: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"root", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root"> | undefined;
    readonly size: "md" | "sm";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
}, never, string, readonly "root"[]>>>;
declare const level1: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"icon" | "root", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"icon" | "root"> | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
}, import("@lynstack/class-recipe").RecipeComposition<{
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
}, never, string, readonly ("icon" | "root")[]>>>;
declare const level2: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"label" | ("icon" | "root"), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"label" | ("icon" | "root")> | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, import("@lynstack/class-recipe").RecipeComposition<{
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
}, never, string, readonly ("label" | ("icon" | "root"))[]>>>;
declare const level3: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"badge" | ("label" | ("icon" | "root")), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"badge" | ("label" | ("icon" | "root"))> | undefined;
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, import("@lynstack/class-recipe").RecipeComposition<{
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
}, never, string, readonly ("badge" | ("label" | ("icon" | "root")))[]>>>;
declare const level4: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"hint" | ("badge" | ("label" | ("icon" | "root"))), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"hint" | ("badge" | ("label" | ("icon" | "root")))> | undefined;
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, import("@lynstack/class-recipe").RecipeComposition<{
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
}, never, string, readonly ("hint" | ("badge" | ("label" | ("icon" | "root"))))[]>>>;
export { level0, level1, level2, level3, level4 };
