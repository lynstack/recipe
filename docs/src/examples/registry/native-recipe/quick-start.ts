import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/native-recipe/quick-start/badge.ts";
import { button } from "../../recipes/native-recipe/quick-start/button.ts";

/** The examples of the page quick-start of the docs of native-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "style",
    name: "badge",
    options: {
      outlined: ["false", "true"],
      size: ["sm", "md"],
      tone: ["neutral", "success", "danger"],
    },
    recipe: badge,
    required: [],
    valuesOf: elementValue,
  }),
  button: defineExample({
    kind: "style",
    name: "button",
    options: { size: ["sm", "md"], tone: ["primary", "ghost"] },
    recipe: button,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
