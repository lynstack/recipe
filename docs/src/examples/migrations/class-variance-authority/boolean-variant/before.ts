import { cva } from "class-variance-authority";

export const input = cva("rounded border", {
  variants: {
    disabled: { true: "opacity-50", false: "cursor-text" },
  },
  compoundVariants: [{ disabled: false, class: "bg-white" }],
});
