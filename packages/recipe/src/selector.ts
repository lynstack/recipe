import type { CompiledVariants, SelectedVariants } from "./variants.js";
import { noProps, select, undeclared } from "./variants.js";

/** How a selector computes its results. */
interface SelectorOptions {
  /** Whether to cache the result of each declared selection. */
  readonly cache: boolean;
}

/** Whether `results` holds `result`, read at `key`, even if it is undefined. */
function isCached<Result>(
  results: ReadonlyMap<number, Result>,
  key: number,
  result: Result | undefined,
): result is Result {
  return result !== undefined || results.has(key);
}

/**
 * Returns a function that builds the result of a selection from the option
 * index of each variant, and treats a missing selection as an empty one.
 * With `options.cache`, it builds the result of each declared selection
 * once and caches it by the selection's key.
 */
function createSelector<Result>(
  compiled: CompiledVariants<unknown>,
  build: (indexes: Int32Array) => Result,
  options: SelectorOptions,
): (selected?: SelectedVariants | null) => Result {
  const indexes = new Int32Array(compiled.names.length);
  const results =
    options.cache && compiled.isCacheable
      ? new Map<number, Result>()
      : undefined;

  return (selected) => {
    const key = select(compiled, selected ?? noProps, indexes);
    if (key !== undeclared && results !== undefined) {
      const cachedResult = results.get(key);
      if (isCached(results, key, cachedResult)) {
        return cachedResult;
      }
    }
    const result = build(indexes);
    if (key !== undeclared) {
      results?.set(key, result);
    }
    return result;
  };
}

export { createSelector };
export type { SelectorOptions };
