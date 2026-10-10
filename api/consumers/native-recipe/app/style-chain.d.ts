declare const level0: import("@lynstack/native-recipe").StyleRecipe<{
    readonly size: "md" | "sm";
}, {
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly height: 32;
        };
        readonly sm: {
            readonly height: 24;
        };
    };
}, never, import("@lynstack/native-recipe").NativeStyle, undefined>>;
declare const level1: import("@lynstack/native-recipe").StyleRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
}, {
    readonly backgroundColor?: "red" | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.9 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, undefined>>;
declare const level2: import("@lynstack/native-recipe").StyleRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, {
    readonly backgroundColor?: "red" | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.9 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, undefined>>;
declare const level3: import("@lynstack/native-recipe").StyleRecipe<{
    readonly shape?: "round" | "square" | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, {
    readonly backgroundColor?: "red" | undefined;
    readonly borderRadius?: 0 | 999 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.9 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, "shape", import("@lynstack/native-recipe").NativeStyle, undefined>>;
declare const level4: import("@lynstack/native-recipe").StyleRecipe<{
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape?: "round" | "square" | undefined;
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, {
    readonly backgroundColor?: "red" | undefined;
    readonly borderRadius?: 0 | 999 | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly flexDirection?: "row" | undefined;
    readonly height?: 24 | 32 | undefined;
    readonly opacity?: 0.5 | 0.9 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, "shape", import("@lynstack/native-recipe").NativeStyle, undefined>>;
export { level0, level1, level2, level3, level4 };
