declare const level0: ((props: {
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly root: {
                readonly height: 32;
            };
        };
        readonly sm: {
            readonly root: {
                readonly height: 24;
            };
        };
    }>;
}) => {
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        }>[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly "root"[]> | undefined;
};
declare const level1: ((props: {
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly root: {
                readonly height: 32;
            };
        };
        readonly sm: {
            readonly root: {
                readonly height: 24;
            };
        };
    }>;
    readonly tone: "danger";
}) => {
    readonly icon: {
        readonly opacity?: 1 | undefined;
    };
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        }>[];
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly opacity: 1;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("icon" | "root")[]> | undefined;
};
declare const level2: ((props: {
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly root: {
                readonly height: 32;
            };
        };
        readonly sm: {
            readonly root: {
                readonly height: 24;
            };
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly icon: {
        readonly opacity?: 1 | undefined;
    };
    readonly label: {
        readonly fontWeight?: "700" | undefined;
    };
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}) & {
    readonly variantKeys: readonly ("size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
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
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly opacity: 1;
                };
            };
        };
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly fontWeight: "700";
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("icon" | "label" | "root")[]> | undefined;
};
declare const level3: ((props: {
    readonly shape: "round";
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly root: {
                readonly height: 32;
            };
        };
        readonly sm: {
            readonly root: {
                readonly height: 24;
            };
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly badge: {
        readonly borderRadius?: 999 | undefined;
    };
    readonly icon: {
        readonly opacity?: 1 | undefined;
    };
    readonly label: {
        readonly fontWeight?: "700" | undefined;
    };
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}) & {
    readonly variantKeys: readonly ("shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly shape: readonly "round"[];
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly shape: {
            readonly round: {
                readonly badge: {
                    readonly borderRadius: 999;
                };
            };
        };
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly opacity: 1;
                };
            };
        };
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly fontWeight: "700";
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("badge" | "icon" | "label" | "root")[]> | undefined;
};
declare const level4: ((props: {
    readonly muted?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly hint: {
                readonly opacity: 0.5;
            };
        };
    }> | undefined;
    readonly shape: "round";
    readonly size: import("@lynstack/native-recipe").VariantOption<{
        readonly md: {
            readonly root: {
                readonly height: 32;
            };
        };
        readonly sm: {
            readonly root: {
                readonly height: 24;
            };
        };
    }>;
    readonly tone: "danger";
    readonly weight: "bold";
}) => {
    readonly badge: {
        readonly borderRadius?: 999 | undefined;
    };
    readonly hint: {
        readonly opacity?: 0.5 | undefined;
    };
    readonly icon: {
        readonly opacity?: 1 | undefined;
    };
    readonly label: {
        readonly fontWeight?: "700" | undefined;
    };
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}) & {
    readonly variantKeys: readonly ("muted" | "shape" | "size" | "tone" | "weight")[];
    readonly variantOptions: {
        readonly muted: readonly ("false" | "true")[];
        readonly shape: readonly "round"[];
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        }>[];
        readonly tone: readonly "danger"[];
        readonly weight: readonly "bold"[];
    };
    readonly defaultVariants: {
        readonly muted: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly muted: {
            readonly true: {
                readonly hint: {
                    readonly opacity: 0.5;
                };
            };
        };
        readonly shape: {
            readonly round: {
                readonly badge: {
                    readonly borderRadius: 999;
                };
            };
        };
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly height: 32;
                };
            };
            readonly sm: {
                readonly root: {
                    readonly height: 24;
                };
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly opacity: 1;
                };
            };
        };
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly fontWeight: "700";
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("badge" | "hint" | "icon" | "label" | "root")[]> | undefined;
};
export { level0, level1, level2, level3, level4 };
