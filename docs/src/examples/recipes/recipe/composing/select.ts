import { createSlotRecipeKind } from "@lynstack/recipe";
import { styleKind } from "../quick-start/style-kind.ts";

const slotStyleRecipe = createSlotRecipeKind(styleKind);

const field = slotStyleRecipe({
  slots: ["root", "label"],
  base: { root: { gap: 4 }, label: { fontSize: 14 } },
  variants: {
    invalid: { true: { label: { color: "red" } } },
  },
});

export const select = slotStyleRecipe({
  composes: [field],
  slots: ["trigger"],
  base: { trigger: { height: 40 } },
  variants: {
    invalid: { true: { trigger: { borderColor: "red" } } },
  },
});
