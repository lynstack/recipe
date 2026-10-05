import {
  array,
  assert,
  constantFrom,
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
import { twMerge } from "tailwind-merge";

import type { RecipesOptions } from "./create-recipes.js";
import type { SlotClasses } from "./slot-recipe.js";
import { createRecipes } from "./create-recipes.js";

type Classes = SlotClasses<string>;

type ByName<Value> = Readonly<Record<string, Value>>;

interface Variant {
  readonly name: string;
  readonly options: readonly string[];
}

interface Call {
  readonly props: ByName<string | undefined>;
  readonly classNames: Classes;
}

interface Model {
  readonly slots: readonly string[];
  readonly base: Classes;
  readonly variants: ByName<ByName<Classes>>;
  readonly compounds: readonly {
    readonly variants: ByName<readonly string[]>;
    readonly classNames: Classes;
  }[];
  readonly defaults: ByName<string>;
  readonly calls: readonly Call[];
}

const optionSets = [
  ["sm", "valueOf", "constructor", "__proto__"],
  ["true", "false"],
  ["0", "1", "10"],
];

const classes = array(constantFrom("flex", "hidden", "p-2", "p-4", "text-sm"), {
  maxLength: 3,
}).map((list: readonly string[]) => list.join(" "));

function toRecord<Value>(
  list: readonly (readonly [string, Value])[],
): ByName<Value> {
  return Object.fromEntries(list);
}

function entriesOf<Value>(
  names: readonly string[],
  valueOf: (name: string) => Arbitrary<Value>,
): Arbitrary<ByName<Value>> {
  const values = names.map((name) =>
    valueOf(name).map((value): readonly [string, Value] => [name, value]),
  );
  return tuple(...values).map((list: readonly (readonly [string, Value])[]) =>
    toRecord(list),
  );
}

function variantNamed(name: string): Arbitrary<Variant> {
  return constantFrom(...optionSets)
    .chain((options: readonly string[]) => subarray([...options]))
    .map((options: readonly string[]) => ({ name, options }));
}

function modelOf(
  slots: readonly string[],
  variants: readonly Variant[],
): Arbitrary<Model> {
  const someSlots = subarray([...slots]);
  const classesOfSlots = someSlots.chain((named: readonly string[]) =>
    entriesOf(named, () => classes),
  );
  const optionsOf = new Map(
    variants.map((variant) => [variant.name, [...variant.options]]),
  );
  const declared = subarray(
    variants
      .filter((variant) => variant.options.length > 0)
      .map((variant) => variant.name),
  );
  const optionOf = (name: string): Arbitrary<string> =>
    constantFrom(...(optionsOf.get(name) ?? []));
  const selectedOf = (name: string): Arbitrary<string | undefined> =>
    option(oneof(optionOf(name), constantFrom("undeclared")), {
      freq: 4,
      nil: undefined,
    });
  const optionsOfCondition = (name: string): Arbitrary<readonly string[]> =>
    subarray(optionsOf.get(name) ?? []);
  const call = record({
    classNames: classesOfSlots,
    props: declared.chain((named: readonly string[]) =>
      entriesOf(named, selectedOf),
    ),
  });
  const compound = record({
    classNames: classesOfSlots,
    variants: declared.chain((named: readonly string[]) =>
      entriesOf(named, optionsOfCondition),
    ),
  });
  const classesOfOptions = (name: string): Arbitrary<ByName<Classes>> =>
    entriesOf(optionsOf.get(name) ?? [], () => classesOfSlots);
  return record({
    base: classesOfSlots,
    calls: array(call, { maxLength: 4, minLength: 1 }),
    compounds: array(compound, { maxLength: 3 }),
    defaults: declared.chain((named: readonly string[]) =>
      entriesOf(named, optionOf),
    ),
    slots: constantFrom(slots),
    variants: entriesOf(
      variants.map((variant) => variant.name),
      classesOfOptions,
    ),
  });
}

const variantsOfModel = uniqueArray(
  constantFrom(
    "size",
    "constructor",
    "toString",
    "hasOwnProperty",
    "__proto__",
  ),
  { maxLength: 4 },
).chain((names: readonly string[]) =>
  tuple(...names.map((name) => variantNamed(name))),
);

const slotsOfModel = uniqueArray(
  constantFrom("root", "constructor", "toString", "__proto__"),
  {
    minLength: 1,
  },
);

const model = tuple(slotsOfModel, variantsOfModel).chain(
  ([slots, variants]: readonly [readonly string[], readonly Variant[]]) =>
    modelOf(slots, variants),
);

function classOf(classesBySlot: Classes, slot: string): string {
  return Object.hasOwn(classesBySlot, slot) ? (classesBySlot[slot] ?? "") : "";
}

/** Maps each value of `byKey`, keeping its keys, `__proto__` included. */
function mapValues<Value, Mapped>(
  byKey: ByName<Value>,
  map: (value: Value) => Mapped,
): ByName<Mapped> {
  return Object.fromEntries(
    Object.entries(byKey).map(([key, value]: readonly [string, Value]) => [
      key,
      map(value),
    ]),
  );
}

function cvaOfSlot(
  of: Model,
  slot: string,
  options: RecipesOptions,
): (call: Call) => string {
  const variants = mapValues(of.variants, (byOption) =>
    mapValues(byOption, (values) => classOf(values, slot)),
  );
  const recipe = createRecipes(options).cva({
    base: classOf(of.base, slot),
    compoundVariants: of.compounds.map((compound) => ({
      className: classOf(compound.classNames, slot),
      variants: compound.variants,
    })),
    defaultVariants: of.defaults,
    variants,
  });
  return ({ props, classNames }) =>
    recipe({ ...props, className: classOf(classNames, slot) });
}

function returnsWhatEachSlotReturns(
  options: RecipesOptions,
): (of: Model) => void {
  return (of) => {
    const recipe = createRecipes(options).sva({
      base: of.base,
      compoundVariants: of.compounds,
      defaultVariants: of.defaults,
      slots: of.slots,
      variants: of.variants,
    });
    const slotRecipes = of.slots.map(
      (slot) => [slot, cvaOfSlot(of, slot, options)] as const,
    );
    for (const call of [...of.calls, ...of.calls]) {
      const result = recipe({ ...call.props, classNames: call.classNames });
      expect(Object.isFrozen(result)).toBe(true);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(Object.entries(result)).toStrictEqual(
        slotRecipes.map(([slot, slotRecipe]) => [slot, slotRecipe(call)]),
      );
    }
  };
}

describe("slot recipes compared with a recipe for each slot", () => {
  it.each<RecipesOptions>([
    { cache: true },
    { cache: false },
    { cache: true, join: twMerge },
    { cache: false, join: twMerge },
  ])("return the class name of each slot, %o", (options) => {
    assert(property(model, returnsWhatEachSlotReturns(options)));
  });
});
