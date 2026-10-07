import { sva } from "@lynstack/class-recipe";

export const field = sva({
  slots: ["root", "label"],
  base: { root: "flex flex-col", label: "text-gray-700" },
  variants: {
    size: { sm: { label: "text-xs" }, md: {} },
  },
  defaultVariants: { size: "md" },
});

export const dateField = sva({
  composes: [field],
  slots: ["calendar"],
  base: { root: "gap-1", calendar: "rounded-lg border" },
  variants: {},
});
