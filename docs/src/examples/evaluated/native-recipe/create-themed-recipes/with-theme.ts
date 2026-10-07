import {
  button,
  light,
} from "../../../recipes/native-recipe/create-themed-recipes/button.ts";

const lightButton = button.withTheme(light);

export const same =
  lightButton({ tone: "surface" }) === button(light, { tone: "surface" });
export const keys = lightButton.variantKeys;
export const options = lightButton.variantOptions;
export const defaults = lightButton.defaultVariants;
