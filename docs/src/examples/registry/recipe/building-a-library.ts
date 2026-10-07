import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { box } from "../../recipes/recipe/building-a-library/box.ts";
import { card } from "../../recipes/recipe/building-a-library/card.ts";

/**
 * The examples of the page building-a-library of the docs of recipe, by
 * recipe.
 */
const examples = {
  box: defineExample({
    kind: "style",
    name: "box",
    options: { tone: ["muted", "loud"] },
    recipe: box,
    required: [],
    valuesOf: elementValue,
  }),
  card: defineExample({
    kind: "style",
    name: "card",
    options: { tone: ["light", "dark"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
