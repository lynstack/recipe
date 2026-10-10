interface Theme {
    readonly colors: {
        readonly primary: string;
        readonly surface: string;
    };
    readonly space: number;
}
declare const light: Theme;
declare const themed: import("@lynstack/native-recipe").ThemedRecipeCreators<Theme>;
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
}, "size", import("@lynstack/native-recipe").NativeStyle, undefined>>;
declare const button: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size?: "md" | "sm" | undefined;
}, {
    readonly label: {
        readonly fontSize?: 14 | 16 | undefined;
        readonly fontWeight?: "600" | undefined;
    };
    readonly root: {
        readonly alignItems?: "center" | undefined;
        readonly height?: 32 | 40 | undefined;
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
        readonly sm: {
            readonly label: {
                readonly fontSize: 14;
            };
            readonly root: {
                readonly height: 32;
            };
        };
    };
}, "size", import("@lynstack/native-recipe").NativeStyle, readonly ("label" | "root")[]>>;
declare const iconButton: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly round?: "false" | "true" | boolean | undefined;
    readonly size?: "md" | "sm" | undefined;
}, {
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
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, "size", import("@lynstack/native-recipe").NativeStyle, readonly ("icon" | ("label" | "root"))[]>>;
declare const chip: import("@lynstack/native-recipe").ThemedRecipe<Theme, {
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
declare const card: import("@lynstack/native-recipe").ThemedRecipe<Theme, {
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
export { box, button, card, chip, iconButton, light, themed };
export type { Theme };
