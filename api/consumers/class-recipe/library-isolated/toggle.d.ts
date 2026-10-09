import type { RecipeOf, SlotRecipeOf } from "@lynstack/class-recipe";
import { look, pill } from "./look.js";
declare const badgeConfig: {
    readonly variants: {
        readonly tone: {
            readonly danger: "bg-red-100";
            readonly neutral: "bg-gray-100";
        };
    };
};
declare const toggleConfig: {
    readonly defaultVariants: {
        readonly tone: "neutral";
    };
    readonly slots: readonly ["icon"];
    readonly variants: {
        readonly pressed: {
            readonly true: {
                readonly icon: "opacity-100";
                readonly root: "ring";
            };
        };
        readonly tone: {
            readonly danger: {
                readonly icon: "text-red-700";
            };
            readonly neutral: {
                readonly icon: "text-gray-700";
            };
        };
    };
};
declare const badge: RecipeOf<typeof badgeConfig, readonly [typeof pill]>;
declare const toggle: SlotRecipeOf<typeof toggleConfig, readonly [typeof look]>;
export { badge, toggle };
