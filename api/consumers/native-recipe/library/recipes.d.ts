interface Theme {
    readonly colors: {
        readonly primary: string;
        readonly surface: string;
    };
    readonly space: number;
}
declare const light: Theme;
declare const themed: import("@lynstack/native-recipe").ThemedRecipeCreators<Theme>;
declare const box: ((props: {
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | undefined;
    readonly tone: "danger" | "neutral";
}) => {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderRadius?: 8 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 40 | 48 | undefined;
    readonly opacity?: 0.5 | undefined;
}) & {
    readonly variantKeys: readonly ("disabled" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly size: readonly ("lg" | "md")[];
        readonly tone: readonly ("danger" | "neutral")[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: "lg" | "md";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly disabled: {
            readonly true: {
                readonly opacity: 0.5;
            };
        };
        readonly size: {
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "#dc2626";
            };
            readonly neutral: {};
        };
    }, "size", import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
declare const button: ((props?: {
    readonly size?: "md" | "sm" | undefined;
} | undefined) => {
    readonly label: {
        readonly fontSize?: 14 | 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly height?: 32 | 40 | undefined;
    };
}) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
    };
    readonly defaultVariants: {
        readonly size: "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly label: {
                    readonly fontSize: 16;
                };
                readonly root: {
                    readonly height: 40;
                };
            };
            readonly sm: {
                readonly label: {
                    readonly fontSize: 14;
                };
                readonly root: {
                    readonly height: 32;
                };
            };
        };
    }, "size", import("@lynstack/native-recipe").NativeStyle, readonly ("label" | "root")[]> | undefined;
};
declare const iconButton: ((props?: {
    readonly round?: "false" | "true" | boolean | undefined;
    readonly size?: "md" | "sm" | undefined;
} | undefined) => {
    readonly icon: {
        readonly width?: 16 | undefined;
    };
    readonly label: {
        readonly fontSize?: 14 | 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly borderRadius?: 999 | undefined;
        readonly gap?: 8 | undefined;
        readonly height?: 32 | 40 | undefined;
    };
}) & {
    readonly variantKeys: readonly ("round" | "size")[];
    readonly variantOptions: {
        readonly round: readonly ("false" | "true")[];
        readonly size: readonly ("md" | "sm")[];
    };
    readonly defaultVariants: {
        readonly round: "false" | "true";
        readonly size: "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly round: {
            readonly true: {
                readonly root: {
                    readonly borderRadius: 999;
                };
            };
        };
        readonly size: {
            readonly md: {
                readonly label: {
                    readonly fontSize: 16;
                };
                readonly root: {
                    readonly height: 40;
                };
            };
            readonly sm: {
                readonly label: {
                    readonly fontSize: 14;
                };
                readonly root: {
                    readonly height: 32;
                };
            };
        };
    }, "size", import("@lynstack/native-recipe").NativeStyle, readonly ("icon" | "label" | "root")[]> | undefined;
};
declare const chip: ((theme: Theme, props?: {
    readonly tone?: "primary" | "surface" | undefined;
} | undefined) => {
    readonly backgroundColor?: string | undefined;
    readonly padding?: number | undefined;
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly tone?: "primary" | "surface" | undefined;
    }, {
        readonly backgroundColor?: string | undefined;
        readonly padding?: number | undefined;
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly tone: {
            primary: {
                backgroundColor: string;
            };
            surface: {
                backgroundColor: string;
            };
        };
    }, "tone", import("@lynstack/native-recipe").NativeStyle, undefined>>;
};
declare const card: ((theme: Theme, props: {
    readonly raised?: "false" | "true" | boolean | undefined;
    readonly tone: "accent";
}) => {
    readonly root: {
        readonly borderColor?: string | undefined;
        readonly elevation?: 2 | undefined;
        readonly padding?: number | undefined;
    };
    readonly title: {
        readonly color?: string | undefined;
        readonly fontSize?: 18 | undefined;
    };
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly raised?: "false" | "true" | boolean | undefined;
        readonly tone: "accent";
    }, {
        readonly root: {
            readonly borderColor?: string | undefined;
            readonly elevation?: 2 | undefined;
            readonly padding?: number | undefined;
        };
        readonly title: {
            readonly color?: string | undefined;
            readonly fontSize?: 18 | undefined;
        };
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly raised: {
            readonly true: {
                readonly root: {
                    readonly elevation: 2;
                };
            };
        };
        readonly tone: {
            accent: {
                root: {
                    borderColor: string;
                };
            };
        };
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("root" | "title")[]>>;
};
export { box, button, card, chip, iconButton, light, themed };
export type { Theme };
