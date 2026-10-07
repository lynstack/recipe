import { slotStyleRecipe } from "../slot-style-recipe.ts";

export const field = slotStyleRecipe({
  slots: ["root", "label", "hint"],
  base: { root: { gap: 4 }, label: { fontSize: 14 } },
  variants: {
    size: { sm: { label: { fontSize: 12 } }, md: { root: { gap: 8 } } },
    invalid: {
      true: { root: { borderColor: "red" }, label: { color: "red" } },
    },
  },
  compoundVariants: [
    {
      variants: { size: "sm", invalid: true },
      value: { label: { fontWeight: 600 } },
    },
  ],
  defaultVariants: { size: "md" },
});
