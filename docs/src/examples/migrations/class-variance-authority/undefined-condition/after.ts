import { cva } from "@lynstack/class-recipe";

export const alert = cva({
  base: "rounded p-4",
  variants: {
    tone: { info: "bg-blue-50", danger: "bg-red-50" },
  },
  compoundVariants: [{ variants: { tone: undefined }, className: "border" }],
  defaultVariants: { tone: "info" },
});
