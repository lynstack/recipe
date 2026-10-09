import { createRecipes, cva, cx } from "@lynstack/class-recipe";

// The creators that users of the design system extend its recipes with.
const ds = createRecipes({ join: (...classNames) => cx(classNames) });

const button = ds.cva({
  base: "inline-flex items-center",
  compoundVariants: [
    { className: "font-bold", variants: { size: "lg", tone: "danger" } },
  ],
  defaultVariants: { size: "md", tone: "neutral" },
  variants: {
    disabled: { true: "opacity-50" },
    size: { lg: "h-12", md: "h-10", sm: "h-8" },
    tone: { danger: "bg-red-600", neutral: "bg-gray-100" },
  },
});

const card = ds.sva({
  base: { root: "rounded border", title: "font-medium" },
  compoundVariants: [
    {
      classNames: { title: "text-lg" },
      variants: { raised: true, size: "lg" },
    },
  ],
  defaultVariants: { size: "md" },
  slots: ["root", "title", "body"],
  variants: {
    raised: { true: { root: "shadow" } },
    size: { lg: { root: "p-6" }, md: { root: "p-4" } },
  },
});

const iconButton = ds.cva({
  composes: [button],
  variants: { shape: { round: "rounded-full", square: "rounded" } },
});

const dialog = ds.sva({
  base: { footer: "flex gap-2" },
  composes: [card],
  slots: ["footer"],
  variants: { size: { sm: { footer: "gap-1", root: "p-2" } } },
});

const badge = cva({
  base: "rounded-full px-2",
  variants: { tone: { danger: "bg-red-100", neutral: "bg-gray-100" } },
});

export { badge, button, card, dialog, ds, iconButton };
