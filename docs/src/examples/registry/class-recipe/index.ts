import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { button } from "../../recipes/class-recipe/index/button.ts";

/** The examples of the page index of the docs of class-recipe, by recipe. */
const examples = {
  button: defineExample({
    kind: "className",
    name: "button",
    options: { size: ["sm", "md"], tone: ["neutral", "danger"] },
    recipe: button,
    required: ["tone"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
