declare const level0: ((props: {
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly height: 32;
        };
        readonly sm: {
            readonly height: 24;
        };
    }>;
}) => {
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
}) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        }>[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
declare const level1: ((props: {
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly height: 32;
        };
        readonly sm: {
            readonly height: 24;
        };
    }>;
    readonly tone: "danger";
}) => {
    readonly backgroundColor?: "red" | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.9 | undefined;
}) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        }>[];
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "red";
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
declare const level2: ((props: {
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly height: 32;
        };
        readonly sm: {
            readonly height: 24;
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly backgroundColor?: "red" | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.9 | undefined;
}) & {
    readonly variantKeys: readonly ("size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "red";
            };
        };
        readonly weight: {
            readonly bold: {
                readonly borderWidth: 2;
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
declare const level3: ((props: {
    readonly shape?: import("@lynstack/native-recipe").VariantOption<{
        readonly round: {
            readonly borderRadius: 999;
        };
        readonly square: {
            readonly borderRadius: 0;
        };
    }> | undefined;
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly height: 32;
        };
        readonly sm: {
            readonly height: 24;
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly backgroundColor?: "red" | undefined;
    readonly borderRadius?: 0 | 999 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.9 | undefined;
}) & {
    readonly variantKeys: readonly ("shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly shape: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly round: {
                readonly borderRadius: 999;
            };
            readonly square: {
                readonly borderRadius: 0;
            };
        }>[];
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly shape: import("@lynstack/native-recipe").VariantOption<{
            readonly round: {
                readonly borderRadius: 999;
            };
            readonly square: {
                readonly borderRadius: 0;
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly shape: {
            readonly round: {
                readonly borderRadius: 999;
            };
            readonly square: {
                readonly borderRadius: 0;
            };
        };
        readonly size: {
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "red";
            };
        };
        readonly weight: {
            readonly bold: {
                readonly borderWidth: 2;
            };
        };
    }, "shape", import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
declare const level4: ((props: {
    readonly muted?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly opacity: 0.5;
        };
    }> | undefined;
    readonly shape?: import("@lynstack/native-recipe").VariantOption<{
        readonly round: {
            readonly borderRadius: 999;
        };
        readonly square: {
            readonly borderRadius: 0;
        };
    }> | undefined;
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly height: 32;
        };
        readonly sm: {
            readonly height: 24;
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly backgroundColor?: "red" | undefined;
    readonly borderRadius?: 0 | 999 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.5 | 0.9 | undefined;
}) & {
    readonly variantKeys: readonly ("muted" | "shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly shape: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly round: {
                readonly borderRadius: 999;
            };
            readonly square: {
                readonly borderRadius: 0;
            };
        }>[];
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
        readonly shape: import("@lynstack/native-recipe").VariantOption<{
            readonly round: {
                readonly borderRadius: 999;
            };
            readonly square: {
                readonly borderRadius: 0;
            };
        }>;
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly muted: {
            readonly true: {
                readonly opacity: 0.5;
            };
        };
        readonly shape: {
            readonly round: {
                readonly borderRadius: 999;
            };
            readonly square: {
                readonly borderRadius: 0;
            };
        };
        readonly size: {
            readonly md: {
                readonly height: 32;
            };
            readonly sm: {
                readonly height: 24;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "red";
            };
        };
        readonly weight: {
            readonly bold: {
                readonly borderWidth: 2;
            };
        };
    }, "shape", import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
export { level0, level1, level2, level3, level4 };
