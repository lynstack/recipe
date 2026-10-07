import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { avatar } from "../../recipes/native-recipe/variants/avatar.ts";
import { button } from "../../recipes/native-recipe/variants/button.ts";
import { heading } from "../../recipes/native-recipe/variants/heading.ts";
import { input } from "../../recipes/native-recipe/variants/input.ts";

/** The examples of the page variants of the docs of native-recipe, by recipe. */
const examples = {
  avatar: defineExample({
    kind: "style",
    name: "avatar",
    options: { shape: ["circle", "square"], size: ["sm", "lg"] },
    recipe: avatar,
    required: ["size"],
    valuesOf: elementValue,
  }),
  button: defineExample({
    kind: "style",
    name: "button",
    options: {
      outlined: ["false", "true"],
      size: ["sm", "md"],
      tone: ["neutral", "danger"],
    },
    recipe: button,
    required: ["tone"],
    valuesOf: elementValue,
  }),
  heading: defineExample({
    kind: "style",
    name: "heading",
    options: { level: ["1", "2"] },
    recipe: heading,
    required: ["level"],
    valuesOf: elementValue,
  }),
  input: defineExample({
    kind: "style",
    name: "input",
    options: { disabled: ["false", "true"], invalid: ["false", "true"] },
    recipe: input,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
