import { tv } from "tailwind-variants";

export const button = tv({
  base: "rounded",
  variants: {
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});
