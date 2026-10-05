import {
  array,
  assert,
  constantFrom,
  double,
  integer,
  option,
  property,
  record,
  subarray,
  tuple,
  uniqueArray,
} from "fast-check";
import { describe, expect, it } from "vitest";
import type { Arbitrary } from "fast-check";

import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";

interface Style {
  readonly borderWidth?: number;
  readonly color?: string;
  readonly height?: number | undefined;
  readonly opacity?: number;
}

type ByName<Value> = Readonly<Record<string, Value>>;

type Styles = ByName<Style>;

interface Model {
  readonly slots: readonly string[];
  readonly base: Styles;
  readonly variants: ByName<ByName<Styles>>;
  readonly compounds: readonly {
    readonly variants: ByName<readonly string[]>;
    readonly styles: Styles;
  }[];
  readonly defaults: ByName<string>;
  readonly selections: readonly ByName<string>[];
}

const style: Arbitrary<Style> = record(
  {
    borderWidth: integer({ max: 4, min: 0 }),
    color: constantFrom("red", "blue", "#111827"),
    height: option(integer({ max: 64, min: 0 }), { nil: undefined }),
    opacity: double({ max: 1, min: 0, noNaN: true }),
  },
  { requiredKeys: [] },
);

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

function modelOf(
  slots: readonly string[],
  variants: ReadonlyMap<string, readonly string[]>,
): Arbitrary<Model> {
  const names = [...variants.keys()];
  const optionsOf = (name: string): readonly string[] =>
    variants.get(name) ?? [];
  const stylesOf = subarray([...slots]).chain((named: readonly string[]) =>
    entriesOf(named, () => style),
  );
  const someVariants = <Value>(
    valueOfName: (name: string) => Arbitrary<Value>,
  ): Arbitrary<ByName<Value>> =>
    subarray(names).chain((named: readonly string[]) =>
      entriesOf(named, valueOfName),
    );
  const optionOf = (name: string): Arbitrary<string> =>
    constantFrom(...optionsOf(name));
  const compound = record({
    styles: stylesOf,
    variants: someVariants((name) =>
      subarray([...optionsOf(name)], { minLength: 1 }),
    ),
  });
  return record({
    base: stylesOf,
    compounds: array(compound, { maxLength: 3 }),
    defaults: someVariants(optionOf),
    selections: array(someVariants(optionOf), { maxLength: 8, minLength: 1 }),
    slots: constantFrom(slots),
    variants: entriesOf(names, (name) =>
      entriesOf(optionsOf(name), () => stylesOf),
    ),
  });
}

const optionSets = [["sm", "md", "lg"], ["true", "false"], ["true"]];

const variantsOfModel = uniqueArray(constantFrom("size", "tone", "disabled"), {
  maxLength: 3,
}).chain((names: readonly string[]) =>
  tuple(
    ...names.map((name) =>
      constantFrom(...optionSets).map(
        (options: readonly string[]): readonly [string, readonly string[]] => [
          name,
          options,
        ],
      ),
    ),
  ),
);

const model = tuple(
  uniqueArray(constantFrom("root", "label", "icon"), { minLength: 1 }),
  variantsOfModel,
).chain(
  ([slots, variants]: readonly [
    readonly string[],
    readonly (readonly [string, readonly string[]])[],
  ]) => modelOf(slots, new Map(variants)),
);

function deepFreeze<Value>(value: Value): Value {
  if (typeof value === "object" && value !== null) {
    for (const item of Object.values(value)) {
      deepFreeze(item);
    }
    Object.freeze(value);
  }
  return value;
}

function styleOf(styles: Styles, slot: string): Style {
  return (Object.hasOwn(styles, slot) ? styles[slot] : undefined) ?? {};
}

function selectedOf(of: Model, selection: ByName<string>): ByName<string> {
  const selected: Record<string, string> = {};
  for (const [name, byOption] of Object.entries(of.variants)) {
    const isBoolean = Object.keys(byOption).every(
      (each) => each === "true" || each === "false",
    );
    const selectedOption =
      selection[name] ?? of.defaults[name] ?? (isBoolean ? "false" : undefined);
    if (selectedOption !== undefined) {
      selected[name] = selectedOption;
    }
  }
  return selected;
}

/**
 * The style of `selection` for `slot`, merged as `StyleSheet.flatten`
 * merges styles: the base style, the style of each selected option, then
 * the style of each matching compound variant.
 */
function expectedStyle(
  of: Model,
  selection: ByName<string>,
  slot: string,
): Style {
  const selected = selectedOf(of, selection);
  const optionStyles = Object.entries(of.variants).map(
    ([name, byOption]: readonly [string, ByName<Styles>]) =>
      styleOf(byOption[selected[name] ?? ""] ?? {}, slot),
  );
  const compoundStyles = of.compounds
    .filter((compound) =>
      Object.entries(compound.variants).every(
        ([name, options]: readonly [string, readonly string[]]) =>
          options.includes(selected[name] ?? ""),
      ),
    )
    .map((compound) => styleOf(compound.styles, slot));
  const merged: { -readonly [Key in keyof Style]: Style[Key] } = {};
  for (const each of [
    styleOf(of.base, slot),
    ...optionStyles,
    ...compoundStyles,
  ]) {
    Object.assign(merged, each);
  }
  return merged;
}

function styleRecipeOf(
  of: Model,
  slot: string,
): (selection: ByName<string>) => Style {
  const variants: Record<string, Styles> = {};
  for (const [name, byOption] of Object.entries(of.variants)) {
    const styleByOption: Record<string, Style> = {};
    for (const [optionName, styles] of Object.entries(byOption)) {
      styleByOption[optionName] = styleOf(styles, slot);
    }
    variants[name] = styleByOption;
  }
  return createStyleRecipe(
    deepFreeze({
      base: styleOf(of.base, slot),
      compoundVariants: of.compounds.map((compound) => ({
        style: styleOf(compound.styles, slot),
        variants: compound.variants,
      })),
      defaultVariants: of.defaults,
      variants,
    }),
  );
}

function mergesAsStyleSheetFlatten(of: Model): void {
  const [slot = ""] = of.slots;
  const recipe = styleRecipeOf(of, slot);
  const results = of.selections.map((selection) => recipe(selection));
  expect(results).toStrictEqual(
    of.selections.map((selection) => expectedStyle(of, selection, slot)),
  );
  expect(results.every((result) => Object.isFrozen(result))).toBe(true);
  expect(
    of.selections.map(
      (selection, index) => recipe(selection) === results[index],
    ),
  ).not.toContain(false);
}

function mergesTheStyleOfEachSlot(of: Model): void {
  const recipe = createSlotStyleRecipe(
    deepFreeze({
      base: of.base,
      compoundVariants: of.compounds,
      defaultVariants: of.defaults,
      slots: of.slots,
      variants: of.variants,
    }),
  );
  for (const selection of of.selections) {
    const result = recipe(selection);
    expect(recipe(selection)).toBe(result);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.values(result).every((each) => Object.isFrozen(each))).toBe(
      true,
    );
    expect(Object.entries(result)).toStrictEqual(
      of.slots.map((slot) => [slot, expectedStyle(of, selection, slot)]),
    );
  }
}

describe("style recipes compared with StyleSheet.flatten", () => {
  it("merge the styles of a selection into one frozen style", () => {
    assert(property(model, mergesAsStyleSheetFlatten));
  });

  it("merge the styles of each slot into one frozen style", () => {
    assert(property(model, mergesTheStyleOfEachSlot));
  });
});
