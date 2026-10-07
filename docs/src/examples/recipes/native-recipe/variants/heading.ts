import { createStyleRecipe } from "@lynstack/native-recipe";

export const heading = createStyleRecipe({
  variants: { level: { 1: { fontSize: 32 }, 2: { fontSize: 24 } } },
});
