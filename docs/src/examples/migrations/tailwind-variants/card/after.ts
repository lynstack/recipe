import { sva } from "@lynstack/class-recipe";

export const card = sva({
  slots: ["root", "title"],
  base: { root: "rounded-lg", title: "font-semibold" },
  variants: {
    size: {
      sm: { root: "p-2", title: "text-sm" },
      md: { root: "p-4", title: "text-lg" },
    },
  },
  compoundVariants: [
    {
      variants: { size: "sm" },
      classNames: { root: "gap-1", title: "gap-1" },
    },
  ],
  defaultVariants: { size: "md" },
});

const { root, title } = card({ size: "sm", classNames: { title: "truncate" } });

export const rootClass = root;
export const titleClass = title;
