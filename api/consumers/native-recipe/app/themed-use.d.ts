import type { NativeStyle, SlotStyles, VariantsOf } from "@lynstack/native-recipe";
import type { StyleProp, ViewStyle } from "react-native";
import type { Palette } from "./themed-generic";
declare const badge: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly tone?: "primary" | "surface" | undefined;
}, NativeStyle>;
declare const chip: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly size: "md";
}, {
    readonly borderRadius?: number | undefined;
    readonly height?: 40 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly borderRadius: number;
            readonly height: 40;
        };
    };
}, never, NativeStyle, undefined>>;
declare const card: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly raised?: "false" | "true" | boolean | undefined;
}, {
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
    };
    readonly title: {};
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    };
}, never, NativeStyle, readonly ("root" | "title")[]>>;
declare const lightChip: import("@lynstack/native-recipe").StyleRecipe<{
    readonly round?: "false" | "true" | boolean | undefined;
    readonly size: "md";
}, {
    readonly borderRadius?: number | undefined;
    readonly height?: 40 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly round: {
        readonly true: {
            readonly borderRadius: 999;
        };
    };
    readonly size: {
        readonly md: {
            readonly borderRadius: number;
            readonly height: 40;
        };
    };
}, never, NativeStyle, undefined>>;
declare const lightCard: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly raised?: "false" | "true" | boolean | undefined;
}, {
    readonly footer: {
        readonly paddingTop?: 8 | undefined;
    };
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
    };
    readonly title: {};
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    };
}, never, NativeStyle, readonly ("footer" | ("root" | "title"))[]>>;
declare const panel: import("@lynstack/native-recipe").SlotStyleRecipe<{
    readonly dense?: "false" | "true" | boolean | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
}, {
    readonly body: {
        readonly padding?: 4 | undefined;
    };
    readonly footer: {
        readonly paddingTop?: 8 | undefined;
    };
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
        readonly margin?: 0 | undefined;
    };
    readonly title: {};
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly dense: {
        readonly true: {
            readonly body: {
                readonly padding: 4;
            };
            readonly root: {
                readonly margin: 0;
            };
        };
    };
    readonly raised: {
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    };
}, never, NativeStyle, readonly ("body" | ("footer" | ("root" | "title")))[]>>;
declare const pill: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly size?: "sm" | undefined;
}, NativeStyle>;
declare const sheet: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly open?: "false" | "true" | boolean | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
}, {
    readonly handle: {
        readonly backgroundColor?: string | undefined;
    };
    readonly root: {
        readonly borderRadius?: number | undefined;
        readonly elevation?: 2 | undefined;
        readonly height?: 320 | undefined;
    };
    readonly title: {};
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly open: {
        readonly true: {
            readonly root: {
                readonly height: 320;
            };
        };
    };
    readonly raised: {
        readonly true: {
            readonly root: {
                readonly elevation: 2;
            };
        };
    };
}, never, NativeStyle, readonly ("handle" | ("root" | "title"))[]>>;
declare const denseChip: import("@lynstack/native-recipe").ThemedRecipe<Palette, {
    readonly dense?: "false" | "true" | boolean | undefined;
    readonly round?: "false" | "true" | boolean | undefined;
    readonly size: "md";
}, {
    readonly borderRadius?: number | undefined;
    readonly height?: 40 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly dense: {
        readonly true: {
            readonly borderRadius: number;
        };
    };
    readonly round: {
        readonly true: {
            readonly borderRadius: 999;
        };
    };
    readonly size: {
        readonly md: {
            readonly borderRadius: number;
            readonly height: 40;
        };
    };
}, never, NativeStyle, undefined>>;
declare const denseChipStyle: NativeStyle;
type LightChipVariants = VariantsOf<typeof lightChip>;
declare const badgeStyle: StyleProp<ViewStyle>;
declare const chipStyle: StyleProp<ViewStyle>;
declare const lightChipStyle: NativeStyle;
declare const lightCardStyles: SlotStyles<"footer" | "root" | "title">;
declare const panelStyles: SlotStyles<"body" | "footer" | "root" | "title">;
declare const pillStyle: StyleProp<ViewStyle>;
declare const sheetStyles: SlotStyles<"handle" | "root" | "title">;
export { badge, badgeStyle, card, chip, chipStyle, denseChip, denseChipStyle, lightChip, lightChipStyle, lightCard, lightCardStyles, panel, panelStyles, pill, pillStyle, sheet, sheetStyles, };
export type { LightChipVariants };
