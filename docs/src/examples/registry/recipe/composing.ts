import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/recipe/composing/button.ts";
import { button as composedButton } from "../../recipes/recipe/composing/composed-button.ts";
import { select } from "../../recipes/recipe/composing/select.ts";

/** The examples of the page composing of the docs of recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "style",
    name: "button",
    options: {
      disabled: ["false", "true"],
      size: ["sm", "md", "lg"],
      tone: ["primary", "neutral"],
    },
    recipe: button,
    required: [],
    valuesOf: elementValue,
  }),
  "composed-button": defineExample({
    kind: "style",
    name: "button",
    options: { size: ["sm", "md"] },
    recipe: composedButton,
    required: [],
    valuesOf: elementValue,
  }),
  select: defineExample({
    kind: "style",
    name: "select",
    options: { invalid: ["false", "true"] },
    recipe: select,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
