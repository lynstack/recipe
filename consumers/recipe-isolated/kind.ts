import type {
  CreateKindRecipe,
  CreateKindSlotRecipe,
  RecipeKind,
} from "@lynstack/recipe";
import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind: RecipeKind<Style, Style, Style> = {
  finish: (style) => Object.freeze(style),
  initial: (base) => ({ ...base }),
  reduce: (style, value) => ({ ...style, ...value }),
};

const styleRecipe: CreateKindRecipe<Style, Style> = createRecipeKind(styleKind);
const slotStyleRecipe: CreateKindSlotRecipe<Style, Style> =
  createSlotRecipeKind(styleKind);

export { slotStyleRecipe, styleRecipe };
export type { Style };
