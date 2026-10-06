import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "rounded-md font-medium",
  variants: {
    intent: { primary: "bg-blue-600 text-white", secondary: "bg-gray-100" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  compoundVariants: [
    { variants: { intent: "primary", size: "md" }, className: "shadow-sm" },
  ],
  defaultVariants: { intent: "primary", size: "md" },
});
