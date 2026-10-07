import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/class-recipe/cva/badge.ts";

/** The examples of the page cva of the docs of class-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "className",
    name: "badge",
    options: {
      outlined: ["false", "true"],
      tone: ["neutral", "success", "danger"],
    },
    recipe: badge,
    required: ["tone"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
