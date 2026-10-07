import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/class-recipe/variants/button.ts";
import { card } from "../../recipes/class-recipe/variants/card.ts";
import { heading } from "../../recipes/class-recipe/variants/heading.ts";
import { input } from "../../recipes/class-recipe/variants/input.ts";
import { stack } from "../../recipes/class-recipe/variants/stack.ts";

/** The examples of the page variants of the docs of class-recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "className",
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
    kind: "className",
    name: "card",
    options: { elevated: ["false", "true"], size: ["sm", "md"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
  heading: defineExample({
    kind: "className",
    name: "heading",
    options: { level: ["1", "2"] },
    recipe: heading,
    required: ["level"],
    valuesOf: elementValue,
  }),
  input: defineExample({
    kind: "className",
    name: "input",
    options: { disabled: ["false", "true"], invalid: ["false", "true"] },
    recipe: input,
    required: [],
    valuesOf: elementValue,
  }),
  stack: defineExample({
    kind: "className",
    name: "stack",
    options: { direction: ["row", "column"], gap: ["sm", "md"] },
    recipe: stack,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
