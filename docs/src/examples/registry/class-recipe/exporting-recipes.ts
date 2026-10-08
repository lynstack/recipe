import { defineExample, slotValues } from "../../example.ts";
import type { Example } from "../../example.ts";
import { look } from "../../recipes/class-recipe/exporting-recipes/look.ts";
import { toggle } from "../../recipes/class-recipe/exporting-recipes/toggle.ts";

/**
 * The examples of the page exporting-recipes of the docs of class-recipe,
 * by recipe.
 */
const examples = {
  look: defineExample({
    kind: "className",
    name: "look",
    options: { size: ["sm", "md"] },
    recipe: look,
    required: [],
    valuesOf: slotValues,
  }),
  toggle: defineExample({
    kind: "className",
    name: "toggle",
    options: { pressed: ["false", "true"], size: ["sm", "md"] },
    recipe: toggle,
    required: [],
    valuesOf: slotValues,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
