import type { Style, VariantsOf } from "recipe-library";
import { card, dialog, heading, link, text } from "recipe-library";
import {
  dialog as isolatedDialog,
  heading as isolatedHeading,
} from "recipe-library-isolated";

type TextVariants = VariantsOf<typeof text>;

const textVariants: TextVariants = { size: "lg", truncated: true };
const textStyle: Style = text(textVariants);
const textKeys: readonly ("size" | "truncated")[] = text.variantKeys;
const textOptions: {
  readonly size: readonly ("lg" | "md" | "sm")[];
  readonly truncated: readonly ("false" | "true")[];
} = text.variantOptions;
const textDefaults: { readonly size: "lg" | "md" | "sm" } =
  text.defaultVariants;
const headingStyle: Style = heading({ level: "1", size: "sm" });
const cardStyles: Readonly<Record<"root" | "title", Style>> = card({
  tone: "dark",
});
const dialogStyles: Readonly<Record<"footer" | "root" | "title", Style>> =
  dialog({});
const linkClassName: string = link({ tone: "muted" });

const isolatedHeadingStyle: Style = isolatedHeading({ size: "xl" });
const isolatedDialogStyles: Readonly<
  Record<"footer" | "root" | "title", Style>
> = isolatedDialog({ tone: "dark" });

export {
  cardStyles,
  dialogStyles,
  headingStyle,
  isolatedDialogStyles,
  isolatedHeadingStyle,
  linkClassName,
  textDefaults,
  textKeys,
  textOptions,
  textStyle,
  textVariants,
};
export type { TextVariants };
