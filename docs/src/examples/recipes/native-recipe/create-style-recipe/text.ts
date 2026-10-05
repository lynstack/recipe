import { createStyleRecipe } from "@lynstack/native-recipe";

export const text = createStyleRecipe({
  base: { color: "#111827", fontSize: 16 },
  variants: {
    size: { sm: { fontSize: 14 }, lg: { fontSize: 20 } },
    muted: { true: { color: "#6b7280" } },
  },
});
