import type { ClassValue, ComposedSlot, SlotClassNames } from "@lynstack/class-recipe";
declare const button: ((props: {
    readonly className?: string | undefined;
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "danger" | "neutral";
}) => string) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly ("danger" | "neutral")[];
    };
    readonly defaultVariants: {
        readonly size: "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: "h-10";
            readonly sm: "h-8";
        };
        readonly tone: {
            readonly danger: "bg-red-600";
            readonly neutral: "bg-gray-100";
        };
    }, "size", string, undefined> | undefined;
};
declare const card: NoInfer<((props?: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
} | undefined) => Readonly<Record<"root" | "title", string>>) & {
    readonly variantKeys: readonly "raised"[];
    readonly variantOptions: {
        readonly raised: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly raised: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly raised: {
            readonly true: {
                readonly root: "shadow";
            };
        };
    }, never, string, readonly ("root" | "title")[]> | undefined;
}>;
declare const chip: ((props: {
    readonly className?: string | undefined;
    readonly tone: "danger";
}) => string) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly tone: {
            readonly danger: "bg-red-100";
        };
    }, never, string, undefined> | undefined;
};
/** Joins class values, as a helper of the user's that wraps cx does. */
declare function classes(...inputs: readonly ClassValue[]): string;
declare const dialogSlots: readonly ComposedSlot<readonly [typeof card], "footer">[];
/** The class names of a raised card. */
declare function raisedCard(): SlotClassNames<"root" | "title">;
declare const buttonClassName: string;
declare const chipClassName: string;
declare const stateClassName: string;
export { button, buttonClassName, card, chip, chipClassName, classes, dialogSlots, raisedCard, stateClassName, };
