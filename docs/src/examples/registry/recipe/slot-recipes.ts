import { defineExample, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { card } from "../../recipes/recipe/slot-recipes/card.ts";
import { field } from "../../recipes/recipe/slot-recipes/field.ts";

/** The examples of the page slot-recipes of the docs of recipe, by recipe. */
const examples = {
  card: defineExample({
    kind: "style",
    name: "card",
    options: { tone: ["light", "dark"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
  field: defineExample({
    kind: "style",
    name: "field",
    options: { invalid: ["false", "true"], size: ["sm", "md"] },
    recipe: field,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
