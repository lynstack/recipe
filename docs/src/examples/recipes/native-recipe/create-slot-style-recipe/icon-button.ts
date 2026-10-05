import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const iconButton = createSlotStyleRecipe({
  slots: ["root", "icon"],
  variants: { size: { md: { root: { height: 40 } } } },
});
