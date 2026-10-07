import type { Style, StyleConfig } from "./configs.ts";
import type { TraceExample, TraceLayer } from "./trace.ts";
import { configOf, slotConfigOf } from "./configs.ts";
import type { SlotTraceExample } from "./slot-trace.ts";
import { button } from "./recipes/recipe/how-it-works/button.ts";
import { button as composedButton } from "./recipes/recipe/composing/composed-button.ts";
import { button as composingButton } from "./recipes/recipe/composing/button.ts";
import { field } from "./recipes/recipe/slot-recipes/field.ts";

type Recipe = (call: Readonly<Record<string, unknown>>) => Style;

/**
 * A recipe that pages trace, and the name of each recipe it is made of, in
 * the order of their configs, when it composes others.
 */
interface TracedRecipe {
  readonly recipe: Recipe;
  readonly names?: readonly string[] | undefined;
}

/** The recipes that pages trace, by the path of their module in `recipes`. */
const traces: ReadonlyMap<string, TracedRecipe> = new Map([
  ["recipe/how-it-works/button", { recipe: button }],
  [
    "recipe/composing/composed-button",
    { names: ["control", "button"], recipe: composedButton },
  ],
  [
    "recipe/composing/button",
    { names: ["control", "button"], recipe: composingButton },
  ],
]);

/** The slot recipes that pages trace, by the path of their module. */
const slotTraces: ReadonlyMap<
  string,
  (call: Readonly<Record<string, unknown>>) => Readonly<Record<string, Style>>
> = new Map([["recipe/slot-recipes/field", field]]);

/**
 * Returns the configs that `recipe` is made of, as the engine merges
 * them: those of each recipe it composes, each once, then its own.
 */
function configsOf(recipe: object): readonly StyleConfig[] {
  const config = configOf(recipe);
  const composed = (config.composes ?? []).flatMap((each) => configsOf(each));
  return [...new Set([...composed, config])];
}

function tracedRecipeOf(name: string): TracedRecipe {
  const traced = traces.get(name);
  if (traced === undefined) {
    throw new RangeError(`No trace is named ${name}`);
  }
  return traced;
}

/**
 * Returns the traced recipe named `name`, with its configs.
 *
 * @throws {RangeError} When no trace is named `name`, or its names do not
 *   name each of its configs.
 */
function traceExampleOf(name: string): TraceExample {
  const { recipe, names } = tracedRecipeOf(name);
  const configs = configsOf(recipe);
  if (names !== undefined && names.length !== configs.length) {
    throw new RangeError(`${name} names ${String(names.length)} recipes`);
  }
  const layers = configs.map((config, index): TraceLayer => ({
    config,
    recipe: names?.[index],
  }));
  const [own, ...composed] = layers.toReversed();
  if (own === undefined) {
    throw new RangeError(`${name} has no config`);
  }
  return { composed: composed.toReversed(), own, recipe };
}

/**
 * Returns the config of the traced recipe named `name`, which composes no
 * other recipe, so that its config is all that the engine compiles.
 *
 * @throws {RangeError} When no trace is named `name`, or its recipe
 *   composes others.
 */
function traceConfigOf(name: string): StyleConfig {
  const config = configOf(tracedRecipeOf(name).recipe);
  if ((config.composes ?? []).length > 0) {
    throw new RangeError(`${name} composes recipes, which its config omits`);
  }
  return config;
}

/**
 * Returns the traced slot recipe named `name`, with its config.
 *
 * @throws {RangeError} When no slot trace is named `name`.
 */
function slotTraceExampleOf(name: string): SlotTraceExample {
  const recipe = slotTraces.get(name);
  if (recipe === undefined) {
    throw new RangeError(`No slot trace is named ${name}`);
  }
  return { config: slotConfigOf(recipe), recipe };
}

export { slotTraceExampleOf, traceConfigOf, traceExampleOf };
