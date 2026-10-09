import type { VariantsOf } from "@lynstack/recipe";
import { heading } from "./heading.js";
import type { Style } from "./kind.js";
type HeadingVariants = VariantsOf<typeof heading>;
declare const headingVariants: HeadingVariants;
declare const headingStyle: Style;
declare const headingDefaults: {
    readonly size: "md" | "sm" | "xl";
    readonly weight: "bold" | "regular";
};
declare const dialogStyles: Readonly<Record<"footer" | "root" | "title", Style>>;
declare const titleStyle: Style;
export { dialogStyles, headingDefaults, headingStyle, headingVariants, titleStyle, };
export type { HeadingVariants };
