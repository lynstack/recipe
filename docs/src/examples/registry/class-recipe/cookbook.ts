import { defineExample, elementValue, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { alert } from "../../recipes/class-recipe/cookbook/alert.ts";
import { badge } from "../../recipes/class-recipe/cookbook/badge.ts";
import { button } from "../../recipes/class-recipe/cookbook/button.ts";
import { card } from "../../recipes/class-recipe/cookbook/card.ts";
import { dialog } from "../../recipes/class-recipe/cookbook/dialog.ts";
import { field } from "../../recipes/class-recipe/cookbook/field.ts";

/** The examples of the page cookbook of the docs of class-recipe, by recipe. */
const examples = {
  alert: defineExample({
    kind: "className",
    name: "alert",
    options: { tone: ["info", "success", "danger"] },
    recipe: alert,
    required: [],
    valuesOf: slotValues,
  }),
  badge: defineExample({
    kind: "className",
    name: "badge",
    options: {
      outlined: ["false", "true"],
      tone: ["neutral", "success", "danger"],
    },
    recipe: badge,
    required: [],
    valuesOf: elementValue,
  }),
  button: defineExample({
    kind: "className",
    name: "button",
    options: {
      size: ["sm", "md", "lg"],
      state: ["idle", "loading", "disabled"],
      tone: ["primary", "neutral", "danger"],
    },
    recipe: button,
    required: [],
    valuesOf: elementValue,
  }),
  card: defineExample({
    kind: "className",
    name: "card",
    options: { elevated: ["false", "true"], size: ["sm", "md"] },
    recipe: card,
    required: [],
    valuesOf: slotValues,
  }),
  dialog: defineExample({
    kind: "className",
    name: "dialog",
    options: { size: ["sm", "md", "lg"] },
    recipe: dialog,
    required: [],
    valuesOf: slotValues,
  }),
  field: defineExample({
    kind: "className",
    name: "field",
    options: { invalid: ["false", "true"], size: ["sm", "md"] },
    recipe: field,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
