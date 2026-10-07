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
} from "@lynstack/recipe";

import type { ByName } from "./style.arbitraries.js";
import type { NativeStyle } from "./types.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";
import { entriesOf } from "./style.arbitraries.js";

interface Style {
  readonly color?: string;
  readonly height?: number | undefined;
  readonly opacity?: number;
}

type SlotStyles = ByName<Style>;

interface Layer<Styles> {
  readonly slots: readonly string[];
  readonly base: Styles | undefined;
  readonly variants: ByName<ByName<Styles>>;
  readonly compoundVariants: readonly {
    readonly variants: ByName<string | readonly string[] | undefined>;
    readonly styles: Styles;
  }[];
  readonly defaultVariants: ByName<string>;
}

interface Case<Styles> {
  readonly layers: readonly Layer<Styles>[];
  readonly cache: boolean;
  readonly selections: readonly (ByName<string | undefined> | undefined)[];
}

const variantNames = ["size", "tone", "0", "valueOf", "__proto__"];
const optionNames = ["sm", "md", "true", "false", "0", "valueOf"];
const slotNames = ["root", "label", "__proto__"];

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

const height = option(integer({ max: 64, min: 0 }), { nil: undefined });

/** A style whose color names where it is declared. */
function styleOf(origin: string): Arbitrary<Style> {
  const color = constant(origin);
  const opacity = constantFrom(0, 0.5, 1);
  return record({ color, height, opacity }, { requiredKeys: [] });
}

function slotStylesOf(origin: string): Arbitrary<SlotStyles> {
  return subarray(slotNames).chain((named: readonly string[]) =>
    entriesOf(named, (slot) => styleOf(`${origin}.${slot}`)),
  );
}

function layerOf<Styles>(
  index: number,
  slotted: boolean,
  stylesOfOrigin: (origin: string) => Arbitrary<Styles>,
): Arbitrary<Layer<Styles>> {
  const stylesIn = (name: string): Arbitrary<Styles> =>
    stylesOfOrigin(`${String(index)}:${name}`);
  const optionsOf = (name: string): Arbitrary<ByName<Styles>> =>
    subarray(optionNames).chain((options: readonly string[]) =>
      entriesOf(options, (each) => stylesIn(`${name}=${each}`)),
    );
  const variants = subarray(variantNames).chain((named: readonly string[]) =>
    entriesOf(named, optionsOf),
  );
  const compound = record({
    styles: stylesIn("compound"),
    variants: condition,
  });
  return record({
    base: option(stylesIn("base"), { nil: undefined }),
    compoundVariants: array(compound, { maxLength: 3 }),
    defaultVariants: defaults,
    slots: slotted ? subarray(slotNames) : constant([]),
    variants,
  });
}

