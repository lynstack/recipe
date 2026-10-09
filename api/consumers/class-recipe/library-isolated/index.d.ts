import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
import { toggle } from "./toggle.js";
type ToggleProps = PropsOf<typeof toggle>;
type ToggleVariants = VariantsOf<typeof toggle>;
declare const toggleVariants: ToggleVariants;
declare const toggleClassNames: Readonly<Record<"icon" | "root", string>>;
declare const toggleDefaults: {
    readonly size: "md" | "sm";
    readonly tone: "danger" | "neutral";
};
declare const badgeClassName: string;
declare const iconToggleClassNames: Readonly<Record<"glyph" | "icon" | "root", string>>;
export { badgeClassName, iconToggleClassNames, toggleClassNames, toggleDefaults, toggleVariants, };
export type { ToggleProps, ToggleVariants };
export { badge, toggle } from "./toggle.js";
export { chip, configured, field, tag } from "./configured.js";
export { label, select } from "./configured-use.js";
