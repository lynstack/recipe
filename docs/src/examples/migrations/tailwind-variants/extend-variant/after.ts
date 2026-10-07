import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "rounded-md font-medium",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
    width: { auto: "w-auto", full: "w-full" },
  },
  defaultVariants: { size: "md", width: "auto" },
});

export const iconButton = cva({
  composes: [button],
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "text-xs", lg: "h-12 px-6" },
  },
  defaultVariants: { tone: "neutral" },
});
