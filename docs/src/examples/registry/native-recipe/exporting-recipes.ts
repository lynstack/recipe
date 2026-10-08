import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { box } from "../../recipes/native-recipe/exporting-recipes/box.ts";
import { card } from "../../recipes/native-recipe/exporting-recipes/card.ts";

/**
 * The examples of the page exporting-recipes of the docs of native-recipe,
 * by recipe.
 */
const examples = {
  box: defineExample({
    kind: "style",
    name: "box",
    options: { size: ["sm", "md"] },
    recipe: box,
    required: [],
    valuesOf: elementValue,
  }),
  card: defineExample({
    kind: "style",
    name: "card",
    options: { raised: ["false", "true"], size: ["sm", "md"] },
    recipe: card,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
