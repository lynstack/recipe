import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { card } from "../../recipes/recipe/composable-libraries/card.ts";

/**
 * The examples of the page composable-libraries of the docs of recipe, by
 * recipe.
 */
const examples = {
  card: defineExample({
    kind: "style",
    name: "card",
    options: { tone: ["muted", "loud"] },
    recipe: card,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
