import { cva } from "class-variance-authority";

export const alert = cva("rounded p-4", {
  variants: {
    tone: { info: "bg-blue-50", danger: "bg-red-50" },
  },
  compoundVariants: [{ tone: undefined, class: "border" }],
  defaultVariants: { tone: "info" },
});
