import type { ComposedSlot, NativeStyle, SlotStyles, StyleRecipe, VariantsOf } from "@lynstack/native-recipe";
declare const box: ((props: {
    readonly size?: "lg" | "md" | undefined;
    readonly tone: "danger" | "neutral";
}) => {
    readonly backgroundColor?: "#dc2626" | undefined;
    readonly borderWidth?: 2 | undefined;
    readonly height?: 40 | 48 | undefined;
}) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("lg" | "md")[];
        readonly tone: readonly ("danger" | "neutral")[];
    };
    readonly defaultVariants: {
        readonly size: "lg" | "md";
    };
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
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
    }, "size", NativeStyle, undefined> | undefined;
};
declare const button: ((props: {
    readonly size: "md";
}) => {
    readonly label: {
        readonly fontSize?: 16 | undefined;
    };
    readonly root: {};
}) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly "md"[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/native-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly label: {
                    readonly fontSize: 16;
                };
            };
        };
    }, never, NativeStyle, readonly ("label" | "root")[]> | undefined;
};
declare const boxRecipe: StyleRecipe<VariantsOf<typeof box>, NativeStyle>;
declare const iconButtonSlots: readonly ComposedSlot<readonly [typeof button], "icon">[];
declare const boxStyle: NativeStyle;
declare const buttonStyles: SlotStyles<"label" | "root">;
export { box, boxRecipe, boxStyle, buttonStyles, iconButtonSlots };
