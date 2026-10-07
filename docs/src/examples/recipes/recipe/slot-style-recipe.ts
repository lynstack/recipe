import { createSlotRecipeKind } from "@lynstack/recipe";
import { recordSlotConfig } from "../../configs.ts";
import { styleKind } from "./quick-start/style-kind.ts";

const createSlotStyleRecipe = createSlotRecipeKind(styleKind);

/**
 * Creates slot recipes of the style kind of the Quick start, and keeps each
 * config, which the figures of the docs read.
 */
export const slotStyleRecipe: typeof createSlotStyleRecipe = (config) =>
  recordSlotConfig(createSlotStyleRecipe(config), config);
