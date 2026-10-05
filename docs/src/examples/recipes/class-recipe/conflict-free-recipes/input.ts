import { cva } from "@lynstack/class-recipe";

// Conflict-free: only the variant sets it.
export const input = cva({
  base: "rounded-md border",
  variants: {
    invalid: { true: "border-red-600", false: "border-gray-300" },
  },
});
