import type { VariantsOf } from "@lynstack/recipe";

import { dialog, heading } from "./heading.js";
import type { Style } from "./kind.js";
import { styleRecipe } from "./kind.js";

type HeadingVariants = VariantsOf<typeof heading>;

const headingVariants: HeadingVariants = { size: "xl", weight: "regular" };
const headingStyle: Style = heading(headingVariants);
const headingDefaults: {
  readonly size: "md" | "sm" | "xl";
  readonly weight: "bold" | "regular";
} = heading.defaultVariants;
const dialogStyles: Readonly<Record<"footer" | "root" | "title", Style>> =
  dialog({ tone: "dark" });

const title = styleRecipe({
  composes: [heading],
  variants: { align: { center: { textAlign: "center" } } },
});
const titleStyle: Style = title({ align: "center" });

export {
  dialogStyles,
  headingDefaults,
  headingStyle,
  headingVariants,
  titleStyle,
};
export type { HeadingVariants };
export { card, text } from "./text.js";
export { dialog, heading } from "./heading.js";
export { slotStyleRecipe, styleRecipe } from "./kind.js";
export type { Style } from "./kind.js";
