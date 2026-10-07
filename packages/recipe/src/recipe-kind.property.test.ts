import {
  array,
  assert,
  constant,
  constantFrom,
  integer,
  oneof,
  option,
  property,
  record,
  subarray,
  tuple,
  uniqueArray,
} from "fast-check";
import { describe, expect, it } from "vitest";
import type { Arbitrary } from "fast-check";

import type { RecipeKind } from "./types.js";
import { createRecipeKind } from "./recipe-kind.js";

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

/** The options of a variant, with both boolean options if it names one. */
function declaredOptions(byOption: ByName<unknown>): ReadonlySet<string> {
  const names = Object.keys(byOption);
  return new Set(
    names.some((name) => isBooleanName(name))
      ? [...names, "true", "false"]
      : names,
  );
}

/**
 * The declared option of each variant that `selection` selects, as the
 * docs describe it, and whether every option it selects is declared.
 */
function selectedOf(
  of: Config,
  selection: ByName<unknown> | undefined,
): {
  readonly options: ReadonlyMap<string, string>;
  readonly declared: boolean;
} {
  const options = new Map<string, string>();
  let declared = true;
  for (const [name, byOption] of Object.entries(of.variants)) {
    const names = Object.keys(byOption);
    const isBoolean =
      names.length > 0 && names.every((each) => isBooleanName(each));
    const selected =
      optionName(own(selection, name)) ??
      optionName(own(of.defaultVariants, name)) ??
      (isBoolean ? "false" : undefined);
    if (selected !== undefined && declaredOptions(byOption).has(selected)) {
      options.set(name, selected);
    } else if (selected !== undefined) {
      declared = false;
    }
  }
  return { declared, options };
}

function matches(
  condition: ByName<unknown>,
  options: ReadonlyMap<string, string>,
): boolean {
  return Object.entries(condition).every(
    ([name, value]: readonly [string, unknown]) => {
      const conditionOptions: readonly unknown[] = Array.isArray(value)
        ? value
        : [value];
      const selected = options.get(name);
      return (
        value === undefined ||
        (selected !== undefined &&
          conditionOptions.some((each) => optionName(each) === selected))
      );
    },
  );
}

/** The values that `selection` reduces, base first. */
function expectedValues(
  of: Config,
  selection: ByName<unknown> | undefined,
): readonly unknown[] {
  const { options } = selectedOf(of, selection);
  const optionValues = Object.entries(of.variants).map(
    ([name, byOption]: readonly [string, ByName<unknown>]) =>
      own(byOption, options.get(name) ?? ""),
  );
  const compoundValues = of.compoundVariants
    .filter((compound) => matches(compound.variants, options))
    .map((compound) => compound.value);
  const values = [...optionValues, ...compoundValues];
  return [of.base, ...values.filter((value) => value !== undefined)];
}

function isCacheable(of: Config): boolean {
  const keys = Object.values(of.variants).reduce(
    (product, byOption) => product * (declaredOptions(byOption).size + 1),
    1,
  );
  return keys <= Number.MAX_SAFE_INTEGER;
}

function recipeOf(
  of: Config,
  cache: boolean,
): (selection?: ByName<unknown>) => unknown {
  const kind: RecipeKind<unknown, readonly unknown[], readonly unknown[]> = {
    cache,
    finish: (values) => Object.freeze(values),
    initial: (base) => [base],
    reduce: (values, value) => [...values, value],
  };
  return createRecipeKind(kind)(of);
}

function reducesAsDocumented(cache: boolean): (of: Config) => void {
  return (of) => {
    const recipe = recipeOf(of, cache);
    const selections = [...of.selections, ...of.selections];
    expect(selections.map((selection) => recipe(selection))).toStrictEqual(
      selections.map((selection) => expectedValues(of, selection)),
    );
  };
}

function cachesAsDocumented(cache: boolean): (of: Config) => void {
  return (of) => {
    const recipe = recipeOf(of, cache);
    const results = of.selections.map((selection) => recipe(selection));
    const isCached = of.selections.map(
      (selection) =>
        cache && isCacheable(of) && selectedOf(of, selection).declared,
    );
    const isSame = of.selections.map((selection, index) =>
      Object.is(recipe(selection), results[index]),
    );
    expect(isSame).toStrictEqual(isCached);
    expect(results.every((result) => Object.isFrozen(result))).toBe(true);
  };
}

const configs = { narrow: narrowConfig, wide: wideConfig };

describe("recipe kinds compared with their documented behavior", () => {
  it.each([
    { cache: true, config: "narrow", name: "with the cache" },
    { cache: false, config: "narrow", name: "without the cache" },
    { cache: true, config: "wide", name: "with too many keys to cache" },
  ] as const)(
    "reduce and cache the values of a selection, $name",
    ({ cache, config }) => {
      assert(property(configs[config], reducesAsDocumented(cache)));
      assert(property(configs[config], cachesAsDocumented(cache)));
    },
  );
});
