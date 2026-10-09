import type { PropsOf, VariantsOf } from "class-recipe-library";
import { button, card } from "class-recipe-library";
type ButtonProps = PropsOf<typeof button>;
type CardVariants = VariantsOf<typeof card>;
declare const buttonProps: ButtonProps;
declare const buttonClassName: string;
declare const buttonKeys: readonly ("disabled" | "size" | "tone")[];
declare const buttonOptions: {
    readonly size: readonly ("lg" | "md" | "sm")[];
};
declare const buttonDefaults: {
    readonly size: "lg" | "md" | "sm";
    readonly tone: "danger" | "neutral";
};
declare const iconButtonClassName: string;
declare const badgeClassName: string;
declare const cardVariants: CardVariants;
declare const cardClassNames: Readonly<Record<"body" | "root" | "title", string>>;
declare const dialogClassNames: Readonly<Record<"body" | "footer" | "root" | "title", string>>;
declare const chipClassName: string;
declare const labelClassName: string;
declare const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>>;
declare const toggleClassNames: Readonly<Record<"icon" | "root", string>>;
export { badgeClassName, buttonClassName, buttonDefaults, buttonKeys, buttonOptions, buttonProps, cardClassNames, cardVariants, chipClassName, dialogClassNames, iconButtonClassName, labelClassName, selectClassNames, toggleClassNames, };
export type { ButtonProps, CardVariants };
