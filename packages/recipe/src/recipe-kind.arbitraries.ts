import {
  array,
  constant,
  constantFrom,
  integer,
  oneof,
  option,
  record,
  subarray,
  tuple,
  uniqueArray,
} from "fast-check";
import type { Arbitrary } from "fast-check";

/**
 * The configs and calls that the property tests of recipe kinds generate,
 * and how the docs describe the option names that they read.
 */

type ByName<Value> = Readonly<Record<string, Value>>;

interface Config {
  readonly base: unknown;
  readonly variants: ByName<ByName<unknown>>;
  readonly compoundVariants: readonly {
    readonly variants: ByName<unknown>;
    readonly value: unknown;
  }[];
  readonly defaultVariants: ByName<unknown>;
  readonly selections: readonly (ByName<unknown> | undefined)[];
}

const optionNames = ["sm", "md", "true", "false", "0", "1", "10", "valueOf"];

function entriesOf<Value>(
  names: readonly string[],
  valueOfName: (name: string) => Arbitrary<Value>,
): Arbitrary<ByName<Value>> {
  const values = names.map((name) =>
    valueOfName(name).map((value): readonly [string, Value] => [name, value]),
  );
  return tuple(...values).map(
    (list: readonly (readonly [string, Value])[]): ByName<Value> =>
      Object.fromEntries(list),
  );
}

/** The forms in which a selection or a condition may name `name`. */
function formsOf(name: string): readonly unknown[] {
  if (name === "true" || name === "false") {
    return [name, name === "true"];
  }
  return /^\d+$/u.test(name) ? [name, Number(name)] : [name];
}

function optionValue(options: readonly string[]): Arbitrary<unknown> {
  const named = constantFrom(...options, "sm", "undeclared");
  const forms = named.chain((name) => constantFrom(...formsOf(name)));
  const others = constantFrom(undefined, null, {}, []);
  return oneof(
    { arbitrary: forms, weight: 8 },
    { arbitrary: others, weight: 1 },
  );
}

/** A value that names where it comes from, or `null`, or nothing. */
function valueOf(origin: string): Arbitrary<unknown> {
  return oneof(
    { arbitrary: constant(origin), weight: 6 },
    constantFrom(undefined, null),
  );
}

function configOf(
  optionsByName: ReadonlyMap<string, readonly string[]>,
): Arbitrary<Config> {
  const names = [...optionsByName.keys()];
  const optionsOf = (name: string): readonly string[] =>
    optionsByName.get(name) ?? [];
  const selection = subarray([...names, "other"]).chain(
    (named: readonly string[]) =>
      entriesOf(named, (name) => optionValue(optionsOf(name))),
  );
  const conditionOf = (name: string): Arbitrary<unknown> => {
    const values = optionValue(optionsOf(name));
    return oneof(values, array(values, { maxLength: 3 }));
  };
  const compound = record({
    value: valueOf("compound"),
    variants: subarray([...names, "unknown"]).chain(
      (named: readonly string[]) => entriesOf(named, conditionOf),
    ),
  });
  const optionValues = (name: string): Arbitrary<ByName<unknown>> =>
    entriesOf(optionsOf(name), (each) => valueOf(`${name}=${each}`));
  return record({
    base: valueOf("base"),
    compoundVariants: array(compound, { maxLength: 4 }),
    defaultVariants: selection,
    selections: array(option(selection, { freq: 10, nil: undefined }), {
      maxLength: 12,
      minLength: 1,
    }),
    variants: entriesOf(names, optionValues),
  });
}

function configsOf(
  variants: readonly string[],
  sizes: { readonly minLength: number; readonly maxLength: number },
): Arbitrary<Config> {
  const options = uniqueArray(constantFrom(...optionNames), sizes);
  return tuple(...variants.map(() => options)).chain(
    (optionsOfEach: readonly (readonly string[])[]) =>
      configOf(
        new Map(
          variants.map((name, index) => [name, optionsOfEach[index] ?? []]),
        ),
      ),
  );
}

const narrowConfig = uniqueArray(
  constantFrom("size", "tone", "0", "valueOf", "hasOwnProperty", "__proto__"),
  { maxLength: 5 },
).chain((variants: readonly string[]) =>
  configsOf(variants, { maxLength: 4, minLength: 0 }),
);

/** Configs whose selections have more keys than there are safe integers. */
const wideConfig = integer({ max: 24, min: 18 }).chain((count) =>
  configsOf(
    Array.from({ length: count }, (_value, index) => `v${String(index)}`),
    { maxLength: 8, minLength: 6 },
  ),
);

const isBooleanName = (name: string): boolean =>
  name === "true" || name === "false";

function optionName(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : undefined;
}

function own<Value>(
  values: ByName<Value> | undefined,
  key: string,
): Value | undefined {
  return values !== undefined && Object.hasOwn(values, key)
    ? values[key]
    : undefined;
}

export {
  isBooleanName,
  narrowConfig,
  optionName,
  optionNames,
  own,
  wideConfig,
};
export type { ByName, Config };
