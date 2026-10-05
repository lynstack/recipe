import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/recipe/quick-start/button.ts";
import { iconButton } from "../../recipes/recipe/quick-start/icon-button.ts";

/** The examples of the page quick-start of the docs of recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "style",
    name: "button",
    options: {
      disabled: ["false", "true"],
      size: ["sm", "md"],
      tone: ["primary", "neutral"],
    },
    recipe: button,
    required: [],
    valuesOf: elementValue,
  }),
  "icon-button": defineExample({
    kind: "style",
    name: "iconButton",
    options: { size: ["sm", "md"] },
    recipe: iconButton,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
