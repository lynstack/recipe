import { cva } from "@lynstack/class-recipe";

const buttonConfig = {
  base: "rounded-md font-medium",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
    width: { auto: "w-auto", full: "w-full" },
  },
  defaultVariants: { size: "md", width: "auto" },
} as const;

export const button = cva(buttonConfig);

const { size, ...buttonVariants } = buttonConfig.variants;

export const iconButton = cva({
  ...buttonConfig,
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { ...size, sm: `${size.sm} text-xs`, lg: "h-12 px-6" },
    ...buttonVariants,
  },
  defaultVariants: { ...buttonConfig.defaultVariants, tone: "neutral" },
});
