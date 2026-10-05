import { styleRecipe } from "../style-recipe.ts";

export const heading = styleRecipe({
  variants: { level: { 1: { fontSize: 32 }, 2: { fontSize: 24 } } },
});
