import type { CompiledVariants, Compound } from "./variants.js";
import { reduceValues } from "./reduce-values.js";

/** Values for some slots, keyed by slot name, as the runtime takes them. */
type LooseSlotValues = Readonly<Record<string, unknown>>;

/** How the values of each slot are reduced, as a recipe kind gives it. */
interface SlotsKind {
  readonly initial: (base: unknown) => unknown;
  readonly reduce: (accumulator: unknown, value: unknown) => unknown;
  readonly finish?: ((accumulator: unknown) => unknown) | undefined;
}

/** What a slot recipe's config gives for its slots. */
interface SlotsConfig {
  readonly slots: readonly string[];
  readonly base?: LooseSlotValues | undefined;
}

/**
 * The values that one option or compound variant adds to its slots: the
 * index of each slot it gives a value, followed by that value. Slots
 * without a value are left out, so reducing skips them.
 */
type SlotEntries = readonly unknown[];

/** The length of one entry: a slot index and its value. */
const ENTRY_LENGTH = 2;

/**
 * The accumulator of each slot while a selection is reduced, which
 * {@link addEntries} updates in place.
 */
interface SlotAccumulators {
  readonly length: number;
  [slot: number]: unknown;
}

function valueOfSlot(
  values: LooseSlotValues | undefined,
  slot: string,
): unknown {
  return values !== undefined && Object.hasOwn(values, slot)
    ? values[slot]
    : undefined;
}

/** Returns the entries of `values`, or undefined when no slot has one. */
function entriesOf(
  slots: readonly string[],
  values: LooseSlotValues | undefined,
): SlotEntries | undefined {
  const entries: unknown[] = [];
  for (const [index, slot] of slots.entries()) {
    const value = valueOfSlot(values, slot);
    if (value !== undefined) {
      entries.push(index, value);
    }
  }
  return entries.length === 0 ? undefined : entries;
}

/** Turns the slot values of each option and compound variant into entries. */
function compileEntries(
  compiled: CompiledVariants<LooseSlotValues | undefined>,
  slots: readonly string[],
): CompiledVariants<SlotEntries | undefined> {
  return {
    ...compiled,
    compounds: compiled.compounds
      .map((compound): Compound<SlotEntries | undefined> => ({
        conditions: compound.conditions,
        value: entriesOf(slots, compound.value),
      }))
      .filter((compound) => compound.value !== undefined),
    valuesByIndex: compiled.valuesByIndex.map((valuesOfVariant) =>
      valuesOfVariant.map((values) => entriesOf(slots, values)),
    ),
  };
}

/**
 * Returns the function that builds the result of a selection for each slot
 * of a slot recipe: each slot reduces its own values with `kind`, and the
 * results are frozen in an object keyed by slot name.
 */
function createSlotsBuilder(
  kind: SlotsKind,
  compiled: CompiledVariants<LooseSlotValues | undefined>,
  config: SlotsConfig,
): (indexes: Int32Array) => Readonly<Record<string, unknown>> {
  const { initial, reduce, finish } = kind;
  const names = [...config.slots];
  const bases = names.map((slot) => valueOfSlot(config.base, slot));
  const entries = compileEntries(compiled, names);

  const addEntries = (
    accumulators: SlotAccumulators,
    added: SlotEntries,
  ): SlotAccumulators => {
    for (let entry = 0; entry < added.length; entry += ENTRY_LENGTH) {
      const slot = Number(added[entry]);
      accumulators[slot] = reduce(accumulators[slot], added[entry + 1]);
    }
    return accumulators;
  };
  const reducer = {
    initial: (): SlotAccumulators => bases.map((base) => initial(base)),
    reduce: addEntries,
  };
  if (finish === undefined) {
    return (indexes) => {
      const accumulators = reduceValues(entries, indexes, reducer);
      const results: Record<string, unknown> = {};
      for (let slot = 0; slot < names.length; slot += 1) {
        results[names[slot] ?? ""] = accumulators[slot];
      }
      return Object.freeze(results);
    };
  }
  return (indexes) => {
    const accumulators = reduceValues(entries, indexes, reducer);
    const results: Record<string, unknown> = {};
    for (let slot = 0; slot < names.length; slot += 1) {
      results[names[slot] ?? ""] = finish(accumulators[slot]);
    }
    return Object.freeze(results);
  };
}

export { createSlotsBuilder };
export type { LooseSlotValues, SlotsKind };
