import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/class-recipe/cva/badge.ts";
import { button } from "../../recipes/class-recipe/cva/button.ts";
import { heading } from "../../recipes/class-recipe/cva/heading.ts";
import { input } from "../../recipes/class-recipe/cva/input.ts";
import { stack } from "../../recipes/class-recipe/cva/stack.ts";

/** The examples of the page cva of the docs of class-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "className",
    name: "badge",
    options: {
      outlined: ["false", "true"],
      tone: ["neutral", "success", "danger"],
    },
    recipe: badge,
    required: ["tone"],
    valuesOf: elementValue,
  }),
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
