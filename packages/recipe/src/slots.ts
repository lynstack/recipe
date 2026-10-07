import type { CompiledVariants, Compound } from "./variants.js";
import { combineValues } from "./compose.js";
import { matches } from "./reduce-values.js";
import { noOption } from "./variants.js";

/** Values for some slots, keyed by slot name, as the runtime takes them. */
type LooseSlotValues = Readonly<Record<string, unknown>>;

/** The values of the `false` option a boolean variant of a slot recipe adds. */
const noSlotValues: readonly LooseSlotValues[] = Object.freeze([]);

/** How the values of each slot are reduced, as a recipe kind gives it. */
interface SlotsKind {
  readonly initial: (base: unknown) => unknown;
  readonly reduce: (accumulator: unknown, value: unknown) => unknown;
  readonly combine?: ((first: unknown, second: unknown) => unknown) | undefined;
  readonly finish?: ((accumulator: unknown) => unknown) | undefined;
}

/** The slots of a slot recipe and their bases, in the order of its layers. */
interface SlotsConfig {
  readonly slots: readonly string[];
  readonly bases: readonly LooseSlotValues[];
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

/**
 * Returns the values of each slot in a list of values for some slots, in
 * the order of the list, combined into one with `combine` when the kind
 * has it.
 */
function slotValuesOf(
  slots: readonly string[],
  valuesList: readonly LooseSlotValues[],
  combine: SlotsKind["combine"],
): readonly (readonly unknown[])[] {
  return slots.map((slot) => {
    const values = valuesList.flatMap((each) =>
      listOf(valueOfSlot(each, slot)),
    );
    return combine === undefined
      ? values
      : listOf(combineValues(values, combine));
  });
}

/**
 * Returns the entries of the values of each slot, by slot index, or
 * undefined when no slot has one.
 */
function entriesBySlot(
  valuesBySlot: readonly (readonly unknown[])[],
): SlotEntries | undefined {
  const slotIndexes = valuesBySlot.flatMap((values, slot) =>
    values.map(() => slot),
  );
  return slotIndexes.length === 0
    ? undefined
    : { slots: slotIndexes, values: valuesBySlot.flat() };
}

function listOf(value: unknown): readonly unknown[] {
  return value === undefined ? [] : [value];
}

/** Turns the slot values of each option and compound variant into entries. */
function compileEntries(
  compiled: CompiledVariants<readonly LooseSlotValues[]>,
  slots: readonly string[],
  combine: SlotsKind["combine"],
): CompiledVariants<SlotEntries | undefined> {
  const entriesOf = (
    valuesList: readonly LooseSlotValues[],
  ): SlotEntries | undefined =>
    entriesBySlot(slotValuesOf(slots, valuesList, combine));
  return {
    ...compiled,
    compounds: compiled.compounds
      .map((compound): Compound<SlotEntries | undefined> => ({
        conditions: compound.conditions,
        value: entriesOf(compound.value),
      }))
      .filter((compound) => compound.value !== undefined),
    valuesByIndex: compiled.valuesByIndex.map((valuesOfVariant) =>
      valuesOfVariant.map((values) => entriesOf(values)),
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
  compiled: CompiledVariants<readonly LooseSlotValues[]>,
  config: SlotsConfig,
): (indexes: Int32Array) => Readonly<Record<string, unknown>> {
  const { initial, reduce, combine, finish = asResult } = kind;
  const names = [...config.slots];
  const slotNames: SlotNames = {
    names,
    template: Object.fromEntries(names.map((slot) => [slot, undefined])),
  };
  const basesBySlot = slotValuesOf(names, config.bases, combine);
  const bases = basesBySlot.map(([base]: readonly unknown[]) => base);
  const otherBases = entriesBySlot(
    basesBySlot.map(([, ...others]: readonly unknown[]) => others),
  );
  const { valuesByIndex, compounds } = compileEntries(compiled, names, combine);

  /** Returns the accumulator of each slot, with every base reduced. */
  const initialAccumulators = (): SlotAccumulators => {
    const accumulators = bases.map((base) => initial(base));
    if (otherBases !== undefined) {
      addEntries(accumulators, otherBases, reduce);
    }
    return accumulators;
  };

  return (indexes) => {
    const accumulators = initialAccumulators();
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

export { createSlotsBuilder, noSlotValues };
export type { LooseSlotValues, SlotsKind };
