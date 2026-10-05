import type { CompiledVariants, Compound } from "./variants.js";
import { matches } from "./reduce-values.js";
import { noOption } from "./variants.js";

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
 * index of each slot it gives a value, and that value at the same position.
 * Slots without a value are left out, so reducing skips them.
 */
interface SlotEntries {
  readonly slots: readonly number[];
  readonly values: readonly unknown[];
}

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
  const slotIndexes: number[] = [];
  const slotValues: unknown[] = [];
  for (const [index, slot] of slots.entries()) {
    const value = valueOfSlot(values, slot);
    if (value !== undefined) {
      slotIndexes.push(index);
      slotValues.push(value);
    }
  }
  return slotIndexes.length === 0
    ? undefined
    : { slots: slotIndexes, values: slotValues };
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

/** Reduces the values of `added` into the accumulators of their slots. */
function addEntries(
  accumulators: SlotAccumulators,
  added: SlotEntries,
  reduce: SlotsKind["reduce"],
): void {
  const { slots, values } = added;
  for (let entry = 0; entry < slots.length; entry += 1) {
    const slot = slots[entry] ?? 0;
    accumulators[slot] = reduce(accumulators[slot], values[entry]);
  }
}

/**
 * The names of a slot recipe's slots, and an object with a property for
 * each, which results copy so that assigning a slot named `__proto__` sets
 * that property instead of the prototype.
 */
interface SlotNames {
  readonly names: readonly string[];
  readonly template: Readonly<Record<string, unknown>>;
}

/** Returns the frozen result of each slot, keyed by slot name. */
function resultsBySlot(
  slots: SlotNames,
  accumulators: SlotAccumulators,
  finish: (accumulator: unknown) => unknown,
): Readonly<Record<string, unknown>> {
  const { names } = slots;
  const results: Record<string, unknown> = { ...slots.template };
  for (let slot = 0; slot < names.length; slot += 1) {
    results[names[slot] ?? ""] = finish(accumulators[slot]);
  }
  return Object.freeze(results);
}

const asResult = (accumulator: unknown): unknown => accumulator;

/**
 * Returns the function that builds the result of a selection for each slot
 * of a slot recipe: each slot reduces its own values with `kind`, and the
 * results are frozen in an object keyed by slot name.
 *
 * It reduces the values in a loop of its own instead of through
 * `reduceValues`, which recipes share, so that its calls to `kind.reduce`
 * see only the reducers of slot recipes and can be inlined.
 */
function createSlotsBuilder(
  kind: SlotsKind,
  compiled: CompiledVariants<LooseSlotValues | undefined>,
  config: SlotsConfig,
): (indexes: Int32Array) => Readonly<Record<string, unknown>> {
  const { initial, reduce, finish = asResult } = kind;
  const names = [...config.slots];
  const slotNames: SlotNames = {
    names,
    template: Object.fromEntries(names.map((slot) => [slot, undefined])),
  };
  const bases = names.map((slot) => valueOfSlot(config.base, slot));
  const { valuesByIndex, compounds } = compileEntries(compiled, names);

  return (indexes) => {
    const accumulators = bases.map((base) => initial(base));
    for (let variant = 0; variant < valuesByIndex.length; variant += 1) {
      const added = valuesByIndex[variant]?.[indexes[variant] ?? noOption];
      if (added !== undefined) {
        addEntries(accumulators, added, reduce);
      }
    }
    for (const compound of compounds) {
      if (compound.value !== undefined && matches(compound, indexes)) {
        addEntries(accumulators, compound.value, reduce);
      }
    }
    return resultsBySlot(slotNames, accumulators, finish);
  };
}

export { createSlotsBuilder };
export type { LooseSlotValues, SlotsKind };
