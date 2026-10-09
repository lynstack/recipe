declare const level0: ((props: {
    readonly className?: string | undefined;
    readonly size: "md" | "sm";
}) => string) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: "h-8";
            readonly sm: "h-6";
        };
    }, never, string, undefined> | undefined;
};
declare const level1: ((props: {
    readonly className?: string | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
}) => string) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: "h-8";
            readonly sm: "h-6";
        };
        readonly tone: {
            readonly danger: "text-red-700";
        };
    }, never, string, undefined> | undefined;
};
declare const level2: ((props: {
    readonly className?: string | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}) => string) & {
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
            readonly md: "h-8";
            readonly sm: "h-6";
        };
        readonly tone: {
            readonly danger: "text-red-700";
        };
        readonly weight: {
            readonly bold: "font-bold";
        };
    }, never, string, undefined> | undefined;
};
declare const level3: ((props: {
    readonly className?: string | undefined;
    readonly shape?: "round" | "square" | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}) => string) & {
    readonly variantKeys: readonly ("shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly shape: readonly ("round" | "square")[];
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly shape: "round" | "square";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly shape: {
            readonly round: "rounded-full";
            readonly square: "rounded-none";
        };
        readonly size: {
            readonly md: "h-8";
            readonly sm: "h-6";
        };
        readonly tone: {
            readonly danger: "text-red-700";
        };
        readonly weight: {
            readonly bold: "font-bold";
        };
    }, "shape", string, undefined> | undefined;
};
declare const level4: ((props: {
    readonly className?: string | undefined;
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape?: "round" | "square" | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}) => string) & {
    readonly variantKeys: readonly ("muted" | "shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly shape: readonly ("round" | "square")[];
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
        readonly shape: "round" | "square";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly muted: {
            readonly true: "opacity-50";
        };
        readonly shape: {
            readonly round: "rounded-full";
            readonly square: "rounded-none";
        };
        readonly size: {
            readonly md: "h-8";
            readonly sm: "h-6";
        };
        readonly tone: {
            readonly danger: "text-red-700";
        };
        readonly weight: {
            readonly bold: "font-bold";
        };
    }, "shape", string, undefined> | undefined;
};
export { level0, level1, level2, level3, level4 };
