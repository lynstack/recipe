import type { CompiledVariants, Compound } from "./variants.js";
import { noOption } from "./variants.js";

/** Whether every condition of `compound` matches the selected indexes. */
function matches(compound: Compound<unknown>, indexes: Int32Array): boolean {
  for (const [variant, matchingIndexes] of compound.conditions) {
    if (!matchingIndexes.includes(indexes[variant] ?? noOption)) {
      return false;
    }
  }
  return true;
}

/** Reduces the values of a selection to an accumulator. */
interface Reducer<Value, Accumulator> {
  /** Returns the accumulator to start from. */
  readonly initial: () => Accumulator;
  /** Adds a value to the accumulator and returns the accumulator. */
  readonly reduce: (accumulator: Accumulator, value: Value) => Accumulator;
}

/**
 * Reduces the values that apply to a selection, in order of precedence: the
 * value of each variant's option, then the value of each matching compound
 * variant. A value that is undefined adds nothing.
 */
function reduceValues<Value, Accumulator>(
  compiled: CompiledVariants<Value | undefined>,
  indexes: Int32Array,
  reducer: Reducer<Value, Accumulator>,
): Accumulator {
  const { reduce } = reducer;
  let accumulator = reducer.initial();
  for (let variant = 0; variant < compiled.valuesByIndex.length; variant += 1) {
    const value =
      compiled.valuesByIndex[variant]?.[indexes[variant] ?? noOption];
    if (value !== undefined) {
      accumulator = reduce(accumulator, value);
    }
  }
  for (const compound of compiled.compounds) {
    if (compound.value !== undefined && matches(compound, indexes)) {
      accumulator = reduce(accumulator, compound.value);
    }
  }
  return accumulator;
}

/**
 * Reduces the values that apply to a selection, as {@link reduceValues}
 * does, when each option and compound variant has a list of values, which
 * are reduced in order.
 */
function reduceValueLists<Value, Accumulator>(
  compiled: CompiledVariants<readonly Value[]>,
  indexes: Int32Array,
  reducer: Reducer<Value, Accumulator>,
): Accumulator {
  const { reduce } = reducer;
  let accumulator = reducer.initial();
  for (let variant = 0; variant < compiled.valuesByIndex.length; variant += 1) {
    const values =
      compiled.valuesByIndex[variant]?.[indexes[variant] ?? noOption];
    accumulator = reduceEach(accumulator, values ?? [], reduce);
  }
  for (const compound of compiled.compounds) {
    if (matches(compound, indexes)) {
      accumulator = reduceEach(accumulator, compound.value, reduce);
    }
  }
  return accumulator;
}

/** Reduces `values` into `accumulator`, in order. */
function reduceEach<Value, Accumulator>(
  accumulator: Accumulator,
  values: readonly Value[],
  reduce: Reducer<Value, Accumulator>["reduce"],
): Accumulator {
  let result = accumulator;
  for (const value of values) {
    result = reduce(result, value);
  }
  return result;
}

export { matches, reduceEach, reduceValueLists, reduceValues };
