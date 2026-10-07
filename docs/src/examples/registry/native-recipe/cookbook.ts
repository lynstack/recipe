import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/native-recipe/cookbook/badge.ts";
import { button } from "../../recipes/native-recipe/cookbook/button.ts";
import { card } from "../../recipes/native-recipe/cookbook/card.ts";
import { dialog } from "../../recipes/native-recipe/cookbook/dialog.ts";
import { field } from "../../recipes/native-recipe/cookbook/field.ts";

/** The examples of the page cookbook of the docs of native-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "style",
    name: "badge",
    options: {
      size: ["sm", "md"],
      tone: ["neutral", "success", "warning", "danger"],
    },
    recipe: badge,
    required: [],
    valuesOf: elementValue,
  }),
  button: defineExample({
    kind: "style",
    name: "button",
    options: {
      disabled: ["false", "true"],
      fullWidth: ["false", "true"],
      size: ["sm", "md"],
      tone: ["primary", "secondary", "ghost"],
    },
    recipe: button,
    required: [],
    valuesOf: slotValues,
  }),
  card: defineExample({
    kind: "style",
    name: "card",
    options: {
      elevated: ["false", "true"],
      padding: ["sm", "md"],
      tone: ["plain", "muted"],
    },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
  dialog: defineExample({
    kind: "style",
    name: "dialog",
    options: { placement: ["center", "bottom"], size: ["sm", "md"] },
    recipe: dialog,
    required: [],
    valuesOf: slotValues,
  }),
  field: defineExample({
    kind: "style",
    name: "field",
    options: {
      disabled: ["false", "true"],
      invalid: ["false", "true"],
      size: ["sm", "md"],
    },
    recipe: field,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
