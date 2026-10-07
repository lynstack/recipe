import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/recipe/how-it-works/button.ts";
import { button as composedButton } from "../../recipes/recipe/how-it-works/composed-button.ts";

/** The examples of the page how-it-works of the docs of recipe, by recipe. */
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
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
