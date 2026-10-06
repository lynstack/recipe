import { cva } from "@lynstack/class-recipe";

export const badge = cva({
  base: "rounded px-2",
  variants: {
    tone: { none: "", info: "bg-blue-100", danger: "bg-red-100" },
  },
  defaultVariants: { tone: "none" },
});
