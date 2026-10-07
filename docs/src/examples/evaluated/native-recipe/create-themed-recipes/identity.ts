import {
  button,
  dark,
  light,
} from "../../../recipes/native-recipe/create-themed-recipes/button.ts";

const surface = button(light, { tone: "surface" });
button(dark, { tone: "surface" });
export const same = button(light, { tone: "surface" }) === surface;
