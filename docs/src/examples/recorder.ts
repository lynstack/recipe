import type { Style } from "./configs.ts";

type ByName<Value> = Readonly<Record<string, Value>>;

type Operation = "initial" | "reduce" | "finish";

/** A call of a function of the kind while a result is built. */
interface TraceStep {
  readonly operation: Operation;
  /** Where the value comes from in the configs, or undefined for finish. */
  readonly origin: string | undefined;
  readonly value: Style | undefined;
  /** The accumulator after the step. */
  readonly accumulator: Style;
  /** The properties that the step added to the accumulator or changed. */
  readonly changed: readonly string[];
  /** The accumulator that the step changed, as the kind holds it. */
  readonly target: object;
}

/** A value that `combine` made when the recipe was created. */
interface Combination {
  readonly origin: string;
  readonly value: Style;
}

interface Trace {
  readonly combinations: readonly Combination[];
  readonly steps: readonly TraceStep[];
}

/** Where each value of a trace comes from, as the trace names it. */
interface Origins {
  /**
   * Returns where `value` comes from.
   *
   * @throws {Error} When no config of the trace gives `value`.
   */
  readonly of: (value: Style) => string;
  /** Records that `combine` made `combined` from `first` and `second`. */
  readonly combine: (combined: Style, first: Style, second: Style) => string;
}

/** Records the calls of a kind's functions, with the accumulator after each. */
interface Recorder extends Trace {
  readonly record: (
    operation: Operation,
    value: Style | undefined,
    accumulator: Style,
  ) => void;
  readonly combine: (first: Style, second: Style) => Style;
}

function conditionLabel(variants: ByName<unknown>): string {
  return Object.entries(variants)
    .map(
      ([name, option]: readonly [string, unknown]) =>
        `${name}: ${String(option)}`,
    )
    .join(", ");
}

/**
 * Returns the origins of the values that `entries` name.
 *
 * @throws {Error} When two entries name the same value, whose steps a
 *   trace could not tell apart.
 */
function originsOf(entries: readonly (readonly [Style, string])[]): Origins {
  const origins = new Map(entries);
  if (origins.size !== entries.length) {
    throw new Error(
      "Each value of a traced config must be an object of its own",
    );
  }
  const of = (value: Style): string => {
    const origin = origins.get(value);
    if (origin === undefined) {
      throw new Error(`No config of the trace gives ${JSON.stringify(value)}`);
    }
    return origin;
  };
  return {
    combine: (combined, first, second) => {
      const origin = `${of(first)} + ${of(second)}`;
      origins.set(combined, origin);
      return origin;
    },
    of,
  };
}

function changedProperties(previous: Style, next: Style): readonly string[] {
  return Object.keys(next).filter((key) => previous[key] !== next[key]);
}

function recorderOf(origins: Origins): Recorder {
  const steps: TraceStep[] = [];
  const combinations: Combination[] = [];
  const previous = new WeakMap<object, Style>();
  return {
    combinations,
    combine: (first, second) => {
      const value = { ...first, ...second };
      combinations.push({
        origin: origins.combine(value, first, second),
        value,
      });
      return value;
    },
    record: (operation, value, accumulator) => {
      const snapshot = { ...accumulator };
      steps.push({
        accumulator: snapshot,
        changed: changedProperties(previous.get(accumulator) ?? {}, snapshot),
        operation,
        origin:
          operation === "finish" || value === undefined
            ? undefined
            : origins.of(value),
        target: accumulator,
        value,
      });
      previous.set(accumulator, snapshot);
    },
    steps,
  };
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

/**
 * Whether `traced` and `built` are the same result as a page shows it: the
 * same primitives, and objects with the same properties in the same order,
 * frozen alike.
 */
function isSameResult(traced: unknown, built: unknown): boolean {
  if (!isObject(traced) || !isObject(built)) {
    return Object.is(traced, built);
  }
  const keys = Object.keys(traced);
  return (
    Object.isFrozen(traced) === Object.isFrozen(built) &&
    keys.join("\n") === Object.keys(built).join("\n") &&
    keys.every((key) =>
      isSameResult(Reflect.get(traced, key), Reflect.get(built, key)),
    )
  );
}

/**
 * Checks that a trace built the result that the recipe it shows returns.
 *
 * @throws {Error} When the results differ.
 */
function assertSameResult(traced: unknown, built: unknown): void {
  if (!isSameResult(traced, built)) {
    throw new Error(
      `The traced result ${JSON.stringify(traced)} differs from the ` +
        `recipe's ${JSON.stringify(built)}`,
    );
  }
}

export { assertSameResult, conditionLabel, originsOf, recorderOf };
export type { Recorder, Trace, TraceStep };
