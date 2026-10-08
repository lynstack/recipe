declare const level0: ((props: {
    readonly className?: string | undefined;
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "h-8";
        readonly sm: "h-6";
    }>;
}) => string) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "h-8";
            readonly sm: "h-6";
        }>[];
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
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "h-8";
        readonly sm: "h-6";
    }>;
    readonly tone: "danger";
}) => string) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "h-8";
            readonly sm: "h-6";
        }>[];
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
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "h-8";
        readonly sm: "h-6";
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => string) & {
    readonly variantKeys: readonly ("size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "h-8";
            readonly sm: "h-6";
        }>[];
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
    readonly shape?: import("@lynstack/class-recipe").VariantOption<{
        readonly round: "rounded-full";
        readonly square: "rounded-none";
    }> | undefined;
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "h-8";
        readonly sm: "h-6";
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => string) & {
    readonly variantKeys: readonly ("shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly shape: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly round: "rounded-full";
            readonly square: "rounded-none";
        }>[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "h-8";
            readonly sm: "h-6";
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly shape: import("@lynstack/class-recipe").VariantOption<{
            readonly round: "rounded-full";
            readonly square: "rounded-none";
        }>;
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
    readonly muted?: import("@lynstack/class-recipe").VariantOption<{
        readonly true: "opacity-50";
    }> | undefined;
    readonly shape?: import("@lynstack/class-recipe").VariantOption<{
        readonly round: "rounded-full";
        readonly square: "rounded-none";
    }> | undefined;
    readonly size: import("@lynstack/class-recipe").VariantOption<{
        readonly md: "h-8";
        readonly sm: "h-6";
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => string) & {
    readonly variantKeys: readonly ("muted" | "shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly shape: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly round: "rounded-full";
            readonly square: "rounded-none";
        }>[];
        readonly size: readonly import("@lynstack/class-recipe").VariantOption<{
            readonly md: "h-8";
            readonly sm: "h-6";
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
        readonly shape: import("@lynstack/class-recipe").VariantOption<{
            readonly round: "rounded-full";
            readonly square: "rounded-none";
        }>;
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
