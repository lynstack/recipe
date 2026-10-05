import { createStyleRecipe } from "@lynstack/native-recipe";

export const stack = createStyleRecipe({
  variants: {
    gap: { sm: { gap: 8 }, md: { gap: 16 } },
    direction: {
      row: { flexDirection: "row" },
      column: { flexDirection: "column" },
    },
  },
  defaultVariants: { gap: "md", direction: "column" },
});
