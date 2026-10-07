import { createRecipeKind } from "@lynstack/recipe";
import { recordConfig } from "../../configs.ts";
import { styleKind } from "./quick-start/style-kind.ts";

const createStyleRecipe = createRecipeKind(styleKind);

/**
 * Creates recipes of the style kind of the Quick start, and keeps each
 * config, which the figures of the docs read.
 */
export const styleRecipe: typeof createStyleRecipe = (config) =>
  recordConfig(createStyleRecipe(config), config);
