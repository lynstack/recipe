import { cva } from "@lynstack/class-recipe";

export const badge = cva({
  // Applied whatever the variants.
  base: "inline-flex rounded-full px-2 text-xs",
  // For each variant, the classes of each option.
  variants: {
    tone: {
      neutral: "bg-gray-100 text-gray-700",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
    },
    outlined: {
      true: "ring-1 ring-inset ring-current",
    },
  },
});
