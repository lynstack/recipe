import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "rounded",
  variants: {
    size: { none: "", sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});
