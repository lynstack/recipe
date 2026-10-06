import { cva } from "class-variance-authority";

export const button = cva("rounded", {
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});
