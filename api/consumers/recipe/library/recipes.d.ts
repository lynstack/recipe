type Style = Readonly<Record<string, string | number>>;
declare const styleRecipe: import("@lynstack/recipe").CreateKindRecipe<Readonly<Record<string, string | number>>, Readonly<Record<string, string | number>>>;
declare const slotStyleRecipe: import("@lynstack/recipe").CreateKindSlotRecipe<Readonly<Record<string, string | number>>, Readonly<Record<string, string | number>>>;
declare const classRecipe: import("@lynstack/recipe").CreateKindRecipe<string, string>;
declare const text: ((props?: {
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly truncated?: "false" | "true" | boolean | undefined;
} | undefined) => Readonly<Record<string, string | number>>) & {
    readonly variantKeys: readonly ("size" | "truncated")[];
    readonly variantOptions: {
        readonly size: readonly ("lg" | "md" | "sm")[];
        readonly truncated: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly size: "lg" | "md" | "sm";
        readonly truncated: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly size: {
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly md: {
                readonly fontSize: 16;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        };
        readonly truncated: {
            readonly true: {
                readonly overflow: "hidden";
            };
        };
    }, "size", Readonly<Record<string, string | number>>, undefined> | undefined;
};
declare const card: ((props?: {
    readonly tone?: "dark" | "light" | undefined;
} | undefined) => Readonly<Record<"root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly ("dark" | "light")[];
    };
    readonly defaultVariants: {
        readonly tone: "dark" | "light";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    }, "tone", Readonly<Record<string, string | number>>, readonly ("root" | "title")[]> | undefined;
};
declare const heading: ((props: {
    readonly level: "1" | "2";
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly truncated?: "false" | "true" | boolean | undefined;
}) => Readonly<Record<string, string | number>>) & {
    readonly variantKeys: readonly ("level" | "size" | "truncated")[];
    readonly variantOptions: {
        readonly level: readonly ("1" | "2")[];
        readonly size: readonly ("lg" | "md" | "sm")[];
        readonly truncated: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly size: "lg" | "md" | "sm";
        readonly truncated: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly level: {
            readonly 1: {
                readonly fontSize: 32;
            };
            readonly 2: {
                readonly fontSize: 28;
            };
        };
        readonly size: {
            readonly lg: {
                readonly fontSize: 24;
            };
            readonly md: {
                readonly fontSize: 16;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        };
        readonly truncated: {
            readonly true: {
                readonly overflow: "hidden";
            };
        };
    }, "size", Readonly<Record<string, string | number>>, undefined> | undefined;
};
declare const dialog: ((props?: {
    readonly tone?: "dark" | "light" | undefined;
} | undefined) => Readonly<Record<"footer" | "root" | "title", Readonly<Record<string, string | number>>>>) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly ("dark" | "light")[];
    };
    readonly defaultVariants: {
        readonly tone: "dark" | "light";
    };
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
                readonly title: {
                    readonly color: "white";
                };
            } | {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    }, "tone", Readonly<Record<string, string | number>>, readonly ("footer" | "root" | "title")[]> | undefined;
};
declare const link: ((props: {
    readonly tone: "muted" | "primary";
}) => string) & {
    readonly variantKeys: readonly "tone"[];
    readonly variantOptions: {
        readonly tone: readonly ("muted" | "primary")[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/recipe").RecipeComposition<{
        readonly tone: {
            readonly muted: "text-gray-500";
            readonly primary: "text-blue-600";
        };
    }, never, string, undefined> | undefined;
};
export { card, classRecipe, dialog, heading, link, slotStyleRecipe, styleRecipe, text, };
export type { Style };
