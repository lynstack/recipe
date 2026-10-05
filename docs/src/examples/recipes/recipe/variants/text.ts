import { styleRecipe } from "../style-recipe.ts";

export const text = styleRecipe({
  variants: {
    size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
    tone: { neutral: { color: "gray" }, danger: { color: "red" } },
  },
  defaultVariants: { size: "sm" },
});
