import {
  themed,
  typed0,
  typed1,
  typed2,
  typed3,
  typed4,
} from "./themed-levels";
import type { Theme } from "./themed-levels";

// Each level composes a themed slot recipe of another module, typed with
// ThemedSlotStyleRecipeOf, so that its declaration prints that type.
const level0 = themed.createSlotStyleRecipe((theme: Theme) => ({
  composes: [typed0.withTheme(theme)],
  slots: ["footer"],
  variants: {},
}));
const level1 = themed.createSlotStyleRecipe((theme: Theme) => ({
  composes: [typed1.withTheme(theme)],
  slots: ["footer"],
  variants: {},
}));
const level2 = themed.createSlotStyleRecipe((theme: Theme) => ({
  composes: [typed2.withTheme(theme)],
  slots: ["footer"],
  variants: {},
}));
const level3 = themed.createSlotStyleRecipe((theme: Theme) => ({
  composes: [typed3.withTheme(theme)],
  slots: ["footer"],
  variants: {},
}));
const level4 = themed.createSlotStyleRecipe((theme: Theme) => ({
  composes: [typed4.withTheme(theme)],
  slots: ["footer"],
  variants: {},
}));

export { level0, level1, level2, level3, level4 };
