import type { ThemedSlotStyleRecipeOf, ThemedStyleRecipeOf } from "@lynstack/native-recipe";
import { chip, tag } from "./theme";
import type { Theme } from "./theme";
declare const badgeConfig: (theme: Theme) => {
    readonly variants: {
        readonly size: {
            readonly sm: {
                readonly padding: Theme["gap"];
            };
        };
    };
};
declare const pillConfig: (theme: Theme) => {
    readonly slots: readonly ["icon"];
    readonly variants: {
        readonly closable: {
            readonly true: {
                readonly icon: {
                    readonly width: Theme["gap"];
                };
            };
        };
    };
};
declare const badge: ThemedStyleRecipeOf<typeof badgeConfig, readonly [typeof chip]>;
declare const pill: ThemedSlotStyleRecipeOf<typeof pillConfig, readonly [typeof tag]>;
export { badge, pill };
