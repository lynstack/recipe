import type { StyleProp, ViewStyle } from "react-native";
import type { ReactNode } from "react";
import type { VariantsOf } from "@lynstack/native-recipe";
interface Theme {
    readonly colors: {
        readonly primary: string;
    };
}
declare const box: ((props: {
    readonly padded?: "false" | "true" | boolean | undefined;
    readonly tone: "muted" | "plain";
}) => {
    readonly borderRadius?: 8 | undefined;
    readonly opacity?: 0.6 | undefined;
    readonly padding?: 0 | 16 | undefined;
}) & {
    readonly variantKeys: readonly ("padded" | "tone")[];
    readonly variantOptions: {
        readonly padded: readonly ("false" | "true")[];
        readonly tone: readonly ("muted" | "plain")[];
    };
    readonly defaultVariants: {
        readonly padded: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly padded: {
            readonly false: {
                readonly padding: 0;
            };
            readonly true: {
                readonly padding: 16;
            };
        };
        readonly tone: {
            readonly muted: {
                readonly opacity: 0.6;
            };
            readonly plain: {};
        };
    }, "padded", import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
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
    }, never, import("@lynstack/native-recipe").NativeStyle, undefined>>;
};
type BoxProps = VariantsOf<typeof box> & {
    readonly children?: ReactNode;
    readonly style?: StyleProp<ViewStyle>;
};
/** A view whose variants are props, before the style of its caller. */
declare function Box({ children, style, ...variants }: BoxProps): ReactNode;
type ButtonProps = VariantsOf<typeof button> & {
    readonly label: string;
    readonly onPress?: () => void;
};
/** A pressable whose slots style the view and its text. */
declare function Button({ label, onPress, ...variants }: ButtonProps): ReactNode;
type ChipProps = VariantsOf<typeof chip> & {
    readonly theme: Theme;
};
/** A view styled from the theme its caller passes. */
declare function Chip({ theme, ...variants }: ChipProps): ReactNode;
/** A screen that renders the components with their props. */
declare function Screen(): ReactNode;
export { Box, Button, Chip, Screen };
export type { BoxProps, ButtonProps, ChipProps };
