import { createStyleRecipe } from "@lynstack/native-recipe";

export const avatar = createStyleRecipe({
  base: { backgroundColor: "#e5e7eb" },
  variants: {
    // No default: every call must choose a size.
    size: {
      sm: { width: 24, height: 24 },
      lg: { width: 48, height: 48 },
    },
    // A default: a call may leave the shape out.
    shape: {
      circle: { borderRadius: 999 },
      square: { borderRadius: 4 },
    },
  },
  defaultVariants: { shape: "circle" },
});
