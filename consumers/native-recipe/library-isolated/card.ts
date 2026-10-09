import type { SlotStyleRecipeOf, StyleRecipeOf } from "@lynstack/native-recipe";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";

import { box, field } from "./box";

const cardConfig = {
  variants: { raised: { true: { elevation: 2 } } },
} as const;

const searchConfig = {
  slots: ["icon"],
  variants: { open: { true: { icon: { width: 12 }, root: { gap: 8 } } } },
} as const;

const card: StyleRecipeOf<typeof cardConfig, readonly [typeof box]> =
  createStyleRecipe({ ...cardConfig, composes: [box] });
const search: SlotStyleRecipeOf<typeof searchConfig, readonly [typeof field]> =
  createSlotStyleRecipe({ ...searchConfig, composes: [field] });

export { card, search };
