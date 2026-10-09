declare const box: ((props: {
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "muted";
}) => {
    readonly height?: 32 | 40 | undefined;
    readonly opacity?: 0.6 | undefined;
}) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "muted"[];
    };
    readonly defaultVariants: {
        readonly size: "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly height: 40;
            };
            readonly sm: {
                readonly height: 32;
            };
        };
        readonly tone: {
            readonly muted: {
                readonly opacity: 0.6;
            };
        };
    }, "size", import("@lynstack/native-recipe").NativeStyle, undefined> | undefined;
};
declare const card: ((props?: {
    readonly raised?: "false" | "true" | boolean | undefined;
} | undefined) => {
    readonly root: {
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
    }, never, import("@lynstack/native-recipe").NativeStyle, readonly ("root" | "title")[]> | undefined;
};
/** Configs whose styles are arrays of styles, which the types reject. */
declare function createArrayStyleRecipes(): void;
/** Calls and configs that the types reject, one of each mistake. */
declare function misuses(): void;
export { box, card, createArrayStyleRecipes, misuses };
