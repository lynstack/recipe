import { cva } from "@lynstack/class-recipe";

// Conflicting: base and the variant both set the border color.
export const conflicting = cva({
  base: "rounded-md border border-gray-300",
  variants: { invalid: { true: "border-red-600" } },
});
