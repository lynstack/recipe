import { sva } from "@lynstack/class-recipe";

export const card = sva({
  slots: ["root", "header", "title", "description", "body", "footer"],
  base: {
    root: "flex flex-col rounded-xl border border-gray-200 bg-white",
    header: "flex flex-col gap-1",
    title: "font-semibold text-gray-900",
    description: "text-sm text-gray-600",
    body: "text-sm text-gray-700",
    footer: "flex items-center justify-end gap-2",
  },
  variants: {
    size: {
      sm: {
        root: "gap-3 p-4",
        title: "text-base",
      },
      md: {
        root: "gap-4 p-6",
        title: "text-lg",
      },
    },
    elevated: {
      true: { root: "shadow-md" },
      false: { root: "shadow-none" },
    },
  },
  defaultVariants: { size: "md" },
});
