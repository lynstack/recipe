import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
declare const button: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly disabled: {
        readonly true: "opacity-50";
    };
    readonly size: {
        readonly lg: "h-12";
        readonly md: "h-10";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    };
}, "size", string, undefined>>;
type ButtonVariants = VariantsOf<typeof button>;
type ButtonProps = PropsOf<typeof button>;
declare const card: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"root" | "title", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root" | "title"> | undefined;
    readonly size: "md";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "p-4";
            readonly title: "text-base";
        };
    };
}, never, string, readonly ("root" | "title")[]>>>;
declare const pill: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly tone: {
        readonly danger: "bg-red-100";
        readonly neutral: "bg-gray-100";
    };
}, never, string, undefined>>;
declare const field: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"input" | "label", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"input" | "label"> | undefined;
    readonly invalid?: "false" | "true" | boolean | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly invalid: {
        readonly true: {
            readonly input: "border-red-600";
        };
    };
}, never, string, readonly ("input" | "label")[]>>>;
declare const merged: import("@lynstack/class-recipe").Recipes;
declare const iconButton: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly shape: "round";
    readonly size?: "lg" | "md" | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly disabled: {
        readonly true: "opacity-50";
    };
    readonly shape: {
        readonly round: "aspect-square";
    };
    readonly size: {
        readonly lg: "h-12";
        readonly md: "h-10";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    };
}, "size", string, undefined>>;
declare const select: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"trigger" | ("input" | "label"), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"trigger" | ("input" | "label")> | undefined;
    readonly invalid?: "false" | "true" | boolean | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly invalid: {
        readonly true: {
            readonly input: "border-red-600";
        } | {
            readonly label: "text-red-700";
        };
    };
}, never, string, readonly ("trigger" | ("input" | "label"))[]>>>;
declare const badge: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
}>;
declare const badgeClassName: string;
declare const compactButton: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "xs" | undefined;
    readonly tone: "danger" | "neutral";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly disabled: {
        readonly true: "opacity-50";
    };
    readonly size: {
        readonly lg: "h-12";
        readonly md: "h-10";
        readonly xs: "h-6";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    };
}, "size", string, undefined>>;
declare const compactButtonClassName: string;
declare const alert: import("@lynstack/class-recipe").SlotRecipe<"root" | "title", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root" | "title"> | undefined;
    readonly tone: "danger";
}>;
declare const alertClassNames: Readonly<Record<"root" | "title", string>>;
declare const toggle: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"icon" | "root", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"icon" | "root"> | undefined;
    readonly pressed?: "false" | "true" | boolean | undefined;
    readonly size?: "md" | "sm" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly pressed: {
        readonly true: {
            readonly icon: "opacity-100";
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
}, "size", string, readonly ("icon" | "root")[]>>>;
declare const toggleClassNames: Readonly<Record<"icon" | "root", string>>;
declare const toggleRoot: string;
declare const iconClassName: string;
declare const selectClassNames: Readonly<Record<"input" | "label" | "trigger", string>>;
declare const className: string;
declare const buttonKeys: readonly ("disabled" | "size" | "tone")[];
declare const cardKeys: readonly "size"[];
declare const buttonOptions: {
    readonly size: readonly ("lg" | "md")[];
};
declare const buttonDefaults: {
    readonly disabled: "false" | "true";
};
declare const cardOptions: {
    readonly size: readonly "md"[];
};
declare const buttonProps: ButtonProps;
declare const cardProps: PropsOf<typeof card>;
declare const panel: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"footer" | ("root" | "title"), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"footer" | ("root" | "title")> | undefined;
    readonly size: "md" | "sm";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "p-4";
            readonly title: "text-base";
        };
        readonly sm: {
            readonly footer: "gap-2";
        };
    };
}, never, string, readonly ("footer" | ("root" | "title"))[]>>>;
declare const panelClassNames: Readonly<Record<"root" | "title" | "footer", string>>;
declare const footedCard: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"footer" | ("root" | "title"), {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"footer" | ("root" | "title")> | undefined;
    readonly dense?: "false" | "true" | boolean | undefined;
    readonly size: "md";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly dense: {
        readonly true: {
            readonly footer: "pt-2";
        };
    };
    readonly size: {
        readonly md: {
            readonly root: "p-4";
            readonly title: "text-base";
        };
    };
}, never, string, readonly ("footer" | ("root" | "title"))[]>>>;
declare const footedCardClasses: Readonly<Record<"root" | "title" | "footer", string>>;
export { alert, alertClassNames, badge, badgeClassName, button, buttonDefaults, buttonKeys, buttonOptions, buttonProps, card, cardKeys, cardOptions, cardProps, className, compactButton, compactButtonClassName, field, footedCard, footedCardClasses, iconButton, iconClassName, merged, panel, panelClassNames, pill, select, selectClassNames, toggle, toggleClassNames, toggleRoot, };
export type { ButtonProps, ButtonVariants };
