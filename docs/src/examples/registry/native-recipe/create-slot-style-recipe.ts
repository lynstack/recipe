import { defineExample, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { card } from "../../recipes/native-recipe/create-slot-style-recipe/card.ts";
import { dialog } from "../../recipes/native-recipe/create-slot-style-recipe/dialog.ts";
import { field } from "../../recipes/native-recipe/create-slot-style-recipe/field.ts";
import { iconButton } from "../../recipes/native-recipe/create-slot-style-recipe/icon-button.ts";

/** The examples of the page create-slot-style-recipe of the docs of native-recipe, by recipe. */
const examples = {
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
  field: defineExample({
    kind: "style",
    name: "field",
    options: { disabled: ["false", "true"], invalid: ["false", "true"] },
    recipe: field,
    required: [],
    valuesOf: slotValues,
  }),
  "icon-button": defineExample({
    kind: "style",
    name: "iconButton",
    options: { size: ["md"] },
    recipe: iconButton,
    required: ["size"],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
