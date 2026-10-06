import { tv } from "tailwind-variants";

export const button = tv({
  base: "rounded-md font-medium",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
    width: { auto: "w-auto", full: "w-full" },
  },
  defaultVariants: { size: "md", width: "auto" },
});

export const iconButton = tv({
  extend: button,
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "text-xs", lg: "h-12 px-6" },
  },
  defaultVariants: { tone: "neutral" },
});
