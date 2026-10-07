import {
  dark,
  iconButton as themedIconButton,
} from "../../recipes/native-recipe/composing/themed-icon-button.ts";
import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/native-recipe/composing/button.ts";
import { card } from "../../recipes/native-recipe/composing/card.ts";
import { dialog } from "../../recipes/native-recipe/composing/dialog.ts";
import { iconButton } from "../../recipes/native-recipe/composing/icon-button.ts";

/** The examples of the page composing of the docs of native-recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "style",
    name: "button",
    options: {
      outlined: ["false", "true"],
      size: ["sm", "md"],
      tone: ["neutral", "danger"],
    },
    recipe: button,
    required: ["tone"],
    valuesOf: elementValue,
  }),
  card: defineExample({
    kind: "style",
    name: "card",
    options: { compact: ["false", "true"], tone: ["plain", "inverted"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
  dialog: defineExample({
    kind: "style",
    name: "dialog",
    options: { compact: ["false", "true"], tone: ["plain", "inverted"] },
    recipe: dialog,
    required: [],
    valuesOf: slotValues,
  }),
  "icon-button": defineExample({
    kind: "style",
    name: "iconButton",
    options: {
      outlined: ["false", "true"],
      size: ["sm", "md"],
      tone: ["neutral", "danger"],
    },
    recipe: iconButton,
    required: ["tone"],
    valuesOf: elementValue,
  }),
  "themed-icon-button": defineExample({
    kind: "style",
    name: "iconButton.withTheme(dark)",
    options: { tone: ["primary", "surface"] },
    recipe: themedIconButton.withTheme(dark),
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
