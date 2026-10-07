import { createStyleRecipe } from "@lynstack/native-recipe";

export const button = createStyleRecipe({
  base: { borderRadius: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#dc2626" },
    },
    size: { sm: { height: 32 }, md: { height: 40 } },
    outlined: { true: { borderWidth: 1 } },
  },
  compoundVariants: [
    // When tone is danger and size is md.
    {
      variants: { tone: "danger", size: "md" },
      style: { paddingHorizontal: 20 },
    },
    // When tone is neutral and outlined is true, whatever the size.
    {
      variants: { tone: "neutral", outlined: true },
      style: { borderColor: "#d1d5db" },
    },
  ],
  defaultVariants: { size: "md" },
});
