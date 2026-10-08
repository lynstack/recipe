import type { ThemedRecipeCreators, ThemedSlotStyleRecipeOf } from "@lynstack/native-recipe";
interface Theme {
    readonly gap: number;
}
declare const themed: ThemedRecipeCreators<Theme>;
declare const config0: (theme: Theme) => {
    readonly slots: readonly ["root"];
    readonly variants: {
        readonly size: {
            readonly md: {
                readonly root: {
                    readonly gap: number;
                };
            };
        };
    };
};
declare const config1: (theme: Theme) => {
    readonly slots: readonly ["icon"];
    readonly variants: {
        readonly tone: {
            readonly danger: {
                readonly icon: {
                    readonly gap: number;
                };
            };
        };
    };
};
declare const config2: (theme: Theme) => {
    readonly slots: readonly ["label"];
    readonly variants: {
        readonly weight: {
            readonly bold: {
                readonly label: {
                    readonly gap: number;
                };
            };
        };
    };
};
declare const config3: (theme: Theme) => {
    readonly slots: readonly ["badge"];
    readonly variants: {
        readonly shape: {
            readonly round: {
                readonly badge: {
                    readonly gap: number;
                };
            };
        };
    };
};
declare const config4: (theme: Theme) => {
    readonly slots: readonly ["hint"];
    readonly variants: {
        readonly muted: {
            readonly true: {
                readonly hint: {
                    readonly gap: number;
                };
            };
        };
    };
};
declare const typed0: ThemedSlotStyleRecipeOf<typeof config0>;
declare const typed1: ThemedSlotStyleRecipeOf<typeof config1, readonly [typeof typed0]>;
declare const typed2: ThemedSlotStyleRecipeOf<typeof config2, readonly [typeof typed1]>;
declare const typed3: ThemedSlotStyleRecipeOf<typeof config3, readonly [typeof typed2]>;
declare const typed4: ThemedSlotStyleRecipeOf<typeof config4, readonly [typeof typed3]>;
export { themed, typed0, typed1, typed2, typed3, typed4 };
export type { Theme };
