import { createStyleRecipe } from "@lynstack/native-recipe";

// One element: a Text with a background.
export const badge = createStyleRecipe({
  base: {
    alignSelf: "flex-start",
    borderRadius: 999,
    fontWeight: "600",
    overflow: "hidden",
  },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6", color: "#374151" },
      success: { backgroundColor: "#dcfce7", color: "#166534" },
      warning: { backgroundColor: "#fef9c3", color: "#854d0e" },
      danger: { backgroundColor: "#fee2e2", color: "#991b1b" },
    },
    size: {
      sm: { fontSize: 11, paddingHorizontal: 6, paddingVertical: 1 },
      md: { fontSize: 13, paddingHorizontal: 8, paddingVertical: 2 },
    },
  },
  defaultVariants: { tone: "neutral", size: "md" },
});
