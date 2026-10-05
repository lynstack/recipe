import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const field = createSlotStyleRecipe({
  slots: ["label", "input"],
  base: {
    label: { fontSize: 14 },
    input: { borderRadius: 6, borderWidth: 1 },
  },
  variants: {
    invalid: {
      true: { label: { color: "#b91c1c" }, input: { borderColor: "#dc2626" } },
    },
    disabled: { true: { input: { opacity: 0.5 } } },
  },
  compoundVariants: [
    {
      variants: { invalid: true, disabled: true },
      styles: { label: { opacity: 0.5 } },
    },
  ],
});
