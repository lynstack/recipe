import { createSlotStyleRecipe } from "@lynstack/native-recipe";

import { card } from "./card.ts";

export const dialog = createSlotStyleRecipe({
  composes: [card],
  slots: ["footer"],
  base: {
    root: { maxWidth: 480 },
    footer: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  },
  variants: {
    compact: { true: { footer: { paddingTop: 8 } } },
  },
});
