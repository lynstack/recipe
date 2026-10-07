import { styleRecipe } from "../../../recipes/recipe/style-recipe.ts";

const text = styleRecipe({
  variants: { size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } } },
  defaultVariants: { size: "sm" },
});

export const same = text() === text({ size: "sm" });
