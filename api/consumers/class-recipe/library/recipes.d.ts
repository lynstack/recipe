declare const ds: import("@lynstack/class-recipe").Recipes;
declare const button: ((props?: {
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
} | undefined) => string) & {
    readonly variantKeys: readonly ("disabled" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly size: readonly ("lg" | "md" | "sm")[];
        readonly tone: readonly ("danger" | "neutral")[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: "lg" | "md" | "sm";
        readonly tone: "danger" | "neutral";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, "size" | "tone", string, undefined> | undefined;
};
declare const card: NoInfer<((props?: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"body" | "root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | undefined;
} | undefined) => Readonly<Record<"body" | "root" | "title", string>>) & {
    readonly variantKeys: readonly ("raised" | "size")[];
    readonly variantOptions: {
        readonly raised: readonly ("false" | "true")[];
        readonly size: readonly ("lg" | "md")[];
    };
    readonly defaultVariants: {
        readonly raised: "false" | "true";
        readonly size: "lg" | "md";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, "size", string, readonly ("body" | "root" | "title")[]> | undefined;
}>;
declare const iconButton: ((props: {
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly shape: "round" | "square";
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
}) => string) & {
    readonly variantKeys: readonly ("disabled" | "shape" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly shape: readonly ("round" | "square")[];
        readonly size: readonly ("lg" | "md" | "sm")[];
        readonly tone: readonly ("danger" | "neutral")[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: "lg" | "md" | "sm";
        readonly tone: "danger" | "neutral";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, "size" | "tone", string, undefined> | undefined;
};
declare const dialog: NoInfer<((props?: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"body" | "footer" | "root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "sm" | undefined;
} | undefined) => Readonly<Record<"body" | "footer" | "root" | "title", string>>) & {
    readonly variantKeys: readonly ("raised" | "size")[];
    readonly variantOptions: {
        readonly raised: readonly ("false" | "true")[];
        readonly size: readonly ("lg" | "md" | "sm")[];
    };
    readonly defaultVariants: {
        readonly raised: "false" | "true";
        readonly size: "lg" | "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, "size", string, readonly ("body" | "footer" | "root" | "title")[]> | undefined;
}>;
declare const badge: ((props: {
    readonly className?: string | undefined;
    readonly tone: "danger" | "neutral";
}) => string) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly ("danger" | "neutral")[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly tone: {
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        };
    }, never, string, undefined> | undefined;
};
export { badge, button, card, dialog, ds, iconButton };
