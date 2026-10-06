import { tv } from "tailwind-variants";

export const field = tv({
  slots: { base: "flex flex-col", label: "text-gray-700" },
  variants: {
    size: { sm: { label: "text-xs" }, md: {} },
  },
  defaultVariants: { size: "md" },
});

export const dateField = tv({
  extend: field,
  slots: { base: "gap-1", calendar: "rounded-lg border" },
});
