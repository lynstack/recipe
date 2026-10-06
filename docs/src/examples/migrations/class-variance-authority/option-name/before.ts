import { cva } from "class-variance-authority";

export const toggle = cva("rounded", {
  variants: {
    pressed: { true: "bg-gray-900", false: "bg-white" },
    level: { 1: "text-sm", 2: "text-base" },
  },
  compoundVariants: [
    { pressed: true, class: "shadow-inner" },
    { level: 2, class: "font-medium" },
  ],
  defaultVariants: { pressed: false, level: 1 },
});
