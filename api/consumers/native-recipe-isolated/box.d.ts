import type { SlotStyleRecipeOf, StyleRecipeOf } from "@lynstack/native-recipe";
declare const boxConfig: {
    readonly base: {
        readonly borderRadius: 8;
    };
    readonly compoundVariants: readonly [{
        readonly style: {
            readonly borderWidth: 1;
        };
        readonly variants: {
            readonly size: "sm";
            readonly tone: "danger";
        };
    }];
    readonly defaultVariants: {
        readonly size: "md";
    };
    readonly variants: {
        readonly size: {
            readonly md: {
                readonly padding: 8;
            };
            readonly sm: {
                readonly padding: 4;
            };
        };
        readonly tone: {
            readonly danger: {
                readonly opacity: 1;
            };
            readonly neutral: {
                readonly opacity: 0.8;
            };
        };
    };
};
declare const fieldConfig: {
    readonly base: {
        readonly root: {
            readonly gap: 4;
        };
    };
    readonly slots: readonly ["root", "label"];
    readonly variants: {
        readonly size: {
            readonly md: {};
            readonly sm: {
                readonly label: {
                    readonly fontSize: 12;
                };
            };
        };
    };
};
declare const box: StyleRecipeOf<typeof boxConfig>;
declare const field: SlotStyleRecipeOf<typeof fieldConfig>;
export { box, field };
