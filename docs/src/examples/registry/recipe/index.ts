import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { text } from "../../recipes/recipe/index/text.ts";

/** The examples of the page index of the docs of recipe, by recipe. */
const examples = {
  text: defineExample({
    kind: "style",
    name: "text",
    options: { muted: ["false", "true"], size: ["sm", "lg"] },
    recipe: text,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
