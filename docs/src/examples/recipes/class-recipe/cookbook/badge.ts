import { cva } from "@lynstack/class-recipe";

export const badge = cva({
  base: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  variants: {
    tone: {
      neutral: "",
      success: "",
      danger: "",
    },
    outlined: { true: "ring-1 ring-inset", false: "" },
  },
  compoundVariants: [
    {
      variants: { tone: "neutral", outlined: false },
      className: "bg-gray-100 text-gray-700",
    },
    {
      variants: { tone: "success", outlined: false },
      className: "bg-green-100 text-green-800",
    },
    {
      variants: { tone: "danger", outlined: false },
      className: "bg-red-100 text-red-800",
    },
    {
      variants: { tone: "neutral", outlined: true },
      className: "text-gray-700 ring-gray-300",
    },
    {
      variants: { tone: "success", outlined: true },
      className: "text-green-700 ring-green-600",
    },
    {
      variants: { tone: "danger", outlined: true },
      className: "text-red-700 ring-red-600",
    },
  ],
  defaultVariants: { tone: "neutral" },
});
