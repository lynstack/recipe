import type { RecipeOf, Recipes, SlotRecipeOf } from "@lynstack/class-recipe";
import { look, pill } from "./look.js";
declare const configured: Recipes;
declare const chipConfig: {
    readonly base: "inline-flex px-4";
    readonly variants: {
        readonly tone: {
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        };
    };
};
declare const tagConfig: {
    readonly defaultVariants: {
        readonly tone: "neutral";
    };
    readonly variants: {
        readonly muted: {
            readonly true: "opacity-50";
        };
    };
};
declare const fieldConfig: {
    readonly slots: readonly ["label"];
    readonly variants: {
        readonly invalid: {
            readonly true: {
                readonly label: "text-red-700";
                readonly root: "border-2";
            };
        };
    };
};
declare const chip: RecipeOf<typeof chipConfig, readonly [typeof pill]>;
declare const tag: RecipeOf<typeof tagConfig, readonly [typeof chip]>;
declare const field: SlotRecipeOf<typeof fieldConfig, readonly [typeof look]>;
export { chip, configured, field, tag };
