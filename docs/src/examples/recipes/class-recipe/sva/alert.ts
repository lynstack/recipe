import { sva } from "@lynstack/class-recipe";

export const alert = sva({
  slots: ["root", "title"],
  base: { root: "rounded-md p-4", title: "font-semibold" },
  variants: {
    tone: {
      info: { root: "bg-blue-50", title: "text-blue-900" },
      danger: { root: "bg-red-50", title: "text-red-900" },
    },
    size: { sm: { root: "text-sm" }, md: { root: "text-base" } },
  },
  defaultVariants: { size: "md" },
});
