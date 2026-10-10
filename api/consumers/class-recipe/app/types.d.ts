import type { ClassValue, ComposedSlot, SlotClassNames } from "@lynstack/class-recipe";
declare const button: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: "h-10";
        readonly sm: "h-8";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
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
declare const chip: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly tone: "danger";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly tone: {
        readonly danger: "bg-red-100";
    };
}, never, string, undefined>>;
/** Joins class values, as a helper of the user's that wraps cx does. */
declare function classes(...inputs: readonly ClassValue[]): string;
declare const dialogSlots: readonly ComposedSlot<readonly [typeof card], "footer">[];
/** The class names of a raised card. */
declare function raisedCard(): SlotClassNames<"root" | "title">;
declare const buttonClassName: string;
declare const chipClassName: string;
declare const stateClassName: string;
export { button, buttonClassName, card, chip, chipClassName, classes, dialogSlots, raisedCard, stateClassName, };
