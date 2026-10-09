import type { KindRecipeOf, KindSlotRecipeOf } from "@lynstack/recipe";
import { card, text } from "./text.js";
import type { Style } from "./kind.js";
declare const headingConfig: {
    readonly defaultVariants: {
        readonly weight: "bold";
    };
    readonly variants: {
        readonly size: {
            readonly xl: {
                readonly fontSize: 32;
            };
        };
        readonly weight: {
            readonly bold: {
                readonly fontWeight: 700;
            };
            readonly regular: {
                readonly fontWeight: 400;
            };
        };
    };
};
declare const dialogConfig: {
    readonly slots: readonly ["footer"];
    readonly variants: {
        readonly tone: {
            readonly dark: {
                readonly footer: {
                    readonly borderColor: "white";
                };
            };
        };
    };
};
declare const heading: KindRecipeOf<Style, Style, typeof headingConfig, readonly [typeof text]>;
declare const dialog: KindSlotRecipeOf<Style, Style, typeof dialogConfig, readonly [typeof card]>;
export { dialog, heading };
