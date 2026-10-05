import { createSlotRecipeKind } from "@lynstack/recipe";
import { styleKind } from "./style-kind.ts";

const slotStyleRecipe = createSlotRecipeKind(styleKind);

export const iconButton = slotStyleRecipe({
  slots: ["root", "icon"],
  base: { root: { flexDirection: "row", gap: 8 }, icon: { width: 20 } },
  variants: {
    size: {
      sm: { root: { height: 32 }, icon: { width: 16 } },
      md: { root: { height: 40 } },
    },
  },
  defaultVariants: { size: "md" },
});
