import type { KindRecipeOf, KindSlotRecipeOf } from "@lynstack/recipe";

import { slotStyleRecipe, styleRecipe } from "./kind.js";
import type { Style } from "./kind.js";

const textConfig = {
  base: { color: "black" },
  defaultVariants: { size: "md" },
  variants: { size: { md: { fontSize: 16 }, sm: { fontSize: 12 } } },
} as const;

const cardConfig = {
  base: { root: { padding: 16 } },
  defaultVariants: { tone: "light" },
  slots: ["root", "title"],
  variants: {
    tone: {
      dark: { root: { backgroundColor: "black" } },
      light: { root: { backgroundColor: "white" } },
    },
  },
} as const;

const text: KindRecipeOf<Style, Style, typeof textConfig> =
  styleRecipe(textConfig);
const card: KindSlotRecipeOf<Style, Style, typeof cardConfig> =
  slotStyleRecipe(cardConfig);

export { card, text };
