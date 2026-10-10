declare const level0: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "md" | "sm";
}, {
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, readonly "root"[]>>;
declare const level1: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
}, {
    readonly icon: {
        readonly opacity?: 1 | undefined;
    };
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, readonly ("icon" | "root")[]>>;
declare const level2: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, {
    readonly icon: {
        readonly opacity?: 1 | undefined;
    };
    readonly label: {
        readonly fontWeight?: "700" | undefined;
    };
    readonly root: {
        readonly height?: 24 | 32 | undefined;
    };
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, readonly ("label" | ("icon" | "root"))[]>>;
declare const level3: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, {
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
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, readonly ("badge" | ("label" | ("icon" | "root")))[]>>;
declare const level4: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly muted?: "false" | "true" | boolean | undefined;
    readonly shape: "round";
    readonly size: "md" | "sm";
    readonly tone: "danger";
    readonly weight: "bold";
}, {
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
}, import("@lynstack/native-recipe").RecipeComposition<{
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
}, never, import("@lynstack/native-recipe").NativeStyle, readonly ("hint" | ("badge" | ("label" | ("icon" | "root"))))[]>>;
export { level0, level1, level2, level3, level4 };
