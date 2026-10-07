import { defineExample, elementValue } from "../../example.ts";
import type { Example } from "../../example.ts";
import { input as composedAfter } from "../../recipes/class-recipe/conflict-free-recipes/composed-after.ts";
import { input as composedBefore } from "../../recipes/class-recipe/conflict-free-recipes/composed-before.ts";
import { button as compoundAfter } from "../../recipes/class-recipe/conflict-free-recipes/compound-after.ts";
import { button as compoundBefore } from "../../recipes/class-recipe/conflict-free-recipes/compound-before.ts";
import { conflicting } from "../../recipes/class-recipe/conflict-free-recipes/conflicting.ts";
import { input } from "../../recipes/class-recipe/conflict-free-recipes/input.ts";
import { button as option } from "../../recipes/class-recipe/conflict-free-recipes/option.ts";
import { button as stateAfter } from "../../recipes/class-recipe/conflict-free-recipes/state-after.ts";
import { button as stateBefore } from "../../recipes/class-recipe/conflict-free-recipes/state-before.ts";

/** The examples of the page conflict-free-recipes of the docs of class-recipe, by recipe. */
const examples = {
  "composed-after": defineExample({
    kind: "className",
    name: "input",
    options: { invalid: ["false", "true"], size: ["sm", "md"] },
    recipe: composedAfter,
    required: [],
    valuesOf: elementValue,
  }),
  "composed-before": defineExample({
    kind: "className",
    name: "input",
    options: { size: ["sm", "md"] },
    recipe: composedBefore,
    required: [],
    valuesOf: elementValue,
  }),
  "compound-after": defineExample({
    kind: "className",
    name: "button",
    options: { iconOnly: ["false", "true"], size: ["sm", "md"] },
    recipe: compoundAfter,
    required: [],
    valuesOf: elementValue,
  }),
  "compound-before": defineExample({
    kind: "className",
    name: "button",
    options: { iconOnly: ["false", "true"], size: ["sm", "md"] },
    recipe: compoundBefore,
    required: [],
    valuesOf: elementValue,
  }),
  conflicting: defineExample({
    kind: "className",
    name: "conflicting",
    options: { invalid: ["false", "true"] },
    recipe: conflicting,
    required: [],
    valuesOf: elementValue,
  }),
  input: defineExample({
    kind: "className",
    name: "input",
    options: { invalid: ["false", "true"] },
    recipe: input,
    required: [],
    valuesOf: elementValue,
  }),
  option: defineExample({
    kind: "className",
    name: "button",
    options: { size: ["sm", "md", "compact"] },
    recipe: option,
    required: [],
    valuesOf: elementValue,
  }),
  "state-after": defineExample({
    kind: "className",
    name: "button",
    options: { state: ["idle", "loading", "disabled"] },
    recipe: stateAfter,
    required: [],
    valuesOf: elementValue,
  }),
  "state-before": defineExample({
    kind: "className",
    name: "button",
    options: { disabled: ["false", "true"], loading: ["false", "true"] },
    recipe: stateBefore,
    required: [],
    valuesOf: elementValue,
  }),
} as const satisfies Readonly<Record<string, Example>>;

export { examples };
