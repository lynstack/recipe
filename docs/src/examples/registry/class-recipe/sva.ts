import { defineExample, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { alert } from "../../recipes/class-recipe/sva/alert.ts";
import { card } from "../../recipes/class-recipe/sva/card.ts";
import { dialog } from "../../recipes/class-recipe/sva/dialog.ts";
import { heading } from "../../recipes/class-recipe/sva/heading.ts";

/** The examples of the page sva of the docs of class-recipe, by recipe. */
const examples = {
  alert: defineExample({
    kind: "className",
    name: "alert",
    options: { size: ["sm", "md"], tone: ["info", "danger"] },
    recipe: alert,
    required: ["tone"],
    valuesOf: slotValues,
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
    options: { elevated: ["false", "true"], size: ["sm", "md"] },
    recipe: dialog,
    required: [],
    valuesOf: slotValues,
  }),
  heading: defineExample({
    kind: "className",
    name: "heading",
    options: { level: ["1", "2"] },
    recipe: heading,
    required: ["level"],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
