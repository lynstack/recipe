declare const level0: ((props: {
    readonly size: import("@lynstack/recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
}) => Readonly<Record<"root", string>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        };
    }, never, string, readonly "root"[]> | undefined;
};
declare const level1: ((props: {
    readonly size: import("@lynstack/recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
    readonly tone: "danger";
}) => Readonly<Record<"icon" | "root", string>>) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
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
};
declare const level2: ((props: {
    readonly size: import("@lynstack/recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => Readonly<Record<"icon" | "label" | "root", string>>) & {
    readonly variantKeys: readonly ("size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
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
};
declare const level3: ((props: {
    readonly shape: "round";
    readonly size: import("@lynstack/recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => Readonly<Record<"badge" | "icon" | "label" | "root", string>>) & {
    readonly variantKeys: readonly ("shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly shape: readonly "round"[];
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
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
};
declare const level4: ((props: {
    readonly muted?: import("@lynstack/recipe").VariantOption<{
        readonly true: {
            readonly hint: "opacity-50";
        };
    }> | undefined;
    readonly shape: "round";
    readonly size: import("@lynstack/recipe").VariantOption<{
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => Readonly<Record<"badge" | "hint" | "icon" | "label" | "root", string>>) & {
    readonly variantKeys: readonly ("muted" | "shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly shape: readonly "round"[];
        readonly size: readonly import("@lynstack/recipe").VariantOption<{
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
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
};
export { level0, level1, level2, level3, level4 };
