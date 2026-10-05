import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/class-recipe/quick-start/button.ts";
import { card } from "../../recipes/class-recipe/quick-start/card.ts";

/** The examples of the page quick-start of the docs of class-recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "className",
    name: "button",
    options: {
      loading: ["false", "true"],
      size: ["sm", "md"],
      tone: ["primary", "neutral"],
    },
    recipe: button,
    required: [],
    valuesOf: elementValue,
  }),
  card: defineExample({
    kind: "className",
    name: "card",
    options: { size: ["sm", "md"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
