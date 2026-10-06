import { cva } from "@lynstack/class-recipe";

export const toggle = cva({
  base: "rounded",
  variants: {
    pressed: { true: "bg-gray-900", false: "bg-white" },
    level: { 1: "text-sm", 2: "text-base" },
  },
  compoundVariants: [
    { variants: { pressed: true }, className: "shadow-inner" },
    { variants: { level: 2 }, className: "font-medium" },
  ],
  defaultVariants: { pressed: false, level: 1 },
});
