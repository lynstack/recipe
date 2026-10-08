import type { PropsOf, RecipeOf } from "@lynstack/class-recipe";
import { chip, tag } from "./configured.js";
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
declare const chipClassName: string;
declare const labelClassName: string;
declare const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>>;
export { chipClassName, label, labelClassName, selectClassNames };
export type { ChipProps };
