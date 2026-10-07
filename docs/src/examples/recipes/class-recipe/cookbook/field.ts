import { sva } from "@lynstack/class-recipe";

export const field = sva({
  slots: ["root", "label", "input", "message"],
  base: {
    root: "flex flex-col gap-1.5",
    label: "text-sm font-medium text-gray-900",
    input:
      "w-full rounded-md border bg-white outline-none focus-visible:ring-2",
    message: "text-xs",
  },
  variants: {
    size: {
      sm: { input: "h-8 px-2 text-sm" },
      md: { input: "h-10 px-3 text-base" },
    },
    invalid: {
      true: {
        input: "border-red-600 focus-visible:ring-red-200",
        message: "text-red-600",
      },
      false: {
        input: "border-gray-300 focus-visible:ring-blue-200",
        message: "text-gray-500",
      },
    },
  },
  defaultVariants: { size: "md" },
});
