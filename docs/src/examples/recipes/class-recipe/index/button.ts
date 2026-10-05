import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    tone: {
      neutral: "bg-gray-100 text-gray-900",
      danger: "bg-red-600 text-white",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
    },
  },
  defaultVariants: { size: "md" },
});
