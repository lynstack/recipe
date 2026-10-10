import type { NativeStyle, SlotStyles, ThemedRecipe, VariantsOf } from "@lynstack/native-recipe";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
declare const box: import("@lynstack/native-recipe").StyleRecipe<{
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | undefined;
    readonly tone: "danger" | "neutral";
}, {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderRadius?: 8 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 40 | 48 | undefined;
    readonly opacity?: 0.5 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, "size", NativeStyle, undefined>>;
type BoxVariants = VariantsOf<typeof box>;
declare const iconBox: import("@lynstack/native-recipe").StyleRecipe<{
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly tone: "danger" | "neutral";
}, {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderRadius?: 8 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 32 | 40 | 48 | undefined;
    readonly opacity?: 0.5 | undefined;
    readonly width?: 32 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, "size", NativeStyle, undefined>>;
type IconBoxVariants = VariantsOf<typeof iconBox>;
declare const button: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "md";
}, {
    readonly label: {
        readonly fontSize?: 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly height?: 40 | undefined;
    };
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, NativeStyle, readonly ("label" | "root")[]>>;
declare const labeledButton: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "md";
}, {
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
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, NativeStyle, readonly ("icon" | ("label" | "root"))[]>>;
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
declare const chip: ThemedRecipe<Theme, {
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
declare const tag: ThemedRecipe<Theme, {
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
declare const iconChip: ThemedRecipe<Theme, {
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
    readonly tone?: "danger" | "neutral" | undefined;
}, {
    readonly borderRadius?: 4 | undefined;
    readonly borderWidth?: 1 | undefined;
    readonly opacity?: 0.5 | 1 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly tone: {
        readonly danger: {
            readonly opacity: 1;
        };
        readonly neutral: {
            readonly opacity: 0.5;
        };
    };
}, "tone", NativeStyle, undefined>>;
declare const fadeStyle: NativeStyle;
declare const field: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "sm";
}, {
    readonly input: {
        readonly height?: 24 | undefined;
    };
    readonly label: {
        readonly fontSize?: 12 | undefined;
    };
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly size: {
        readonly sm: {
            readonly input: {
                readonly height: 24;
            };
        };
    };
}, never, NativeStyle, readonly ("input" | "label")[]>>;
declare const fieldStyles: SlotStyles<"label" | "input">;
declare const compactBox: import("@lynstack/native-recipe").StyleRecipe<{
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | "xs" | undefined;
    readonly tone: "danger" | "neutral";
}, {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderRadius?: 8 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 24 | 40 | 48 | undefined;
    readonly opacity?: 0.5 | undefined;
    readonly padding?: 2 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, "size", NativeStyle, undefined>>;
declare const compactBoxStyle: NativeStyle;
declare const footedButton: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly dense?: "false" | "true" | boolean | undefined;
    readonly size: "md";
}, {
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
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, NativeStyle, readonly ("footer" | ("label" | "root"))[]>>;
declare const footedButtonStyles: Readonly<Record<"root" | "label" | "footer", NativeStyle>>;
export { compactBox, compactBoxStyle, footedButton, footedButtonStyles, anyChip, anyStyle, box, boxDefaults, boxKeys, boxOptions, button, chip, chipKeys, chipOptions, chipStyle, fade, fadeStyle, field, fieldStyles, iconBox, iconBoxStyle, iconChip, iconChipStyle, iconStyle, labelStyle, labeledButton, rootStyle, style, tag, tagLabelStyle, };
export type { BoxVariants, ChipVariants, IconBoxVariants };
