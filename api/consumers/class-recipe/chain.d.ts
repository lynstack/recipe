declare const level0: NoInfer<((props: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root"> | undefined;
    readonly size: "md" | "sm";
}) => Readonly<Record<"root", string>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        };
    }, never, string, readonly "root"[]> | undefined;
}>;
declare const level1: NoInfer<((props: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"icon" | "root"> | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
}) => Readonly<Record<"icon" | "root", string>>) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, never, string, readonly ("icon" | "root")[]> | undefined;
}>;
declare const level2: NoInfer<((props: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"icon" | "label" | "root"> | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}) => Readonly<Record<"icon" | "label" | "root", string>>) & {
    readonly variantKeys: readonly ("size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, never, string, readonly ("icon" | "label" | "root")[]> | undefined;
}>;
declare const level3: NoInfer<((props: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"badge" | "icon" | "label" | "root"> | undefined;
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}) => Readonly<Record<"badge" | "icon" | "label" | "root", string>>) & {
    readonly variantKeys: readonly ("shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly shape: readonly "round"[];
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, never, string, readonly ("badge" | "icon" | "label" | "root")[]> | undefined;
}>;
declare const level4: NoInfer<((props: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"badge" | "hint" | "icon" | "label" | "root"> | undefined;
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}) => Readonly<Record<"badge" | "hint" | "icon" | "label" | "root", string>>) & {
    readonly variantKeys: readonly ("muted" | "shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly shape: readonly "round"[];
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
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
    }, never, string, readonly ("badge" | "hint" | "icon" | "label" | "root")[]> | undefined;
}>;
export { level0, level1, level2, level3, level4 };
