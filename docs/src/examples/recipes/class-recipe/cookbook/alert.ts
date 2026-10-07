import { sva } from "@lynstack/class-recipe";

export const alert = sva({
  slots: ["root", "icon", "title", "description"],
  base: {
    root: "flex gap-3 rounded-lg border p-4",
    icon: "size-5 shrink-0",
    title: "font-semibold",
    description: "text-sm",
  },
  variants: {
    tone: {
      info: {
        root: "border-blue-200 bg-blue-50",
        icon: "text-blue-600",
        title: "text-blue-900",
        description: "text-blue-800",
      },
      success: {
        root: "border-green-200 bg-green-50",
        icon: "text-green-600",
        title: "text-green-900",
        description: "text-green-800",
      },
      danger: {
        root: "border-red-200 bg-red-50",
        icon: "text-red-600",
        title: "text-red-900",
        description: "text-red-800",
      },
    },
  },
  defaultVariants: { tone: "info" },
});
