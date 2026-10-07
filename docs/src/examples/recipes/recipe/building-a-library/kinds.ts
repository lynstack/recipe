import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

export type Style = Readonly<Record<string, string | number>>;
type MutableStyle = Record<string, string | number>;

export const styleKind = {
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style): MutableStyle =>
    Object.assign(style, value),
  combine: (first: Style, second: Style): Style => ({ ...first, ...second }),
  finish: (style: MutableStyle): Style => Object.freeze(style),
};

export const styleRecipe = createRecipeKind(styleKind);
export const slotStyleRecipe = createSlotRecipeKind(styleKind);

/** Adds `override` to a style as the kind adds a value, in a new style. */
export function overrideStyle(style: Style, override: Style): Style {
  const { initial, reduce, finish } = styleKind;
  return finish(reduce(initial(style), override));
}
