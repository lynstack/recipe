import { tv } from "tailwind-variants";

export const alert = tv({
  base: "rounded p-4",
  variants: {
    tone: { info: "bg-blue-50", danger: "bg-red-50" },
  },
  compoundVariants: [
    // @ts-expect-error -- a condition on undefined, from JavaScript
    { tone: undefined, class: "border" },
  ],
  defaultVariants: { tone: "info" },
});
