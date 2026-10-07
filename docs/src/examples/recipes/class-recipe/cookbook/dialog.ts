import { sva } from "@lynstack/class-recipe";

export const dialog = sva({
  slots: ["overlay", "content", "header", "title", "description", "footer"],
  base: {
    overlay: "fixed inset-0 bg-black/50",
    content:
      "fixed top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-white p-6 shadow-lg",
    header: "flex flex-col gap-1",
    title: "text-lg font-semibold text-gray-900",
    description: "text-sm text-gray-600",
    footer: "flex justify-end gap-2",
  },
  variants: {
    size: {
      sm: { content: "max-w-sm" },
      md: { content: "max-w-lg" },
      lg: { content: "max-w-2xl" },
    },
  },
  defaultVariants: { size: "md" },
});
