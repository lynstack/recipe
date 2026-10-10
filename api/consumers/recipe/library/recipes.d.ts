type Style = Readonly<Record<string, string | number>>;
declare const styleRecipe: import("@lynstack/recipe").CreateKindRecipe<Readonly<Record<string, string | number>>, Readonly<Record<string, string | number>>>;
declare const slotStyleRecipe: import("@lynstack/recipe").CreateKindSlotRecipe<Readonly<Record<string, string | number>>, Readonly<Record<string, string | number>>>;
declare const classRecipe: import("@lynstack/recipe").CreateKindRecipe<string, string>;
declare const text: import("@lynstack/recipe").KindRecipe<{
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly truncated?: "false" | "true" | boolean | undefined;
}, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<{
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
}, "size", Readonly<Record<string, string | number>>, undefined>>;
declare const card: import("@lynstack/recipe").KindRecipe<{
    readonly tone?: "dark" | "light" | undefined;
}, Readonly<Record<"root" | "title", Readonly<Record<string, string | number>>>>, import("@lynstack/recipe").RecipeComposition<{
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
}, "tone", Readonly<Record<string, string | number>>, readonly ("root" | "title")[]>>;
declare const heading: import("@lynstack/recipe").KindRecipe<{
    readonly level: "1" | "2";
    readonly size?: "lg" | "md" | "sm" | undefined;
    readonly truncated?: "false" | "true" | boolean | undefined;
}, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<{
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
}, "size", Readonly<Record<string, string | number>>, undefined>>;
declare const dialog: import("@lynstack/recipe").KindRecipe<{
    readonly tone?: "dark" | "light" | undefined;
}, Readonly<Record<"footer" | ("root" | "title"), Readonly<Record<string, string | number>>>>, import("@lynstack/recipe").RecipeComposition<{
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
}, "tone", Readonly<Record<string, string | number>>, readonly ("footer" | ("root" | "title"))[]>>;
declare const link: import("@lynstack/recipe").KindRecipe<{
    readonly tone: "muted" | "primary";
}, string, import("@lynstack/recipe").RecipeComposition<{
    readonly tone: {
        readonly muted: "text-gray-500";
        readonly primary: "text-blue-600";
    };
}, never, string, undefined>>;
export { card, classRecipe, dialog, heading, link, slotStyleRecipe, styleRecipe, text, };
export type { Style };
