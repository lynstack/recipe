import { cva } from "@lynstack/class-recipe";

// Conflicting: size sets the padding, and iconOnly sets it again.
export const button = cva({
  base: "inline-flex items-center justify-center rounded-md",
  variants: {
    size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-base" },
    iconOnly: { true: "w-10 px-0" },
  },
  defaultVariants: { size: "md" },
});
