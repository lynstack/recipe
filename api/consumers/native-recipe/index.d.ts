import type { NativeStyle, SlotStyles, ThemedRecipe, VariantsOf } from "@lynstack/native-recipe";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
declare const box: ((props: {
    readonly disabled?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly opacity: 0.5;
        };
    }> | undefined;
    readonly size?: import("@lynstack/native-recipe").VariantOption<{
        readonly lg: {
            readonly height: 48;
        };
        readonly md: {
            readonly height: 40;
        };
    }> | undefined;
    readonly tone: import("@lynstack/native-recipe").VariantOption<{
        readonly danger: {
            readonly backgroundColor: "#dc2626";
        };
        readonly neutral: {};
    }>;
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
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
        }>[];
        readonly tone: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly danger: {
                readonly backgroundColor: "#dc2626";
            };
            readonly neutral: {};
        }>[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: import("@lynstack/native-recipe").VariantOption<{
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
        }>;
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
    }, "size", NativeStyle, undefined> | undefined;
};
type BoxVariants = VariantsOf<typeof box>;
declare const iconBox: ((props: {
    readonly disabled?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly opacity: 0.5;
        };
    }> | undefined;
    readonly size?: import("@lynstack/native-recipe").VariantOption<{
        readonly lg: {
            readonly height: 48;
        };
        readonly md: {
            readonly height: 40;
        };
        readonly sm: {
            readonly height: 32;
            readonly width: 32;
        };
    }> | undefined;
    readonly tone: import("@lynstack/native-recipe").VariantOption<{
        readonly danger: {
            readonly backgroundColor: "#dc2626";
        };
        readonly neutral: {};
    }>;
}) => {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderRadius?: 8 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 32 | 40 | 48 | undefined;
    readonly opacity?: 0.5 | undefined;
    readonly width?: 32 | undefined;
}) & {
    readonly variantKeys: readonly ("disabled" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
            readonly sm: {
                readonly height: 32;
                readonly width: 32;
            };
        }>[];
        readonly tone: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly danger: {
                readonly backgroundColor: "#dc2626";
            };
            readonly neutral: {};
        }>[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: import("@lynstack/native-recipe").VariantOption<{
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
            readonly sm: {
                readonly height: 32;
                readonly width: 32;
            };
        }>;
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
            readonly sm: {
                readonly height: 32;
                readonly width: 32;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "#dc2626";
            };
            readonly neutral: {};
        };
    }, "size", NativeStyle, undefined> | undefined;
};
type IconBoxVariants = VariantsOf<typeof iconBox>;
declare const button: ((props: {
    readonly size: "md";
}) => {
    readonly label: {
        readonly fontSize?: 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly height?: 40 | undefined;
    };
}) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly "md"[];
    };
    readonly defaultVariants: {};
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
        };
    }, never, NativeStyle, readonly ("label" | "root")[]> | undefined;
};
declare const labeledButton: ((props: {
    readonly size: "md";
}) => {
    readonly icon: {
        readonly width?: 16 | undefined;
    };
    readonly label: {
        readonly fontSize?: 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly gap?: 8 | undefined;
        readonly height?: 40 | undefined;
    };
}) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly "md"[];
    };
    readonly defaultVariants: {};
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
        };
    }, never, NativeStyle, readonly ("icon" | "label" | "root")[]> | undefined;
};
declare const style: StyleProp<ViewStyle>;
declare const iconBoxStyle: StyleProp<ViewStyle>;
declare const iconStyle: StyleProp<ViewStyle>;
declare const rootStyle: StyleProp<ViewStyle>;
declare const labelStyle: StyleProp<TextStyle>;
declare const anyStyle: NativeStyle;
declare const boxKeys: readonly ("disabled" | "size" | "tone")[];
declare const boxOptions: {
    readonly size: readonly ("lg" | "md")[];
};
declare const boxDefaults: {
    readonly disabled: "false" | "true";
};
interface Theme {
    readonly colors: {
        readonly primary: string;
    };
}
declare const chip: ((theme: Theme, props: {
    readonly tone: "primary";
}) => {
    readonly backgroundColor?: string | undefined;
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly tone: "primary";
    }, {
        readonly backgroundColor?: string | undefined;
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly tone: {
            primary: {
                backgroundColor: string;
            };
        };
    }, never, NativeStyle, undefined>>;
};
declare const tag: ((theme: Theme, props: {
    readonly tone: "primary";
}) => {
    readonly label: {
        readonly color?: string | undefined;
    };
    readonly root: {};
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly tone: "primary";
    }, {
        readonly label: {
            readonly color?: string | undefined;
        };
        readonly root: {};
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly tone: {
            primary: {
                label: {
                    color: string;
                };
            };
        };
    }, never, NativeStyle, readonly ("label" | "root")[]>>;
};
declare const iconChip: ((theme: Theme, props: {
    readonly tone: "primary";
}) => {
    readonly backgroundColor?: string | undefined;
    readonly width?: 24 | undefined;
}) & {
    readonly withTheme: (theme: Theme) => import("@lynstack/native-recipe").KindRecipe<{
        readonly tone: "primary";
    }, {
        readonly backgroundColor?: string | undefined;
        readonly width?: 24 | undefined;
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly tone: {
            readonly primary: {
                readonly backgroundColor: string;
            };
        };
    }, never, NativeStyle, undefined>>;
};
type ChipVariants = VariantsOf<typeof chip>;
declare const chipStyle: StyleProp<ViewStyle>;
declare const tagLabelStyle: StyleProp<TextStyle>;
declare const chipKeys: readonly "tone"[];
declare const chipOptions: {
    readonly tone: readonly "primary"[];
};
declare const iconChipStyle: StyleProp<ViewStyle>;
declare const anyChip: ThemedRecipe<Theme, ChipVariants, {
    readonly backgroundColor?: string;
}>;
declare const fade: import("@lynstack/native-recipe").StyleRecipe<{
    readonly tone?: import("@lynstack/native-recipe").VariantOption<{
        readonly danger: {
            readonly opacity: 1;
        };
        readonly neutral: {
            readonly opacity: 0.5;
        };
    }> | undefined;
}, NativeStyle>;
declare const fadeStyle: NativeStyle;
declare const field: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "sm";
}, Readonly<Partial<Record<"input" | "label", NativeStyle | undefined>>>>;
declare const fieldStyles: SlotStyles<"label" | "input">;
/** Configs whose styles are arrays of styles, which the types reject. */
declare function createArrayStyleRecipes(): void;
declare const compactBox: ((props: {
    readonly disabled?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly opacity: 0.5;
        };
    }> | undefined;
    readonly size?: import("@lynstack/native-recipe").VariantOption<{
        readonly lg: {
            readonly height: 48;
        };
        readonly md: {
            readonly height: 40;
        };
        readonly xs: {
            readonly height: 24;
        };
    }> | undefined;
    readonly tone: import("@lynstack/native-recipe").VariantOption<{
        readonly danger: {
            readonly backgroundColor: "#dc2626";
        };
        readonly neutral: {};
    }>;
}) => {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderRadius?: 8 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 24 | 40 | 48 | undefined;
    readonly opacity?: 0.5 | undefined;
}) & {
    readonly variantKeys: readonly ("disabled" | "size" | "tone")[];
    readonly variantOptions: {
        readonly disabled: readonly ("false" | "true")[];
        readonly size: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
            readonly xs: {
                readonly height: 24;
            };
        }>[];
        readonly tone: readonly import("@lynstack/native-recipe").VariantOption<{
            readonly danger: {
                readonly backgroundColor: "#dc2626";
            };
            readonly neutral: {};
        }>[];
    };
    readonly defaultVariants: {
        readonly disabled: "false" | "true";
        readonly size: import("@lynstack/native-recipe").VariantOption<{
            readonly lg: {
                readonly height: 48;
            };
            readonly md: {
                readonly height: 40;
            };
            readonly xs: {
                readonly height: 24;
            };
        }>;
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
            readonly xs: {
                readonly height: 24;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly backgroundColor: "#dc2626";
            };
            readonly neutral: {};
        };
    }, "size", NativeStyle, undefined> | undefined;
};
declare const compactBoxStyle: NativeStyle;
declare const footedButton: ((props: {
    readonly dense?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly footer: {
                readonly borderStyle: "dashed";
            };
        };
    }> | undefined;
    readonly size: "md";
}) => {
    readonly footer: {
        readonly borderStyle?: "dashed" | "solid" | undefined;
    };
    readonly label: {
        readonly fontSize?: 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly height?: 40 | undefined;
    };
}) & {
    readonly variantKeys: readonly ("dense" | "size")[];
    readonly variantOptions: {
        readonly dense: readonly ("false" | "true")[];
        readonly size: readonly "md"[];
    };
    readonly defaultVariants: {
        readonly dense: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly dense: {
            readonly true: {
                readonly footer: {
                    readonly borderStyle: "dashed";
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
        };
    }, never, NativeStyle, readonly ("footer" | "label" | "root")[]> | undefined;
};
declare const footedButtonStyles: Readonly<Record<"root" | "label" | "footer", NativeStyle>>;
export { compactBox, compactBoxStyle, footedButton, footedButtonStyles, anyChip, anyStyle, box, boxDefaults, boxKeys, boxOptions, button, chip, chipKeys, chipOptions, chipStyle, createArrayStyleRecipes, fade, fadeStyle, field, fieldStyles, iconBox, iconBoxStyle, iconChip, iconChipStyle, iconStyle, labelStyle, labeledButton, rootStyle, style, tag, tagLabelStyle, };
export type { BoxVariants, ChipVariants, IconBoxVariants };
