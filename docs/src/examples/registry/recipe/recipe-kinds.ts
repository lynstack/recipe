import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/recipe/recipe-kinds/badge.ts";

/** The examples of the page recipe-kinds of the docs of recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "className",
    name: "badge",
    options: { tone: ["info", "danger"] },
    recipe: badge,
    required: ["tone"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
