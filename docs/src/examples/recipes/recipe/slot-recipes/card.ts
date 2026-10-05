import { createSlotRecipeKind } from "@lynstack/recipe";
import { styleKind } from "../quick-start/style-kind.ts";

const slotStyleRecipe = createSlotRecipeKind(styleKind);

export const card = slotStyleRecipe({
  slots: ["root", "title"],
  base: { root: { padding: 16 }, title: { fontSize: 18 } },
  variants: {
    tone: {
      light: { root: { backgroundColor: "white" } },
      dark: { root: { backgroundColor: "black" }, title: { color: "white" } },
    },
  },
  compoundVariants: [
    { variants: { tone: "dark" }, value: { title: { fontWeight: 600 } } },
  ],
  defaultVariants: { tone: "light" },
});
