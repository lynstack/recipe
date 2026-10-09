import { cva } from "@lynstack/class-recipe";

// Each level composes the one before, as a component library's recipes do.
const level0 = cva({
  base: "inline-flex",
  variants: { size: { md: "h-8", sm: "h-6" } },
});
const level1 = cva({
  composes: [level0],
  compoundVariants: [
    { className: "font-bold", variants: { size: "md", tone: "danger" } },
  ],
  variants: { tone: { danger: "text-red-700" } },
});
const level2 = cva({
  composes: [level1],
  variants: { weight: { bold: "font-bold" } },
});
const level3 = cva({
  composes: [level2],
  defaultVariants: { shape: "round" },
  variants: { shape: { round: "rounded-full", square: "rounded-none" } },
});
const level4 = cva({
  composes: [level3],
  variants: { muted: { true: "opacity-50" } },
});

export { level0, level1, level2, level3, level4 };
