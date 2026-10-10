import type { ComposableKindRecipe, ComposableKindSlotRecipe, ComposedVariants, CreateKindRecipe, CreateKindSlotRecipe, KindRecipe, NoUnknownSlots, VariantKey, VariantsOf } from "@lynstack/recipe";
type Style = Readonly<Record<string, string | number>>;
declare const styleRecipe: CreateKindRecipe<Style, Style>;
declare const text: KindRecipe<{
    readonly size?: "lg" | "sm" | undefined;
}, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly lg: {
            readonly fontSize: 24;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
    };
}, "size", Readonly<Record<string, string | number>>, undefined>>;
declare const slotStyleRecipe: CreateKindSlotRecipe<Style, Style>;
declare const card: KindRecipe<{
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
declare const cardStyles: Readonly<Record<"root" | "title", Style>>;
declare const cardKeys: readonly "tone"[];
declare const style: Style;
declare const textKeys: readonly "size"[];
declare const textOptions: {
    readonly size: readonly ("sm" | "lg")[];
};
declare const textDefaults: {
    readonly size: "sm" | "lg";
};
declare const recipe: KindRecipe<{
    readonly size?: "sm" | "lg";
}, Style>;
declare const variants: VariantsOf<typeof text>;
declare const textKey: VariantKey<VariantsOf<typeof text>>;
declare const emphasis: KindRecipe<{
    readonly size?: "lg" | "sm" | "xl" | undefined;
}, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly lg: {
            readonly fontSize: 24;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
        readonly xl: {
            readonly fontSize: 32;
        };
    };
}, "size", Readonly<Record<string, string | number>>, undefined>>;
declare const emphasisStyle: Style;
declare const emphasisKeys: readonly "size"[];
declare const composable: ComposableKindRecipe<Style>;
declare const sizes: keyof ComposedVariants<readonly [typeof text], {
    readonly size: {
        readonly xl: Style;
    };
}>["size"];
declare const dialog: KindRecipe<{
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
declare const dialogStyles: Readonly<Record<"root" | "title" | "footer", Style>>;
declare const composableSlots: ComposableKindSlotRecipe<Style>;
declare const knownSlots: NoUnknownSlots<{
    readonly tone: {
        readonly dark: {
            readonly root: Style;
        };
    };
}, "root">;
declare const dialogOptions: {
    readonly tone: readonly ("dark" | "light")[];
};
declare const badge: KindRecipe<{
    readonly tone?: "danger" | "neutral" | undefined;
}, Readonly<Record<string, string | number>>>;
declare const badgeStyle: Style;
declare const field: KindRecipe<{
    readonly invalid?: "false" | "true" | boolean | undefined;
}, Readonly<Record<"input" | "label", Readonly<Record<string, string | number>>>>>;
declare const fieldStyles: Readonly<Record<"input" | "label", Style>>;
declare const bigText: KindRecipe<{
    readonly size?: "lg" | "sm" | "xl" | undefined;
}, Readonly<Record<string, string | number>>, import("@lynstack/recipe").RecipeComposition<{
    readonly size: {
        readonly lg: {
            readonly fontSize: 24;
        };
        readonly sm: {
            readonly fontSize: 12;
        };
        readonly xl: {
            readonly fontSize: 32;
        };
    };
}, "size", Readonly<Record<string, string | number>>, undefined>>;
declare const bigTextStyle: Style;
declare const sheet: KindRecipe<{
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
declare const sheetStyles: Readonly<Record<"root" | "title" | "footer", Style>>;
declare const footedCard: KindRecipe<{
    readonly dense?: "false" | "true" | boolean | undefined;
    readonly tone?: "dark" | "light" | undefined;
}, Readonly<Record<"footer" | ("root" | "title"), Readonly<Record<string, string | number>>>>, import("@lynstack/recipe").RecipeComposition<{
    readonly dense: {
        readonly true: {
            readonly footer: {
                readonly borderStyle: "dashed";
            };
        };
    };
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
}, "tone", Readonly<Record<string, string | number>>, readonly ("footer" | ("root" | "title"))[]>>;
declare const footedCardStyles: Readonly<Record<"root" | "title" | "footer", Style>>;
export { bigText, bigTextStyle, badge, badgeStyle, card, composable, composableSlots, dialog, dialogOptions, dialogStyles, emphasis, emphasisKeys, footedCard, footedCardStyles, emphasisStyle, field, fieldStyles, knownSlots, sizes, cardKeys, cardStyles, recipe, sheet, sheetStyles, slotStyleRecipe, style, styleRecipe, text, textDefaults, textKey, textKeys, textOptions, variants, };
