import type { RecipeOf, SlotRecipeOf } from "@lynstack/class-recipe";
declare const pillConfig: {
    readonly base: "rounded-full";
    readonly defaultVariants: {
        readonly size: "md";
    };
    readonly variants: {
        readonly size: {
            readonly md: "h-8";
            readonly sm: "h-6";
        };
    };
};
declare const lookConfig: {
    readonly base: {
        readonly root: "border";
    };
    readonly defaultVariants: {
        readonly size: "md";
    };
    readonly slots: readonly ["root"];
    readonly variants: {
        readonly size: {
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        };
    };
};
declare const pill: RecipeOf<typeof pillConfig>;
declare const look: SlotRecipeOf<typeof lookConfig>;
export { look, pill };
