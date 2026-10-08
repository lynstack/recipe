import type { KindRecipeOf, KindSlotRecipeOf } from "@lynstack/recipe";
import type { Style } from "./kind.js";
declare const textConfig: {
    readonly base: {
        readonly color: "black";
    };
    readonly defaultVariants: {
        readonly size: "md";
    };
    readonly variants: {
        readonly size: {
            readonly md: {
                readonly fontSize: 16;
            };
            readonly sm: {
                readonly fontSize: 12;
            };
        };
    };
};
declare const cardConfig: {
    readonly base: {
        readonly root: {
            readonly padding: 16;
        };
    };
    readonly defaultVariants: {
        readonly tone: "light";
    };
    readonly slots: readonly ["root", "title"];
    readonly variants: {
        readonly tone: {
            readonly dark: {
                readonly root: {
                    readonly backgroundColor: "black";
                };
            };
            readonly light: {
                readonly root: {
                    readonly backgroundColor: "white";
                };
            };
        };
    };
};
declare const text: KindRecipeOf<Style, Style, typeof textConfig>;
declare const card: KindSlotRecipeOf<Style, Style, typeof cardConfig>;
export { card, text };
