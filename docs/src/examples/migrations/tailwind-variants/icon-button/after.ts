import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "rounded-md font-medium",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});

export const iconButton = cva({
  composes: [button],
  base: "aspect-square",
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
  },
  defaultVariants: { tone: "neutral" },
});
