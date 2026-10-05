import { cva } from "@lynstack/class-recipe";

export const stack = cva({
  variants: {
    gap: { sm: "gap-2", md: "gap-4" },
    direction: { row: "flex-row", column: "flex-col" },
  },
  defaultVariants: { gap: "md", direction: "column" },
});
