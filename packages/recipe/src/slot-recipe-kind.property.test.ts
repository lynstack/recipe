import {
  array,
  assert,
  constant,
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

import type { RecipeKind } from "./recipe-kind.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type ByName<Value> = Readonly<Record<string, Value>>;

interface Config {
  readonly slots: readonly string[];
  readonly base: ByName<unknown>;
  readonly variants: ByName<ByName<ByName<unknown>>>;
  readonly compoundVariants: readonly {
    readonly variants: ByName<unknown>;
    readonly value: ByName<unknown>;
  }[];
  readonly defaultVariants: ByName<unknown>;
  readonly selections: readonly (ByName<unknown> | undefined)[];
}

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

function configOf(
  slots: readonly string[],
  variants: ReadonlyMap<string, readonly string[]>,
): Arbitrary<Config> {
  const names = [...variants.keys()];
  const optionsOf = (name: string): readonly string[] =>
    variants.get(name) ?? [];
  const valuesOf = (origin: string): Arbitrary<ByName<unknown>> =>
    subarray([...slots]).chain((named: readonly string[]) =>
      entriesOf(named, (slot) =>
        oneof(constant(`${origin}:${slot}`), constantFrom(undefined, null)),
      ),
    );
  const optionOf = (name: string): Arbitrary<string> =>
    constantFrom(...optionsOf(name), "undeclared");
  const selection = subarray(names).chain((named: readonly string[]) =>
    entriesOf(named, optionOf),
  );
  const conditionOf = (name: string): Arbitrary<unknown> =>
    oneof(optionOf(name), subarray([...optionsOf(name)]));
  const compound = record({
    value: valuesOf("compound"),
    variants: subarray(names).chain((named: readonly string[]) =>
      entriesOf(named, conditionOf),
    ),
  });
  const optionValues = (name: string): Arbitrary<ByName<ByName<unknown>>> =>
    entriesOf(optionsOf(name), (each) => valuesOf(`${name}=${each}`));
  return record({
    base: valuesOf("base"),
    compoundVariants: array(compound, { maxLength: 4 }),
    defaultVariants: selection,
    selections: array(option(selection, { freq: 10, nil: undefined }), {
      maxLength: 8,
      minLength: 1,
    }),
    slots: constant(slots),
    variants: entriesOf(names, optionValues),
  });
}

const optionSets = [
  ["sm", "md", "valueOf"],
  ["true", "false"],
  ["0", "1"],
];

const slotsOfConfig = uniqueArray(
  constantFrom("root", "icon", "constructor", "toString", "hasOwnProperty"),
  { minLength: 1 },
);

const variantsOfConfig = uniqueArray(
  constantFrom("size", "tone", "0", "valueOf"),
  { maxLength: 4 },
).chain((names: readonly string[]) =>
  tuple(
    ...names.map((name) =>
      constantFrom(...optionSets)
        .chain((options: readonly string[]) => subarray([...options]))
        .map(
          (
            options: readonly string[],
          ): readonly [string, readonly string[]] => [name, options],
        ),
    ),
  ),
);

const config = tuple(slotsOfConfig, variantsOfConfig).chain(
  ([slots, variants]: readonly [
    readonly string[],
    readonly (readonly [string, readonly string[]])[],
  ]) => configOf(slots, new Map(variants)),
);

function own<Value>(values: ByName<Value>, key: string): Value | undefined {
  return Object.hasOwn(values, key) ? values[key] : undefined;
}

function kindOf(
  cache: boolean,
): RecipeKind<unknown, readonly unknown[], readonly unknown[]> {
  return {
    cache,
    finish: (values) => Object.freeze(values),
    initial: (base) => [base],
    reduce: (values, value) => [...values, value],
  };
}

/** The recipe of `of` that holds only the values of `slot`. */
function recipeOfSlot(
  of: Config,
  slot: string,
  cache: boolean,
): (selection?: ByName<unknown>) => unknown {
  const variants: Record<string, ByName<unknown>> = {};
  for (const [name, byOption] of Object.entries(of.variants)) {
    const valueByOption: Record<string, unknown> = {};
    for (const [optionName, values] of Object.entries(byOption)) {
      valueByOption[optionName] = own(values, slot);
    }
    variants[name] = valueByOption;
  }
  return createRecipeKind(kindOf(cache))({
    base: own(of.base, slot),
    compoundVariants: of.compoundVariants.map((compound) => ({
      value: own(compound.value, slot),
      variants: compound.variants,
    })),
    defaultVariants: of.defaultVariants,
    variants,
  });
}

function returnsTheRecipeOfEachSlot(cache: boolean): (of: Config) => void {
  return (of) => {
    const slotRecipe = createSlotRecipeKind(kindOf(cache))(of);
    const recipes = of.slots.map(
      (slot) => [slot, recipeOfSlot(of, slot, cache)] as const,
    );
    for (const selection of of.selections) {
      const result = slotRecipe(selection);
      expect(Object.isFrozen(result)).toBe(true);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
      expect(Object.entries(result)).toStrictEqual(
        recipes.map(([slot, recipe]) => [slot, recipe(selection)]),
      );
      expect(Object.is(slotRecipe(selection), result)).toBe(
        recipes.every(([, recipe]) =>
          Object.is(recipe(selection), recipe(selection)),
        ),
      );
    }
  };
}

describe("slot recipe kinds compared with a recipe for each slot", () => {
  it.each([true, false])(
    "reduce the values of each slot, cache: %s",
    (cache) => {
      assert(property(config, returnsTheRecipeOfEachSlot(cache)));
    },
  );
});