function caseOf<Styles>(
  layer: (index: number) => Arbitrary<Layer<Styles>>,
): Arbitrary<Case<Styles>> {
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

const listOf = <Value>(value: Value | undefined): readonly Value[] =>
  value === undefined ? [] : [value];

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

/** The layers as one config, each style merged by `merge` from theirs. */
function flatConfigOf<Styles>(
  layers: readonly Layer<Styles>[],
  merge: (styles: readonly Styles[]) => Styles,
): Layer<Styles> {
  const names = unique(layers.flatMap((layer) => Object.keys(layer.variants)));
  const optionNamesOf = (name: string): readonly string[] =>
    unique(
      layers.flatMap((layer) => Object.keys(own(layer.variants, name) ?? {})),
    );
  const stylesOf = (name: string, each: string): Styles =>
    merge(
      layers.flatMap((layer) => listOf(own(own(layer.variants, name), each))),
    );
  const bases = layers.flatMap((layer) => listOf(layer.base));
  return {
    base: bases.length === 0 ? undefined : merge(bases),
    compoundVariants: layers.flatMap((layer) => layer.compoundVariants),
    defaultVariants: Object.fromEntries(
      layers.flatMap((layer) => Object.entries(layer.defaultVariants)),
    ),
    slots: unique(layers.flatMap((layer) => layer.slots)),
    variants: Object.fromEntries(
      names.map((name) => [
        name,
        Object.fromEntries(
          optionNamesOf(name).map((each) => [each, stylesOf(name, each)]),
        ),
      ]),
    ),
  };
}

function mergeStyles(styles: readonly Style[]): Style {
  const merged: { -readonly [Key in keyof Style]: Style[Key] } = {};
  for (const style of styles) {
    Object.assign(merged, style);
  }
  return merged;
}

const mergeSlotStyles = (styles: readonly SlotStyles[]): SlotStyles =>
  Object.fromEntries(
    unique(styles.flatMap((each) => Object.keys(each))).map((slot) => [
      slot,
      mergeStyles(styles.flatMap((each) => listOf(own(each, slot)))),
    ]),
  );

type LooseRecipe = (props?: ByName<string | undefined>) => unknown;

/**
 * Returns the style recipe of the last layer of a case, each layer
 * composing the recipes of the previous layer and of the first, or of its
 * flat config.
 */
function styleRecipeOf(of: Case<Style>, flat: boolean): LooseRecipe {
  const recipes: (ComposableKindRecipe<NativeStyle> & LooseRecipe)[] = [];
  for (const layer of flat
    ? [flatConfigOf(of.layers, mergeStyles)]
    : of.layers) {
    recipes.push(
      createStyleRecipe({
        ...layer,
        cache: of.cache,
        composes: [...recipes.slice(-1), ...recipes.slice(0, 1)],
        compoundVariants: layer.compoundVariants.map((compound) => ({
          style: compound.styles,
          variants: compound.variants,
        })),
      }),
    );
  }
  return recipes.at(-1) ?? createStyleRecipe({ variants: {} });
}

/** Returns the slot style recipe of a case, as `styleRecipeOf` does. */
function slotStyleRecipeOf(of: Case<SlotStyles>, flat: boolean): LooseRecipe {
  const recipes: (ComposableKindSlotRecipe<NativeStyle> & LooseRecipe)[] = [];
  for (const layer of flat
    ? [flatConfigOf(of.layers, mergeSlotStyles)]
    : of.layers) {
    recipes.push(
      createSlotStyleRecipe({
        ...layer,
        cache: of.cache,
        composes: [...recipes.slice(-1), ...recipes.slice(0, 1)],
        compoundVariants: layer.compoundVariants.map((compound) => ({
          styles: compound.styles,
          variants: compound.variants,
        })),
      }),
    );
  }
  return recipes.at(-1) ?? createSlotStyleRecipe({ slots: [], variants: {} });
}

/** The entries of a style, or of each slot of slot styles, in order. */
function entriesIn(result: unknown): unknown {
  return typeof result === "object" && result !== null
    ? Object.entries(result).map(([key, value]: readonly [string, unknown]) => [
        key,
        entriesIn(value),
      ])
    : result;
}

/**
 * Checks that the composed recipe of a case returns what the recipe of its
 * flat config returns, in the same order, and returns the same style again
 * when it does.
 */
function behavesAsOneConfig<Styles>(
  recipeOf: (of: Case<Styles>, flat: boolean) => LooseRecipe,
): (of: Case<Styles>) => void {
  return (of) => {
    const callsOf = (recipe: LooseRecipe): readonly unknown[] =>
      of.selections.map((each) => {
        const result = recipe(each);
        return [entriesIn(result), recipe(each) === result];
      });
    expect(callsOf(recipeOf(of, false))).toStrictEqual(
      callsOf(recipeOf(of, true)),
    );
  };
}

describe("composing style recipes compared with one config", () => {
  it("builds and caches a style recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, false, styleOf)),
        behavesAsOneConfig(styleRecipeOf),
      ),
    );
  });

  it("builds and caches a slot style recipe as one config would", () => {
    assert(
      property(
        caseOf((index) => layerOf(index, true, slotStylesOf)),
        behavesAsOneConfig(slotStyleRecipeOf),
      ),
    );
  });
});
