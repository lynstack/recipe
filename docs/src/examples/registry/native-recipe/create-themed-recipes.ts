import {
  button,
  dark,
  light,
} from "../../recipes/native-recipe/create-themed-recipes/button.ts";
import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";

/** The examples of the page create-themed-recipes of the docs of native-recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "style",
    name: "button.withTheme(light)",
    options: { tone: ["primary", "surface"] },
    recipe: button.withTheme(light),
    required: [],
    valuesOf: elementValue,
  }),
  "dark-button": defineExample({
    kind: "style",
    name: "button.withTheme(dark)",
    options: { tone: ["primary", "surface"] },
    recipe: button.withTheme(dark),
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
