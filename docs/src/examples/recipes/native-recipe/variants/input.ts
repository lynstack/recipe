import { createStyleRecipe } from "@lynstack/native-recipe";

export const input = createStyleRecipe({
  base: { borderRadius: 6, borderWidth: 1 },
  variants: {
    invalid: {
      true: { borderColor: "#dc2626" },
      false: { borderColor: "#d1d5db" },
    },
    disabled: { true: { opacity: 0.5 } },
  },
});
