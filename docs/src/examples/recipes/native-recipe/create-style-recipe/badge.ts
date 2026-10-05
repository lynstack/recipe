import { createStyleRecipe } from "@lynstack/native-recipe";

export const badge = createStyleRecipe({
  // Applied whatever the variants.
  base: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8 },
  // For each variant, the style of each option.
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      success: { backgroundColor: "#dcfce7" },
      danger: { backgroundColor: "#fee2e2" },
    },
    outlined: {
      true: { borderColor: "#d1d5db", borderWidth: 1 },
    },
  },
});
