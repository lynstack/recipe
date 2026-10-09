import type { ThemedRecipeCreators, ThemedSlotStyleRecipeOf, ThemedStyleRecipeOf } from "@lynstack/native-recipe";
interface Theme {
    readonly gap: number;
    readonly radius: number;
}
declare const light: Theme;
declare const themed: ThemedRecipeCreators<Theme>;
declare const chipConfig: (theme: Theme) => {
    readonly base: {
        readonly borderRadius: Theme["radius"];
    };
    readonly defaultVariants: {
        readonly tone: "primary";
    };
    readonly variants: {
        readonly tone: {
            readonly muted: {
                readonly opacity: 0.6;
            };
            readonly primary: {
                readonly opacity: 1;
            };
        };
    };
};
declare const tagConfig: (theme: Theme) => {
    readonly base: {
        readonly root: {
            readonly gap: Theme["gap"];
        };
    };
    readonly slots: readonly ["root", "label"];
    readonly variants: {
        readonly size: {
            readonly sm: {
                readonly label: {
                    readonly fontSize: 12;
                };
            };
        };
    };
};
declare const chip: ThemedStyleRecipeOf<typeof chipConfig>;
declare const tag: ThemedSlotStyleRecipeOf<typeof tagConfig>;
export { chip, light, tag, themed };
export type { Theme };
