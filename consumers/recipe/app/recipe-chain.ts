import { createRecipeKind } from "@lynstack/recipe";

const classKind = createRecipeKind({
  initial: (base: string | undefined): string => base ?? "",
  reduce: (classes: string, value: string): string => `${classes} ${value}`,
});

// Each level composes the one before, as a component library's recipes do.
const level0 = classKind({
  base: "inline-flex",
  variants: { size: { md: "h-8", sm: "h-6" } },
});
const level1 = classKind({
  composes: [level0],
  compoundVariants: [
    { value: "font-bold", variants: { size: "md", tone: "danger" } },
  ],
  variants: { tone: { danger: "text-red-700" } },
});
const level2 = classKind({
  composes: [level1],
  variants: { weight: { bold: "font-bold" } },
});
const level3 = classKind({
  composes: [level2],
  defaultVariants: { shape: "round" },
  variants: { shape: { round: "rounded-full", square: "rounded-none" } },
});
const level4 = classKind({
  composes: [level3],
  variants: { muted: { true: "opacity-50" } },
});

export { level0, level1, level2, level3, level4 };
