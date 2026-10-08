import type { StyleRecipeOf } from "@lynstack/native-recipe";
import { createStyleRecipe } from "@lynstack/native-recipe";

import { box } from "./box.ts";

const cardConfig = {
  variants: { raised: { true: { elevation: 2 } } },
} as const;

export const card: StyleRecipeOf<typeof cardConfig, readonly [typeof box]> =
  createStyleRecipe({ ...cardConfig, composes: [box] });
