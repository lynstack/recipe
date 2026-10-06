import { cva } from "@lynstack/class-recipe";

export const stack = cva({
  base: "flex",
  variants: {
    gap: { false: "gap-4", tight: "gap-1" },
  },
  defaultVariants: { gap: "false" },
});
