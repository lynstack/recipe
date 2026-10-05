import { styleRecipe } from "../style-recipe.ts";

export const field = styleRecipe({
  variants: {
    invalid: { true: { borderColor: "red" } },
  },
});
