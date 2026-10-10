import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
declare const pill: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly size?: "md" | "sm" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: "px-3";
        readonly sm: "px-2";
    };
}, "size", string, undefined>>;
declare const chip: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: "px-3";
        readonly sm: "px-2";
    };
    readonly tone: {
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    };
}, "size", string, undefined>>;
declare const tag: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly size?: "md" | "sm" | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly muted: {
        readonly true: "opacity-50";
    };
    readonly size: {
        readonly md: "px-3";
        readonly sm: "px-2";
    };
    readonly tone: {
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    };
}, "size" | "tone", string, undefined>>;
declare const look: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"root", {
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
declare const field: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"label" | "root", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"label" | "root"> | undefined;
    readonly invalid?: "false" | "true" | boolean | undefined;
    readonly size: "md" | "sm";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly invalid: {
        readonly true: {
            readonly label: "text-red-700";
            readonly root: "border-2";
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
}, never, string, readonly ("label" | "root")[]>>>;
declare const select: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"trigger" | ("label" | "root"), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"trigger" | ("label" | "root")> | undefined;
    readonly invalid?: "false" | "true" | boolean | undefined;
    readonly open?: "false" | "true" | boolean | undefined;
    readonly size?: "md" | "sm" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly invalid: {
        readonly true: {
            readonly label: "text-red-700";
            readonly root: "border-2";
        };
    };
    readonly open: {
        readonly true: {
            readonly trigger: "ring";
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
}, "size", string, readonly ("trigger" | ("label" | "root"))[]>>>;
type ChipProps = PropsOf<typeof chip>;
type TagVariants = VariantsOf<typeof tag>;
declare const chipClassName: string;
declare const tagClassName: string;
declare const fieldClassNames: Readonly<Record<"label" | "root", string>>;
declare const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>>;
declare const joined: string;
export { chip, chipClassName, field, fieldClassNames, joined, pill, look, select, selectClassNames, tag, tagClassName, };
export type { ChipProps, TagVariants };
