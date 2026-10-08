import type { SlotStyleRecipeOf, StyleRecipeOf } from "@lynstack/native-recipe";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";

const boxConfig = {
  base: { borderRadius: 8 },
  compoundVariants: [
    { style: { borderWidth: 1 }, variants: { size: "sm", tone: "danger" } },
  ],
  defaultVariants: { size: "md" },
  variants: {
    size: { md: { padding: 8 }, sm: { padding: 4 } },
    tone: { danger: { opacity: 1 }, neutral: { opacity: 0.8 } },
  },
} as const;

const fieldConfig = {
  base: { root: { gap: 4 } },
  slots: ["root", "label"],
  variants: { size: { md: {}, sm: { label: { fontSize: 12 } } } },
} as const;

const box: StyleRecipeOf<typeof boxConfig> = createStyleRecipe(boxConfig);
const field: SlotStyleRecipeOf<typeof fieldConfig> =
  createSlotStyleRecipe(fieldConfig);

export { box, field };
