import { cva } from "class-variance-authority";

export const button = cva("rounded-md font-medium", {
  variants: {
    intent: { primary: "bg-blue-600 text-white", secondary: "bg-gray-100" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  compoundVariants: [{ intent: "primary", size: "md", class: "shadow-sm" }],
  defaultVariants: { intent: "primary", size: "md" },
});
