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
import { twMerge } from "tailwind-merge";

import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
} from "@lynstack/recipe";

import { createRecipes } from "./create-recipes.js";

type ByName<Value> = Readonly<Record<string, Value>>;

type SlotClasses = ByName<string>;

interface Layer<Classes> {
  readonly slots: readonly string[];
  readonly base: Classes | undefined;
  readonly variants: ByName<ByName<Classes>>;
  readonly compoundVariants: readonly {
    readonly variants: ByName<string | readonly string[] | undefined>;
    readonly classes: Classes;
  }[];
  readonly defaultVariants: ByName<string>;
}

interface Case<Classes> {
  readonly layers: readonly Layer<Classes>[];
  readonly cache: boolean;
  readonly merges: boolean;
  readonly selections: readonly (Selection | undefined)[];
}

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

const optionNameValue = constantFrom(...optionNames, "x");

const optionValue = option(optionNameValue, { nil: undefined });

const selection = subarray([...variantNames, "other"]).chain(
  (named: readonly string[]) => entriesOf(named, () => optionValue),
);

const defaults = subarray([...variantNames, "other"]).chain(
  (named: readonly string[]) => entriesOf(named, () => optionNameValue),
);

const condition = subarray([...variantNames, "unknown"]).chain(
  (named: readonly string[]) =>
    entriesOf(named, () => oneof(optionValue, array(optionNameValue))),
);

function classOf(origin: string): Arbitrary<string> {
  return constantFrom(origin, origin, origin, "");
}

function slotClassesOf(origin: string): Arbitrary<SlotClasses> {
  return subarray(slotNames).chain((named: readonly string[]) =>
    entriesOf(named, (slot) => classOf(`${origin}.${slot}`)),
  );
}

function layerOf<Classes>(
  index: number,
  slotted: boolean,
  classesOfOrigin: (origin: string) => Arbitrary<Classes>,
): Arbitrary<Layer<Classes>> {
  const classesIn = (name: string): Arbitrary<Classes> =>
    classesOfOrigin(`${String(index)}:${name}`);
  const optionsOf = (name: string): Arbitrary<ByName<Classes>> =>
    subarray(optionNames).chain((options: readonly string[]) =>
      entriesOf(options, (each) => classesIn(`${name}=${each}`)),
    );
  const variants = subarray(variantNames).chain((named: readonly string[]) =>
    entriesOf(named, optionsOf),
  );
  const compound = record({
    classes: classesIn("compound"),
    variants: condition,
  });
  return record({
    base: option(classesIn("base"), { nil: undefined }),
    compoundVariants: array(compound, { maxLength: 3 }),
    defaultVariants: defaults,
    slots: slotted ? subarray(slotNames) : constant([]),
    variants,
  });
}

