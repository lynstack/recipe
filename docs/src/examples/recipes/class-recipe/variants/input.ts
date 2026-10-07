import { cva } from "@lynstack/class-recipe";

export const input = cva({
  base: "rounded-md border",
  variants: {
    invalid: { true: "border-red-600", false: "border-gray-300" },
    disabled: { true: "opacity-50" },
  },
});
