import {
  array,
  assert,
  boolean,
  constant,
  constantFrom,
  integer,
  oneof,
  option,
  property,
  record,
  subarray,
  tuple,
} from "fast-check";
import { describe, expect, it } from "vitest";
import type { Arbitrary } from "fast-check";

import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
} from "./composition.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type ByName<Value> = Readonly<Record<string, Value>>;

interface Layer<Value> {
  readonly slots: readonly string[];
  readonly base: Value | undefined;
  readonly variants: ByName<ByName<Value>>;
  readonly compoundVariants: readonly {
    readonly variants: ByName<unknown>;
    readonly value: Value;
  }[];
  readonly defaultVariants: ByName<unknown>;
}

interface Case<Value> {
  readonly layers: readonly Layer<Value>[];
  readonly cache: boolean;
  readonly selections: readonly (ByName<unknown> | undefined)[];
}

type SlotValues = ByName<unknown>;
const variantNames = ["size", "tone", "0", "valueOf", "__proto__"];
const optionNames = ["sm", "md", "true", "false", "0", "valueOf"];
const slotNames = ["root", "label", "__proto__"];

function entriesOf<Value>(
  names: readonly string[],
  valueOfName: (name: string) => Arbitrary<Value>,
): Arbitrary<ByName<Value>> {
  const entries = names.map((name) =>
    valueOfName(name).map((value): readonly [string, Value] => [name, value]),
  );
  return tuple(...entries).map(
    (list: readonly (readonly [string, Value])[]): ByName<Value> =>
      Object.fromEntries(list),
  );
}

const optionValue = constantFrom(...optionNames, "x", true, 0, undefined, null);

const selection = subarray([...variantNames, "other"]).chain(
  (named: readonly string[]) => entriesOf(named, () => optionValue),
);

const condition = subarray([...variantNames, "unknown"]).chain(
  (named: readonly string[]) =>
    entriesOf(named, () => oneof(optionValue, array(optionValue))),
);

/** A value that names where it comes from, or `null`, or nothing. */
function valueOf(origin: string): Arbitrary<unknown> {
  return oneof(
    { arbitrary: constant(origin), weight: 6 },
    constantFrom(undefined, null),
  );
}

/** The values of some slots, each naming where it comes from. */
function slotValuesOf(origin: string): Arbitrary<SlotValues> {
  return subarray(slotNames).chain((named: readonly string[]) =>
    entriesOf(named, (slot) => valueOf(`${origin}.${slot}`)),
  );
}

/** Some options of the variant `name`, each with a value from `valueIn`. */
function optionsOf<Value>(
  name: string,
  valueIn: (origin: string) => Arbitrary<Value>,
): Arbitrary<ByName<Value>> {
  return subarray(optionNames).chain((options: readonly string[]) =>
    entriesOf(options, (each) => valueIn(`${name}=${each}`)),
  );
}

/** The config of the layer at `index`, whose values name their origin. */
function layerOf<Value>(
  index: number,
  slotted: boolean,
  valueOfOrigin: (origin: string) => Arbitrary<Value>,
): Arbitrary<Layer<Value>> {
  const valueIn = (name: string): Arbitrary<Value> =>
    valueOfOrigin(`${String(index)}:${name}`);
  const variants = subarray(variantNames).chain((named: readonly string[]) =>
    entriesOf(named, (name) => optionsOf(name, valueIn)),
  );
  const compound = record({ value: valueIn("compound"), variants: condition });
  return record({
    base: option(valueIn("base"), { nil: undefined }),
    compoundVariants: array(compound, { maxLength: 3 }),
    defaultVariants: selection,
    slots: slotted ? subarray(slotNames) : constant([]),
    variants,
  });
}

function caseOf<Value>(
  layer: (index: number) => Arbitrary<Layer<Value>>,
): Arbitrary<Case<Value>> {
  return integer({ max: 3, min: 1 }).chain((count) =>
    record({
      cache: boolean(),
      layers: tuple(
        ...Array.from({ length: count }, (_layer, index) => layer(index)),
      ),
      selections: array(option(selection, { freq: 8, nil: undefined }), {
        maxLength: 8,
        minLength: 1,
      }),
    }),
  );
}

function listOf<Value>(value: Value | undefined): readonly Value[] {
  return value === undefined ? [] : [value];
}

const unique = (names: readonly string[]): readonly string[] => [
  ...new Set(names),
];

function own<Value>(
  values: ByName<Value> | undefined,
  key: string,
): Value | undefined {
  return values !== undefined && Object.hasOwn(values, key)
    ? values[key]
    : undefined;
}