function caseOf<Classes>(
  layer: (index: number) => Arbitrary<Layer<Classes>>,
): Arbitrary<Case<Classes>> {
  return integer({ max: 3, min: 1 }).chain((count) =>
    record({
      cache: boolean(),
      layers: tuple(
        ...Array.from({ length: count }, (_layer, index) => layer(index)),
      ),
      merges: boolean(),
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

/** The layers as one config, each classes made by `join` from theirs. */
function flatConfigOf<Classes>(
  layers: readonly Layer<Classes>[],
  join: (classes: readonly Classes[]) => Classes,
): Layer<Classes> {
  const names = unique(layers.flatMap((layer) => Object.keys(layer.variants)));
  const optionNamesOf = (name: string): readonly string[] =>
    unique(
      layers.flatMap((layer) => Object.keys(own(layer.variants, name) ?? {})),
    );
  const classesOf = (name: string, each: string): Classes =>
    join(
      layers.flatMap((layer) => listOf(own(own(layer.variants, name), each))),
    );
  const bases = layers.flatMap((layer) => listOf(layer.base));
  return {
    base: bases.length === 0 ? undefined : join(bases),
    compoundVariants: layers.flatMap((layer) => layer.compoundVariants),
    defaultVariants: Object.fromEntries(
      layers.flatMap((layer) => Object.entries(layer.defaultVariants)),
    ),
    slots: unique(layers.flatMap((layer) => layer.slots)),
    variants: Object.fromEntries(
      names.map((name) => [
        name,
        Object.fromEntries(
          optionNamesOf(name).map((each) => [each, classesOf(name, each)]),
        ),
      ]),
    ),
  };
}

const joinClasses = (classes: readonly string[]): string =>
  classes.filter((each) => each !== "").join(" ");

const joinSlotClasses = (classes: readonly SlotClasses[]): SlotClasses =>
  Object.fromEntries(
    slotNames.map((slot) => [
      slot,
      joinClasses(classes.flatMap((each) => listOf(own(each, slot)))),
    ]),
  );

type Selection = ByName<string | undefined>;
type LooseRecipe = (props?: Selection) => unknown;

const recipesOf = (of: Case<unknown>): ReturnType<typeof createRecipes> =>
  createRecipes({ cache: of.cache, ...(of.merges ? { join: twMerge } : {}) });

function previousAndFirst<Recipe>(
  recipes: readonly Recipe[],
): readonly Recipe[] {
  return [...recipes.slice(-1), ...recipes.slice(0, 1)];
}

function composedRecipeOf(of: Case<string>): LooseRecipe {
  const { cva } = recipesOf(of);
  const recipes: (ComposableKindRecipe<string> & LooseRecipe)[] = [];
  for (const layer of of.layers) {
    recipes.push(
      cva({
        ...layer,
        compoundVariants: layer.compoundVariants.map((compound) => ({
          className: compound.classes,
          variants: compound.variants,
        })),
        composes: previousAndFirst(recipes),
      }),
    );
  }
  return recipes.at(-1) ?? cva({ variants: {} });
}

function composedSlotRecipeOf(of: Case<SlotClasses>): LooseRecipe {
  const { sva } = recipesOf(of);
  const recipes: (ComposableKindSlotRecipe<string> & LooseRecipe)[] = [];
  for (const layer of of.layers) {
    recipes.push(
      sva({
        ...layer,
        compoundVariants: layer.compoundVariants.map((compound) => ({
          classNames: compound.classes,
          variants: compound.variants,
        })),
        composes: previousAndFirst(recipes),
      }),
    );
  }
  return recipes.at(-1) ?? sva({ slots: [], variants: {} });
}

/**
 * Checks that the composed recipe of a case returns what the recipe of its
 * flat config returns, and returns the same result again when it does.
 */
function behavesAsOneConfig<Classes>(
  composedOf: (of: Case<Classes>) => LooseRecipe,
  flatOf: (of: Case<Classes>) => LooseRecipe,
): (of: Case<Classes>) => void {
  return (of) => {
    const callsOf = (recipe: LooseRecipe): readonly unknown[] =>
      of.selections.map((each) => {
        const result = recipe(each);
        return [result, recipe(each) === result];
      });
    expect(callsOf(composedOf(of))).toStrictEqual(callsOf(flatOf(of)));
  };
}

describe("composing class name recipes compared with one config", () => {
  it("builds and caches a recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, false, classOf)),
        behavesAsOneConfig(composedRecipeOf, (of) => {
          const flat = flatConfigOf(of.layers, joinClasses);
          return recipesOf(of).cva({
            ...flat,
            compoundVariants: flat.compoundVariants.map((compound) => ({
              className: compound.classes,
              variants: compound.variants,
            })),
          });
        }),
      ),
    );
  });

  it("builds and caches a slot recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, true, slotClassesOf)),
        behavesAsOneConfig(composedSlotRecipeOf, (of) => {
          const flat = flatConfigOf(of.layers, joinSlotClasses);
          return recipesOf(of).sva({
            ...flat,
            compoundVariants: flat.compoundVariants.map((compound) => ({
              classNames: compound.classes,
              variants: compound.variants,
            })),
          });
        }),
      ),
    );
  });
});
