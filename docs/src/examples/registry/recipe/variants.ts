import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/recipe/variants/button.ts";
import { field } from "../../recipes/recipe/variants/field.ts";
import { heading } from "../../recipes/recipe/variants/heading.ts";
import { text } from "../../recipes/recipe/variants/text.ts";

/** The examples of the page variants of the docs of recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "style",
    name: "button",
    options: { size: ["sm", "lg"], tone: ["primary", "neutral", "ghost"] },
    recipe: button,
    required: ["tone"],
    valuesOf: elementValue,
  }),
  field: defineExample({
    kind: "style",
    name: "field",
    options: { invalid: ["false", "true"] },
    recipe: field,
    required: [],
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
  text: defineExample({
    kind: "style",
    name: "text",
    options: { size: ["sm", "lg"], tone: ["neutral", "danger"] },
    recipe: text,
    required: ["tone"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
