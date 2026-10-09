import type { Style, VariantsOf } from "recipe-library";
import { text } from "recipe-library";
type TextVariants = VariantsOf<typeof text>;
declare const textVariants: TextVariants;
declare const textStyle: Style;
declare const textKeys: readonly ("size" | "truncated")[];
declare const textOptions: {
    readonly size: readonly ("lg" | "md" | "sm")[];
    readonly truncated: readonly ("false" | "true")[];
};
declare const textDefaults: {
    readonly size: "lg" | "md" | "sm";
};
declare const headingStyle: Style;
declare const cardStyles: Readonly<Record<"root" | "title", Style>>;
declare const dialogStyles: Readonly<Record<"footer" | "root" | "title", Style>>;
declare const linkClassName: string;
declare const isolatedHeadingStyle: Style;
declare const isolatedDialogStyles: Readonly<Record<"footer" | "root" | "title", Style>>;
export { cardStyles, dialogStyles, headingStyle, isolatedDialogStyles, isolatedHeadingStyle, linkClassName, textDefaults, textKeys, textOptions, textStyle, textVariants, };
export type { TextVariants };
