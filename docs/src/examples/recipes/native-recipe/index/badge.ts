import { createStyleRecipe } from "@lynstack/native-recipe";

export const badge = createStyleRecipe({
  base: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#fee2e2" },
    },
    size: { sm: { height: 20 }, md: { height: 24 } },
  },
  defaultVariants: { size: "md" },
});
