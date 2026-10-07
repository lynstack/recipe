import { assert, property } from "fast-check";
import { describe, expect, it } from "vitest";
import type { Arbitrary } from "fast-check";

import type { ByName, Case } from "./compose.arbitraries.js";
import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
} from "./composition.js";
import {
  caseOf,
  flatConfigOf,
  layerOf,
  listOf,
  slotValuesOf,
  valueOf,
  valuesBySlot,
} from "./compose.arbitraries.js";
import type { RecipeKind } from "./types.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

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

/** A list of values, or nothing: the value of a kind that combines. */
type List = readonly unknown[] | undefined;

/**
 * Returns a value that the engine passed to `combine`, which it never
 * passes `undefined`, the value of an option that adds nothing.
 */
function combined(list: List): readonly unknown[] {
  if (list === undefined) {
    throw new TypeError("The engine combined an undefined value");
  }
  return list;
}

const combiningKind = {
  combine: (first: List, second: List): List => [
    ...combined(first),
    ...combined(second),
  ],
  finish: listKind.finish,
  initial: (base: List): readonly unknown[] => [...(base ?? [])],
  reduce: (values: readonly unknown[], added: List): readonly unknown[] => [
    ...values,
    ...(added ?? []),
  ],
};

/** A value of `valueOf`, in a list of its own. */
function listValueOf(origin: string): Arbitrary<List> {
  return valueOf(origin).map((value) =>
    value === undefined ? undefined : [value],
  );
}

/** The values of some slots of `slotValuesOf`, each in a list of its own. */
function listSlotValuesOf(origin: string): Arbitrary<ByName<List>> {
  return slotValuesOf(origin).map((values) =>
    Object.fromEntries(
      Object.entries(values).map(
        ([slot, value]: readonly [string, unknown]) => [
          slot,
          value === undefined ? undefined : [value],
        ],
      ),
    ),
  );
}

/** The values of each slot in a list of slot values, as one list. */
function concatenatedBySlot(
  values: readonly ByName<List>[],
): ByName<readonly unknown[]> {
  return Object.fromEntries(
    Object.entries(valuesBySlot(values)).map(
      ([slot, lists]: readonly [string, readonly unknown[]]) => [
        slot,
        lists.flat(),
      ],
    ),
  );
}

type LooseRecipe = ((selection?: ByName<unknown>) => unknown) & {
  readonly variantKeys: readonly string[];
  readonly variantOptions: ByName<readonly string[]>;
  readonly defaultVariants: ByName<string>;
};

function previousAndFirst<Recipe>(
  recipes: readonly Recipe[],
): readonly Recipe[] {
  return [...recipes.slice(-1), ...recipes.slice(0, 1)];
}

/** Returns the recipe of the last layer of a case, of kind `kind`. */
function composedRecipeOf<Value>(
  kind: RecipeKind<Value, readonly unknown[], readonly unknown[]>,
): (of: Case<Value>) => LooseRecipe {
  return (of) => {
    const create = createRecipeKind({ ...kind, cache: of.cache });
    const recipes: (ComposableKindRecipe<Value> & LooseRecipe)[] = [];
    for (const layer of of.layers) {
      recipes.push(create({ ...layer, composes: previousAndFirst(recipes) }));
    }
    return recipes.at(-1) ?? create({ variants: {} });
  };
}

/** Returns the slot recipe of the last layer of a case, of kind `kind`. */
function composedSlotRecipeOf<Value>(
  kind: RecipeKind<Value, readonly unknown[], readonly unknown[]>,
): (of: Case<ByName<Value>>) => LooseRecipe {
  return (of) => {
    const create = createSlotRecipeKind({ ...kind, cache: of.cache });
    const recipes: (ComposableKindSlotRecipe<Value> & LooseRecipe)[] = [];
    for (const layer of of.layers) {
      recipes.push(create({ ...layer, composes: previousAndFirst(recipes) }));
    }
    return recipes.at(-1) ?? create({ slots: [], variants: {} });
  };
}

const composedListRecipe = composedRecipeOf(listKind);
const composedListSlotRecipe = composedSlotRecipeOf(listKind);
const composedCombiningRecipe = composedRecipeOf(combiningKind);
const composedCombiningSlotRecipe = composedSlotRecipeOf(combiningKind);

/**
 * Checks that the composed recipe of a case has the variants, options, and
 * defaults of the recipe of its flat config, returns what it returns, and
 * returns the same result again when it does.
 */
function behavesAsOneConfig<Value>(
  composedOf: (of: Case<Value>) => LooseRecipe,
  flatOf: (of: Case<Value>) => LooseRecipe,
): (of: Case<Value>) => void {
  return (of) => {
    const callsOf = (recipe: LooseRecipe): readonly unknown[] => [
      recipe.variantKeys,
      recipe.variantOptions,
      recipe.defaultVariants,
      ...of.selections.map((each) => {
        const result = recipe(each);
        return [result, recipe(each) === result];
      }),
    ];
    expect(callsOf(composedOf(of))).toStrictEqual(callsOf(flatOf(of)));
  };
}

describe("composing recipes compared with one config", () => {
  it("builds and caches a recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, false, valueOf)),
        behavesAsOneConfig(composedListRecipe, (of) =>
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
        behavesAsOneConfig(composedListSlotRecipe, (of) =>
          createSlotRecipeKind({ ...concatKind, cache: of.cache })(
            flatConfigOf(of.layers, valuesBySlot),
          ),
        ),
      ),
    );
  });

  it("builds and caches a recipe whose kind combines values as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, false, listValueOf)),
        behavesAsOneConfig(composedCombiningRecipe, (of) =>
          createRecipeKind({ ...concatKind, cache: of.cache })(
            flatConfigOf(of.layers, (values) => values.flat()),
          ),
        ),
      ),
    );
  });

  it("builds and caches a slot recipe whose kind combines values as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, true, listSlotValuesOf)),
        behavesAsOneConfig(composedCombiningSlotRecipe, (of) =>
          createSlotRecipeKind({ ...concatKind, cache: of.cache })(
            flatConfigOf(of.layers, concatenatedBySlot),
          ),
        ),
      ),
    );
  });
});
