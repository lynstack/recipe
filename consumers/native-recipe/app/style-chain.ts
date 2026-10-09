import { createStyleRecipe } from "@lynstack/native-recipe";

// Each level composes the one before, as a component library's recipes do.
const level0 = createStyleRecipe({
  base: { flexDirection: "row" },
  variants: { size: { md: { height: 32 }, sm: { height: 24 } } },
});
const level1 = createStyleRecipe({
  composes: [level0],
  compoundVariants: [
    { style: { opacity: 0.9 }, variants: { size: "md", tone: "danger" } },
  ],
  variants: { tone: { danger: { backgroundColor: "red" } } },
});
const level2 = createStyleRecipe({
  composes: [level1],
  variants: { weight: { bold: { borderWidth: 2 } } },
});
const level3 = createStyleRecipe({
  composes: [level2],
  defaultVariants: { shape: "round" },
  variants: {
    shape: { round: { borderRadius: 999 }, square: { borderRadius: 0 } },
  },
});
const level4 = createStyleRecipe({
  composes: [level3],
  variants: { muted: { true: { opacity: 0.5 } } },
});

export { level0, level1, level2, level3, level4 };