/** The layers as one config, each value made by `toValue` from theirs. */
function flatConfigOf<Value, Flat>(
  layers: readonly Layer<Value>[],
  toValue: (values: readonly Value[]) => Flat,
): Layer<Flat> {
  const names = unique(layers.flatMap((layer) => Object.keys(layer.variants)));
  const optionNamesOf = (name: string): readonly string[] =>
    unique(
      layers.flatMap((layer) => Object.keys(own(layer.variants, name) ?? {})),
    );
  const valuesOf = (name: string, each: string): Flat =>
    toValue(
      layers.flatMap((layer) => listOf(own(own(layer.variants, name), each))),
    );
  const bases = layers.flatMap((layer) => listOf(layer.base));
  return {
    base: bases.length === 0 ? undefined : toValue(bases),
    compoundVariants: layers.flatMap((layer) =>
      layer.compoundVariants.map((compound) => ({
        value: toValue(listOf(compound.value)),
        variants: compound.variants,
      })),
    ),
    defaultVariants: Object.fromEntries(
      layers.flatMap((layer) =>
        Object.entries(layer.defaultVariants).filter(
          ([, each]: readonly [string, unknown]) => each !== undefined,
        ),
      ),
    ),
    slots: unique(layers.flatMap((layer) => layer.slots)),
    variants: Object.fromEntries(
      names.map((name) => [
        name,
        Object.fromEntries(
          optionNamesOf(name).map((each) => [each, valuesOf(name, each)]),
        ),
      ]),
    ),
  };
}

/** The values of each slot in a list of slot values, in order. */
function valuesBySlot(
  values: readonly SlotValues[],
): ByName<readonly unknown[]> {
  return Object.fromEntries(
    slotNames.map((slot) => [
      slot,
      values.flatMap((each) => listOf(own(each, slot))),
    ]),
  );
}

const listKind = {
  finish: (values: readonly unknown[]): readonly unknown[] =>
    Object.freeze(values),
  initial: (base: unknown): readonly unknown[] => listOf(base),
  reduce: (values: readonly unknown[], value: unknown): readonly unknown[] => [
    ...values,
    value,
  ],
};

const concatKind = {
  finish: listKind.finish,
  initial: (base: readonly unknown[] | undefined): readonly unknown[] => [
    ...(base ?? []),
  ],
  reduce: (
    values: readonly unknown[],
    added: readonly unknown[],
  ): readonly unknown[] => [...values, ...added],
};

type LooseRecipe = (selection?: ByName<unknown>) => unknown;

function previousAndFirst<Recipe>(
  recipes: readonly Recipe[],
): readonly Recipe[] {
  return [...recipes.slice(-1), ...recipes.slice(0, 1)];
}

function composedRecipeOf(of: Case<unknown>): LooseRecipe {
  const create = createRecipeKind({ ...listKind, cache: of.cache });
  const recipes: (ComposableKindRecipe<unknown> & LooseRecipe)[] = [];
  for (const layer of of.layers) {
    recipes.push(create({ ...layer, composes: previousAndFirst(recipes) }));
  }
  return recipes.at(-1) ?? create({ variants: {} });
}

function composedSlotRecipeOf(of: Case<SlotValues>): LooseRecipe {
  const create = createSlotRecipeKind({ ...listKind, cache: of.cache });
  const recipes: (ComposableKindSlotRecipe<unknown> & LooseRecipe)[] = [];
  for (const layer of of.layers) {
    recipes.push(create({ ...layer, composes: previousAndFirst(recipes) }));
  }
  return recipes.at(-1) ?? create({ slots: [], variants: {} });
}

/**
 * Checks that the composed recipe of a case returns what the recipe of its
 * flat config returns, and returns the same result again when it does.
 */
function behavesAsOneConfig<Value>(
  composedOf: (of: Case<Value>) => LooseRecipe,
  flatOf: (of: Case<Value>) => LooseRecipe,
): (of: Case<Value>) => void {
  return (of) => {
    const callsOf = (recipe: LooseRecipe): readonly unknown[] =>
      of.selections.map((each) => {
        const result = recipe(each);
        return [result, recipe(each) === result];
      });
    expect(callsOf(composedOf(of))).toStrictEqual(callsOf(flatOf(of)));
  };
}

describe("composing recipes compared with one config", () => {
  it("builds and caches a recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, false, valueOf)),
        behavesAsOneConfig(composedRecipeOf, (of) =>
          createRecipeKind({ ...concatKind, cache: of.cache })(
            flatConfigOf(of.layers, (values) => values),
          ),
        ),
      ),
    );
  });

  it("builds and caches a slot recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, true, slotValuesOf)),
        behavesAsOneConfig(composedSlotRecipeOf, (of) =>
          createSlotRecipeKind({ ...concatKind, cache: of.cache })(
            flatConfigOf(of.layers, valuesBySlot),
          ),
        ),
      ),
    );
  });
});
