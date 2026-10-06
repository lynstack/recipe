import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "px-4",
  variants: {
    isInGroup: { true: "border-s-0" },
    isRounded: { true: "" },
  },
  compoundVariants: [
    { variants: { isInGroup: true, isRounded: true }, className: "shadow-sm" },
  ],
});
