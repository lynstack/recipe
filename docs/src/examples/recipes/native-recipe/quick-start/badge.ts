import { createStyleRecipe } from "@lynstack/native-recipe";

export const badge = createStyleRecipe({
  base: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      success: { backgroundColor: "#dcfce7" },
      danger: { backgroundColor: "#fee2e2" },
    },
    size: {
      sm: { height: 20 },
      md: { height: 24 },
    },
    outlined: {
      true: { borderColor: "#d1d5db", borderWidth: 1 },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "danger", outlined: true },
      style: { borderColor: "#dc2626" },
    },
  ],
  defaultVariants: { tone: "neutral", size: "md" },
});
