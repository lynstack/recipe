import { defineExample, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { card } from "../../recipes/class-recipe/sva/card.ts";

/** The examples of the page sva of the docs of class-recipe, by recipe. */
const examples = {
  card: defineExample({
    kind: "className",
    name: "card",
    options: { elevated: ["false", "true"], size: ["sm", "md"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
