import { cva } from "@lynstack/class-recipe";

const control = cva({
  base: "rounded-md border",
  variants: { size: { sm: "h-8 text-sm", md: "h-10 text-base" } },
  defaultVariants: { size: "md" },
});

// Conflict-free: input sets only properties that control leaves alone.
export const input = cva({
  composes: [control],
  base: "px-3",
  variants: {
    invalid: { true: "border-red-600", false: "border-gray-300" },
  },
});
