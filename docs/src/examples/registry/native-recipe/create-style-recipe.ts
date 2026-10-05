import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/native-recipe/create-style-recipe/badge.ts";
import { button } from "../../recipes/native-recipe/create-style-recipe/button.ts";
import { heading } from "../../recipes/native-recipe/create-style-recipe/heading.ts";
import { input } from "../../recipes/native-recipe/create-style-recipe/input.ts";
import { stack } from "../../recipes/native-recipe/create-style-recipe/stack.ts";
import { text } from "../../recipes/native-recipe/create-style-recipe/text.ts";

/** The examples of the page create-style-recipe of the docs of native-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "style",
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
    kind: "style",
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
    kind: "style",
    name: "heading",
    options: { level: ["1", "2"] },
    recipe: heading,
    required: ["level"],
    valuesOf: elementValue,
  }),
  input: defineExample({
    kind: "style",
    name: "input",
    options: { disabled: ["false", "true"], invalid: ["false", "true"] },
    recipe: input,
    required: [],
    valuesOf: elementValue,
  }),
  stack: defineExample({
    kind: "style",
    name: "stack",
    options: { direction: ["row", "column"], gap: ["sm", "md"] },
    recipe: stack,
    required: [],
    valuesOf: elementValue,
  }),
  text: defineExample({
    kind: "style",
    name: "text",
    options: { muted: ["false", "true"], size: ["sm", "lg"] },
    recipe: text,
    required: ["size"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
