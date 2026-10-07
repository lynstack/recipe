import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { dialog } from "../../recipes/class-recipe/composing/dialog.ts";
import { iconButton } from "../../recipes/class-recipe/composing/icon-button.ts";

/** The examples of the page composing of the docs of class-recipe, by recipe. */
const examples = {
  dialog: defineExample({
    kind: "className",
    name: "dialog",
    options: { elevated: ["false", "true"], size: ["sm", "md"] },
    recipe: dialog,
    required: [],
    valuesOf: slotValues,
  }),
  "icon-button": defineExample({
    kind: "className",
    name: "iconButton",
    options: { size: ["sm", "md"], tone: ["neutral", "danger"] },
    recipe: iconButton,
    required: ["tone"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
