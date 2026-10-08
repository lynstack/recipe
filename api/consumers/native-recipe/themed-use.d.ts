import type { NativeStyle, SlotStyles, VariantsOf } from "@lynstack/native-recipe";
import type { StyleProp, ViewStyle } from "react-native";
import type { Palette } from "./themed-define";
declare const badge: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly tone?: import("@lynstack/native-recipe").VariantOption<{
        readonly primary: {
            backgroundColor: string;
        };
        readonly surface: {
            backgroundColor: string;
        };
    }> | undefined;
}, NativeStyle>;
declare const chip: ((theme: Palette, props: {
    readonly size: "md";
}) => {
    readonly borderRadius?: number | undefined;
    readonly height?: 40 | undefined;
}) & {
    readonly withTheme: (theme: Palette) => import("@lynstack/native-recipe").KindRecipe<{
        readonly size: "md";
    }, {
        readonly borderRadius?: number | undefined;
        readonly height?: 40 | undefined;
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly borderRadius: number;
                readonly height: 40;
            };
        };
    }, never, NativeStyle, undefined>>;
};
declare const card: ((theme: Palette, props?: {
    readonly raised?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    }> | undefined;
} | undefined) => {
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
    };
    readonly title: {};
}) & {
    readonly withTheme: (theme: Palette) => import("@lynstack/native-recipe").KindRecipe<{
        readonly raised?: import("@lynstack/native-recipe").VariantOption<{
            readonly true: {
                readonly root: {
                    readonly elevation: 2;
                };
            };
        }> | undefined;
    }, {
        readonly root: {
            readonly borderRadius?: number | undefined;
            readonly elevation?: 2 | undefined;
        };
        readonly title: {};
    }, import("@lynstack/native-recipe").RecipeComposition<{
        readonly raised: {
            readonly true: {
                readonly root: {
                    readonly elevation: 2;
                };
            };
        };
    }, never, NativeStyle, readonly ("root" | "title")[]>>;
};
declare const lightChip: ((props: {
    readonly round?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly borderRadius: 999;
        };
    }> | undefined;
    readonly size: "md";
}) => {
    readonly borderRadius?: number | undefined;
    readonly height?: 40 | undefined;
}) & {
    readonly variantKeys: readonly ("round" | "size")[];
    readonly variantOptions: {
        readonly round: readonly ("false" | "true")[];
        readonly size: readonly "md"[];
    };
    readonly defaultVariants: {
        readonly round: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly round: {
            readonly true: {
                readonly borderRadius: 999;
            };
        };
        readonly size: {
            readonly md: {
                readonly borderRadius: number;
                readonly height: 40;
            };
        };
    }, never, NativeStyle, undefined> | undefined;
};
declare const lightCard: ((props?: {
    readonly raised?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    }> | undefined;
} | undefined) => {
    readonly footer: {
        readonly paddingTop?: 8 | undefined;
    };
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
    };
    readonly title: {};
}) & {
    readonly variantKeys: readonly "raised"[];
    readonly variantOptions: {
        readonly raised: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly raised: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly raised: {
            readonly true: {
                readonly root: {
                    readonly elevation: 2;
                };
            };
        };
    }, never, NativeStyle, readonly ("footer" | "root" | "title")[]> | undefined;
};
declare const panel: ((props?: {
    readonly dense?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly body: {
                readonly padding: 4;
            };
            readonly root: {
                readonly margin: 0;
            };
        };
    }> | undefined;
    readonly raised?: import("@lynstack/native-recipe").VariantOption<{
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    }> | undefined;
} | undefined) => {
    readonly body: {
        readonly padding?: 4 | undefined;
    };
    readonly footer: {
        readonly paddingTop?: 8 | undefined;
    };
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
        readonly margin?: 0 | undefined;
    };
    readonly title: {};
}) & {
    readonly variantKeys: readonly ("dense" | "raised")[];
    readonly variantOptions: {
        readonly dense: readonly ("false" | "true")[];
        readonly raised: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly dense: "false" | "true";
        readonly raised: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly dense: {
            readonly true: {
                readonly body: {
                    readonly padding: 4;
                };
                readonly root: {
                    readonly margin: 0;
                };
            };
        };
        readonly raised: {
            readonly true: {
                readonly root: {
                    readonly elevation: 2;
                };
            };
        };
    }, never, NativeStyle, readonly ("body" | "footer" | "root" | "title")[]> | undefined;
};
type LightChipVariants = VariantsOf<typeof lightChip>;
declare const badgeStyle: StyleProp<ViewStyle>;
declare const chipStyle: StyleProp<ViewStyle>;
declare const lightChipStyle: NativeStyle;
declare const lightCardStyles: SlotStyles<"footer" | "root" | "title">;
declare const panelStyles: SlotStyles<"body" | "footer" | "root" | "title">;
export { badge, badgeStyle, card, chip, chipStyle, lightChip, lightChipStyle, lightCard, lightCardStyles, panel, panelStyles, };
export type { LightChipVariants };
