import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
  variants: {
    tone: {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600",
      neutral:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    },
    state: {
      idle: "cursor-pointer",
      loading: "cursor-wait opacity-75",
      disabled: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: { tone: "primary", size: "md", state: "idle" },
});
