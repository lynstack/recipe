import { tv } from "tailwind-variants";

export const button = tv({
  base: "px-4",
  variants: {
    isInGroup: { true: "border-s-0" },
  },
  compoundVariants: [{ isInGroup: true, isRounded: true, class: "shadow-sm" }],
});
