import type { PropsOf, RecipeOf, SlotRecipeOf } from "@lynstack/class-recipe";
import { chip, field, tag } from "./configured.js";
type ChipProps = PropsOf<typeof chip>;
declare const labelConfig: {
    readonly base: "text-sm";
    readonly variants: {
        readonly tone: {
            readonly danger: "text-red-700";
        };
    };
};
declare const label: RecipeOf<typeof labelConfig, readonly [typeof tag]>;
declare const selectConfig: {
    readonly slots: readonly ["trigger"];
    readonly variants: {
        readonly open: {
            readonly true: {
                readonly trigger: "ring";
            };
        };
    };
};
declare const select: SlotRecipeOf<typeof selectConfig, readonly [typeof field]>;
declare const chipClassName: string;
declare const labelClassName: string;
declare const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>>;
export { chipClassName, label, labelClassName, select, selectClassNames };
export type { ChipProps };
