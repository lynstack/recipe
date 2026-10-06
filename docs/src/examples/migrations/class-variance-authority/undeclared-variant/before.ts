import { cva } from "class-variance-authority";

export const button = cva("px-4", {
  variants: {
    isInGroup: { true: "border-s-0" },
  },
  compoundVariants: [
    // @ts-expect-error -- a condition on a prop that is not a variant, from JavaScript
    { isInGroup: true, isRounded: true, class: "shadow-sm" },
  ],
});
