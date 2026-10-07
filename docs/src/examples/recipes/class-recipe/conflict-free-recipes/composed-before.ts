import { cva } from "@lynstack/class-recipe";

const control = cva({
  base: "rounded-md border",
  variants: { size: { sm: "h-8 text-sm", md: "h-10 text-base" } },
  defaultVariants: { size: "md" },
});

// Conflicting: control sets the height, and input sets it again.
export const input = cva({
  composes: [control],
  base: "h-9 px-3",
  variants: {},
});
