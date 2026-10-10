import type { ComposedSlot, NativeStyle, SlotStyleRecipe, SlotStyles, StyleRecipe, VariantsOf } from "@lynstack/native-recipe";
declare const box: StyleRecipe<{
    readonly size?: "lg" | "md" | undefined;
    readonly tone: "danger" | "neutral";
}, {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 40 | 48 | undefined;
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly size: {
        readonly lg: {
            readonly height: 48;
        };
        readonly md: {
            readonly height: 40;
        };
    };
    readonly tone: {
        readonly danger: {
            readonly backgroundColor: "#dc2626";
        };
        readonly neutral: {};
    };
}, "size", NativeStyle, undefined>>;
declare const button: SlotStyleRecipe<{
    readonly size: "md";
}, {
    readonly label: {
        readonly fontSize?: 16 | undefined;
    };
    readonly root: {};
}, import("@lynstack/native-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly label: {
                readonly fontSize: 16;
            };
        };
    };
}, never, NativeStyle, readonly ("label" | "root")[]>>;
declare const boxRecipe: StyleRecipe<VariantsOf<typeof box>, NativeStyle>;
declare const iconButtonSlots: readonly ComposedSlot<readonly [typeof button], "icon">[];
declare const boxStyle: NativeStyle;
declare const anyStyle: NativeStyle;
declare const buttonStyles: SlotStyles<"label" | "root">;
export { anyStyle, box, boxRecipe, boxStyle, buttonStyles, iconButtonSlots };
