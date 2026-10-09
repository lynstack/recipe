import type { CreateKindRecipe, CreateKindSlotRecipe } from "@lynstack/recipe";
type Style = Readonly<Record<string, string | number>>;
declare const styleRecipe: CreateKindRecipe<Style, Style>;
declare const slotStyleRecipe: CreateKindSlotRecipe<Style, Style>;
export { slotStyleRecipe, styleRecipe };
export type { Style };
