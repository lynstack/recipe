declare const text: ((props: {
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "muted";
}) => Readonly<Record<string, string | number>>) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "muted"[];
    };
    readonly defaultVariants: {
        readonly size: "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly fontSize: 16;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        };
        readonly tone: {
            readonly muted: {
                readonly opacity: 0.6;
            };
        };
    }, "size", Readonly<Record<string, string | number>>, undefined> | undefined;
};
declare const card: ((props?: {
    readonly raised?: "false" | "true" | boolean | undefined;
} | undefined) => Readonly<Record<"root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly "raised"[];
    readonly variantOptions: {
        readonly raised: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly raised: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly raised: {
            readonly true: {
                readonly root: {
                    readonly elevation: 2;
                };
            };
        };
    }, never, Readonly<Record<string, string | number>>, readonly ("root" | "title")[]> | undefined;
};
/** Calls and configs that the types reject, one of each mistake. */
declare function misuses(): void;
export { card, misuses, text };
