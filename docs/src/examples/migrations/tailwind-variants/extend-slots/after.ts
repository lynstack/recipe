import { sva } from "@lynstack/class-recipe";

const fieldConfig = {
  slots: ["root", "label"],
  base: { root: "flex flex-col", label: "text-gray-700" },
  variants: {
    size: { sm: { label: "text-xs" }, md: {} },
  },
  defaultVariants: { size: "md" },
} as const;

export const field = sva(fieldConfig);

export const dateField = sva({
  ...fieldConfig,
  slots: [...fieldConfig.slots, "calendar"],
  base: {
    ...fieldConfig.base,
    root: `${fieldConfig.base.root} gap-1`,
    calendar: "rounded-lg border",
  },
});
