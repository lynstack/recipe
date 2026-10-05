import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { conflicting } from "../../recipes/class-recipe/conflict-free-recipes/conflicting.ts";
import { input } from "../../recipes/class-recipe/conflict-free-recipes/input.ts";

/** The examples of the page conflict-free-recipes of the docs of class-recipe, by recipe. */
const examples = {
  conflicting: defineExample({
    kind: "className",
    name: "conflicting",
    options: { invalid: ["false", "true"] },
    recipe: conflicting,
    required: [],
    valuesOf: elementValue,
  }),
  input: defineExample({
    kind: "className",
    name: "input",
    options: { invalid: ["false", "true"] },
    recipe: input,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
