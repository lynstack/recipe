import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
import { sva } from "@lynstack/class-recipe";

import { badge, toggle } from "./toggle.js";

type ToggleProps = PropsOf<typeof toggle>;
type ToggleVariants = VariantsOf<typeof toggle>;

const toggleVariants: ToggleVariants = { pressed: true, size: "sm" };
const toggleClassNames: Readonly<Record<"icon" | "root", string>> =
  toggle(toggleVariants);
const toggleDefaults: {
  readonly size: "md" | "sm";
  readonly tone: "danger" | "neutral";
} = toggle.defaultVariants;
const badgeClassName: string = badge({ size: "sm", tone: "danger" });

const iconToggle = sva({
  composes: [toggle],
  slots: ["glyph"],
  variants: { shape: { round: { glyph: "rounded-full" } } },
});
const iconToggleClassNames: Readonly<
  Record<"glyph" | "icon" | "root", string>
> = iconToggle({ shape: "round" });

export {
  badgeClassName,
  iconToggleClassNames,
  toggleClassNames,
  toggleDefaults,
  toggleVariants,
};
export type { ToggleProps, ToggleVariants };
export { badge, toggle } from "./toggle.js";
export { chip, configured, field, tag } from "./configured.js";
export { label, select } from "./configured-use.js";
