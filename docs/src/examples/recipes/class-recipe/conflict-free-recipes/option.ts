import { cva } from "@lynstack/class-recipe";

// Conflict-free: the recipe declares the compact padding as an option.
export const button = cva({
  base: "inline-flex items-center rounded-md",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4", compact: "h-10 px-2" },
  },
  defaultVariants: { size: "md" },
});
