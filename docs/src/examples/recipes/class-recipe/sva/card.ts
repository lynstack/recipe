import { sva } from "@lynstack/class-recipe";

export const card = sva({
  slots: ["root", "header", "body"],
  base: {
    root: "rounded-lg border",
    header: "font-semibold",
    body: "text-gray-600",
  },
  variants: {
    size: {
      sm: { root: "p-3", header: "text-sm" },
      md: { root: "p-5", header: "text-base" },
    },
    elevated: {
      true: { root: "shadow-md" },
    },
  },
  compoundVariants: [
    {
      variants: { size: "md", elevated: true },
      classNames: { header: "border-b" },
    },
  ],
  defaultVariants: { size: "md" },
});
