import {
  button,
  light,
} from "../../../recipes/native-recipe/create-themed-recipes/button.ts";

export const same = button(light) === button(light, { tone: "primary" });
