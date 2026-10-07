import { styleRecipe } from "../style-recipe.ts";

const control = styleRecipe({
  base: { borderRadius: 6 },
  variants: { size: { sm: { height: 32 }, md: { height: 40 } } },
  defaultVariants: { size: "md" },
});

export const button = styleRecipe({
  composes: [control],
  base: { fontWeight: 500 },
  variants: { size: { sm: { paddingInline: 12 }, md: { paddingInline: 16 } } },
});
