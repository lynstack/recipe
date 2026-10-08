import type { SlotStyleRecipeOf, StyleRecipeOf } from "@lynstack/native-recipe";
import { box, field } from "./box";
declare const cardConfig: {
    readonly variants: {
        readonly raised: {
            readonly true: {
                readonly elevation: 2;
            };
        };
    };
};
declare const searchConfig: {
    readonly slots: readonly ["icon"];
    readonly variants: {
        readonly open: {
            readonly true: {
                readonly icon: {
                    readonly width: 12;
                };
                readonly root: {
                    readonly gap: 8;
                };
            };
        };
    };
};
declare const card: StyleRecipeOf<typeof cardConfig, readonly [typeof box]>;
declare const search: SlotStyleRecipeOf<typeof searchConfig, readonly [typeof field]>;
export { card, search };
