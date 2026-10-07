import { createRecipeKind } from "@lynstack/recipe";

import type { Style, StyleConfig } from "./configs.ts";
import {
  assertSameResult,
  conditionLabel,
  originsOf,
  recorderOf,
} from "./recorder.ts";
import type { Call } from "./example.ts";
import type { Trace } from "./recorder.ts";
import { tracedKind } from "./traced-kind.ts";

type ByName<Value> = Readonly<Record<string, Value>>;

/** A config, and the name of its recipe when a trace shows several. */
interface TraceLayer {
  readonly config: StyleConfig;
  readonly recipe?: string | undefined;
}

/**
 * A style recipe that a page traces: its config, the configs of the
 * recipes it composes, and the recipe itself, whose results a trace must
 * match.
 */
interface TraceExample {
  readonly own: TraceLayer;
  readonly composed?: readonly TraceLayer[] | undefined;
  readonly recipe: (call: Call) => Style;
}

function prefixed(recipe: string | undefined, label: string): string {
  return recipe === undefined ? label : `${recipe} ${label}`;
}

/** Names where each value of a layer comes from. */
function layerOrigins(
  layer: TraceLayer,
): readonly (readonly [Style, string])[] {
  const { config, recipe } = layer;
  const base =
    config.base === undefined
      ? []
      : [[config.base, prefixed(recipe, "base")] as const];
  const options = Object.entries(config.variants).flatMap(
    ([name, values]: readonly [string, ByName<Style>]) =>
      Object.entries(values).map(
        ([option, value]: readonly [string, Style]) =>
          [value, prefixed(recipe, `${name}: ${option}`)] as const,
      ),
  );
  const compounds = (config.compoundVariants ?? []).map(
    (compound) =>
      [
        compound.value,
        prefixed(recipe, `compound (${conditionLabel(compound.variants)})`),
      ] as const,
  );
  return [...base, ...options, ...compounds];
}

/**
 * Builds the result of `call` with a style recipe made of the example's
 * configs, and returns each call of the kind's functions, from the
 * recipe's creation to the result.
 *
 * @throws {Error} When the result differs from that of the example's recipe.
 */
function traceCall(
  example: TraceExample,
  call: Call,
  options: { readonly combine: boolean },
): Trace {
  const layers = [...(example.composed ?? []), example.own];
  const recorder = recorderOf(
    originsOf(layers.flatMap((layer) => layerOrigins(layer))),
  );
  const createRecipe = createRecipeKind(tracedKind(recorder, options.combine));
  const recipe = createRecipe(example.own.config);
  assertSameResult(recipe(call), example.recipe(call));
  return { combinations: recorder.combinations, steps: recorder.steps };
}

export { traceCall };
export type { TraceExample, TraceLayer };
