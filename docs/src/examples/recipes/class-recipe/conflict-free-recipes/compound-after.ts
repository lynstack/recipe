import { cva } from "@lynstack/class-recipe";

// Conflict-free: only the compound variants set the padding and the width.
export const button = cva({
  base: "inline-flex items-center justify-center rounded-md",
  variants: {
    size: { sm: "h-8 text-sm", md: "h-10 text-base" },
    iconOnly: { true: "", false: "" },
  },
  compoundVariants: [
    { variants: { size: "sm", iconOnly: false }, className: "px-3" },
    { variants: { size: "sm", iconOnly: true }, className: "w-8" },
    { variants: { size: "md", iconOnly: false }, className: "px-4" },
    { variants: { size: "md", iconOnly: true }, className: "w-10" },
  ],
  defaultVariants: { size: "md" },
});
