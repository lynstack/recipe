import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    tone: {
      primary: "bg-blue-600 text-white",
      neutral: "bg-gray-100 text-gray-900",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
    },
    loading: {
      true: "cursor-wait opacity-75",
    },
  },
  compoundVariants: [
    {
      variants: { tone: "primary", loading: false },
      className: "hover:bg-blue-700",
    },
  ],
  defaultVariants: { tone: "primary", size: "md" },
});
