declare const ds: import("@lynstack/class-recipe").Recipes;
declare const button: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly disabled: {
        readonly true: "opacity-50";
    };
    readonly size: {
        readonly lg: "h-12";
        readonly md: "h-10";
        readonly sm: "h-8";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    };
}, "size" | "tone", string, undefined>>;
declare const card: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"body" | "root" | "title", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"body" | "root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: "shadow";
        };
    };
    readonly size: {
        readonly lg: {
            readonly root: "p-6";
        };
        readonly md: {
            readonly root: "p-4";
        };
    };
}, "size", string, readonly ("body" | "root" | "title")[]>>>;
declare const iconButton: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly shape: "round" | "square";
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly disabled: {
        readonly true: "opacity-50";
    };
    readonly shape: {
        readonly round: "rounded-full";
        readonly square: "rounded";
    };
    readonly size: {
        readonly lg: "h-12";
        readonly md: "h-10";
        readonly sm: "h-8";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    };
}, "size" | "tone", string, undefined>>;
declare const dialog: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"footer" | ("body" | "root" | "title"), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"footer" | ("body" | "root" | "title")> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "sm" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: "shadow";
        };
    };
    readonly size: {
        readonly lg: {
            readonly root: "p-6";
        };
        readonly md: {
            readonly root: "p-4";
        };
        readonly sm: {
            readonly footer: "gap-1";
            readonly root: "p-2";
        };
    };
}, "size", string, readonly ("footer" | ("body" | "root" | "title"))[]>>>;
declare const badge: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly tone: {
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    };
}, never, string, undefined>>;
export { badge, button, card, dialog, ds, iconButton };
