import { tv } from "tailwind-variants";

export const card = tv({
  slots: { base: "rounded-lg", title: "font-semibold" },
  variants: {
    size: {
      sm: { base: "p-2", title: "text-sm" },
      md: { base: "p-4", title: "text-lg" },
    },
  },
  compoundSlots: [{ slots: ["base", "title"], size: "sm", class: "gap-1" }],
  defaultVariants: { size: "md" },
});

const { base, title } = card({ size: "sm" });

export const rootClass = base();
export const titleClass = title({ class: "truncate" });
