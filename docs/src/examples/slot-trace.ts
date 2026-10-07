import { createSlotRecipeKind } from "@lynstack/recipe";

import type { SlotStyleConfig, Style } from "./configs.ts";
import {
  assertSameResult,
  conditionLabel,
  originsOf,
  recorderOf,
} from "./recorder.ts";
import type { Call } from "./example.ts";
import type { TraceStep } from "./recorder.ts";
import { tracedKind } from "./traced-kind.ts";

type ByName<Value> = Readonly<Record<string, Value>>;

/** A slot recipe that a page traces, and its config. */
interface SlotTraceExample {
  readonly config: SlotStyleConfig;
  readonly recipe: (call: Call) => ByName<Style>;
}

/** The calls of the kind's functions for one slot of a result. */
interface SlotTrace {
  readonly slot: string;
  readonly steps: readonly TraceStep[];
}

/** Names where each slot value of `values` comes from. */
function slotValueOrigins(
  values: ByName<Style | undefined> | undefined,
  origin: string,
): readonly (readonly [Style, string])[] {
  return Object.values(values ?? {}).flatMap((value) =>
    value === undefined ? [] : [[value, origin] as const],
  );
}

/** Names where each value of a slot recipe's config comes from. */
function slotConfigOrigins(
  config: SlotStyleConfig,
): readonly (readonly [Style, string])[] {
  const options = Object.entries(config.variants).flatMap(
    ([name, valuesByOption]: readonly [
      string,
      ByName<ByName<Style | undefined>>,
    ]) =>
      Object.entries(valuesByOption).flatMap(
        ([option, values]: readonly [string, ByName<Style | undefined>]) =>
          slotValueOrigins(values, `${name}: ${option}`),
      ),
  );
  const compounds = (config.compoundVariants ?? []).flatMap((compound) =>
    slotValueOrigins(
      compound.value,
      `compound (${conditionLabel(compound.variants)})`,
    ),
  );
  return [...slotValueOrigins(config.base, "base"), ...options, ...compounds];
}

/**
 * Builds the result of `call` with a slot recipe of the example's config,
 * and returns the calls of the kind's functions for each slot, in the
 * order of `slots`. A step belongs to the slot whose result is the
 * accumulator it changed, since the kind's `finish` returns the
 * accumulator it receives.
 *
 * @throws {Error} When the result differs from that of the example's
 *   recipe, or a step belongs to no slot or to several.
 */
function traceSlotCall(
  example: SlotTraceExample,
  call: Call,
): readonly SlotTrace[] {
  const recorder = recorderOf(originsOf(slotConfigOrigins(example.config)));
  const createSlotRecipe = createSlotRecipeKind(tracedKind(recorder, false));
  const result = createSlotRecipe(example.config)(call);
  assertSameResult(result, example.recipe(call));
  const { slots } = example.config;
  const results = new Set<unknown>(slots.map((slot) => result[slot]));
  if (
    results.size !== slots.length ||
    recorder.steps.some((step) => !results.has(step.target))
  ) {
    throw new Error("Each step of a slot trace must belong to one slot");
  }
  return slots.map((slot) => ({
    slot,
    steps: recorder.steps.filter((step) => step.target === result[slot]),
  }));
}

export { traceSlotCall };
export type { SlotTraceExample };
