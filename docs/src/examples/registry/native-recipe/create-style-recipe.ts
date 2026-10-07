import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { badge } from "../../recipes/native-recipe/create-style-recipe/badge.ts";
import { text } from "../../recipes/native-recipe/create-style-recipe/text.ts";

/** The examples of the page create-style-recipe of the docs of native-recipe, by recipe. */
const examples = {
  badge: defineExample({
    kind: "style",
    name: "badge",
    options: {
      outlined: ["false", "true"],
      tone: ["neutral", "success", "danger"],
    },
    recipe: badge,
    required: ["tone"],
    valuesOf: elementValue,
  }),
  text: defineExample({
    kind: "style",
    name: "text",
    options: { muted: ["false", "true"], size: ["sm", "lg"] },
    recipe: text,
    required: ["size"],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
