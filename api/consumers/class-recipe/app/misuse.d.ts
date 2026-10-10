declare const button: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "danger";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: "h-10";
        readonly sm: "h-8";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
    };
}, "size", string, undefined>>;
declare const card: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"root" | "title", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: "shadow";
        };
    };
}, never, string, readonly ("root" | "title")[]>>>;
/** Calls and configs that the types reject, one of each mistake. */
declare function misuses(): void;
export { button, card, misuses };
