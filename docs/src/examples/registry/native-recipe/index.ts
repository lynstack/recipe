import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/native-recipe/index/badge.ts";

/** The examples of the page index of the docs of native-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "style",
    name: "badge",
    options: { size: ["sm", "md"], tone: ["neutral", "danger"] },
    recipe: badge,
    required: ["tone"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
