import type { StyleRecipeOf } from "@lynstack/native-recipe";
import { createStyleRecipe } from "@lynstack/native-recipe";

const boxConfig = {
  base: { borderRadius: 8 },
  variants: {
    size: { sm: { padding: 4 }, md: { padding: 8 } },
  },
  defaultVariants: { size: "md" },
} as const;

export const box: StyleRecipeOf<typeof boxConfig> =
  createStyleRecipe(boxConfig);
