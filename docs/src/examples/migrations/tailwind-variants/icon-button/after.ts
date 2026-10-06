import { cva } from "@lynstack/class-recipe";

const buttonConfig = {
  base: "rounded-md font-medium",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
} as const;

export const button = cva(buttonConfig);

export const iconButton = cva({
  ...buttonConfig,
  base: `${buttonConfig.base} aspect-square`,
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    ...buttonConfig.variants,
  },
  defaultVariants: { ...buttonConfig.defaultVariants, tone: "neutral" },
});
