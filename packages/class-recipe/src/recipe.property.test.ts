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
import { cva as cvaLibrary } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import type { ClassJoin } from "./join.js";
import type { RecipeVariants } from "./recipe.js";
import { createRecipes } from "./create-recipes.js";

type Selection = Readonly<Record<string, string | undefined>>;

type ConditionValue = string | readonly string[] | undefined;

type Condition = Readonly<Record<string, ConditionValue>>;

interface Variant {
  readonly name: string;
  readonly options: readonly string[];
}

interface Call {
  readonly props: Selection;
  readonly className: string;
}

interface Model {
  readonly base: string;
  readonly variants: RecipeVariants;
  readonly compounds: readonly {
    readonly variants: Condition;
    readonly className: string;
  }[];
  readonly defaults: Readonly<Record<string, string>>;
  readonly calls: readonly Call[];
}

const classes = array(
  constantFrom("flex", "hidden", "p-2", "p-4", "px-3", "text-sm", "text-lg"),
  { maxLength: 3 },
).map((list: readonly string[]) => list.join(" "));

const optionSets = [
  ["sm", "md", "lg"],
  ["true", "false"],
  ["true"],
  ["false"],
  ["0", "1", "10"],
];

function variantNamed(name: string): Arbitrary<Variant> {
  return constantFrom(...optionSets)
    .chain((options: readonly string[]) => subarray([...options]))
    .map((options: readonly string[]) => ({ name, options }));
}

function toRecord<Value>(
  list: readonly (readonly [string, Value])[],
): Readonly<Record<string, Value>> {
  return Object.fromEntries(list);
}

/** Each variant of `named`, with a value from `valueOf`. */
function entriesOf<Value>(
  named: readonly Variant[],
  valueOf: (variant: Variant) => Arbitrary<Value>,
): Arbitrary<Readonly<Record<string, Value>>> {
  const values = named.map((variant) =>
    valueOf(variant).map((value): readonly [string, Value] => [
      variant.name,
      value,
    ]),
  );
  return tuple(...values).map((list: readonly (readonly [string, Value])[]) =>
    toRecord(list),
  );
}

/** Some of the variants of `of` that declare options, with `valueOf`. */
function someDeclared<Value>(
  of: readonly Variant[],
  valueOf: (variant: Variant) => Arbitrary<Value>,
): Arbitrary<Readonly<Record<string, Value>>> {
  const declared = of.filter((variant) => variant.options.length > 0);
  return subarray(declared).chain((named: readonly Variant[]) =>
    entriesOf(named, valueOf),
  );
}

function classesOfOptions(
  variant: Variant,
): Arbitrary<Readonly<Record<string, string>>> {
  const options = variant.options.map((name) =>
    classes.map((value): readonly [string, string] => [name, value]),
  );
  return tuple(...options).map((list: readonly (readonly [string, string])[]) =>
    toRecord(list),
  );
}

function declaredOption(variant: Variant): Arbitrary<string> {
  return constantFrom(...variant.options);
}

function selectedOption(variant: Variant): Arbitrary<string | undefined> {
  const other = constantFrom(undefined, "undeclared");
  return variant.options.length === 0
    ? other
    : oneof({ arbitrary: declaredOption(variant), weight: 4 }, other);
}

function conditionValue(variant: Variant): Arbitrary<ConditionValue> {
  return option(
    oneof(declaredOption(variant), subarray([...variant.options])),
    { nil: undefined },
  );
}

function modelOf(of: readonly Variant[]): Arbitrary<Model> {
  const props = subarray([...of]).chain((named: readonly Variant[]) =>
    entriesOf(named, selectedOption),
  );
  const compound = record({
    className: classes,
    variants: someDeclared(of, conditionValue),
  });
  return record({
    base: classes,
    calls: array(record({ className: classes, props }), {
      maxLength: 4,
      minLength: 1,
    }),
    compounds: array(compound, { maxLength: 3 }),
    defaults: someDeclared(of, declaredOption),
    variants: entriesOf(of, classesOfOptions),
  });
}

const model = uniqueArray(constantFrom("size", "tone", "disabled", "level"), {
  maxLength: 4,
})
  .chain((names: readonly string[]) =>
    tuple(...names.map((name) => variantNamed(name))),
  )
  .chain((of: readonly Variant[]) => modelOf(of));

function isBooleanVariant(options: Readonly<Record<string, string>>): boolean {
  const names = Object.keys(options);
  return (
    names.length > 0 &&
    names.every((name) => name === "true" || name === "false")
  );
}

function conditionForReference(
  condition: Condition,
): Record<string, string | string[]> {
  const conditions: Record<string, string | string[]> = {};
  for (const [name, value] of Object.entries(condition)) {
    if (typeof value === "string") {
      conditions[name] = value;
    } else if (value !== undefined) {
      conditions[name] = [...value];
    }
  }
  return conditions;
}

/**
 * The recipe of class-variance-authority for `of`, adjusted for the
 * documented differences: a compound condition on `undefined` matches any
 * option, and a boolean variant without a default uses its `false` option.
 */
function referenceRecipe(of: Model): (call: Call) => string {
  const defaults: Record<string, string | undefined> = { ...of.defaults };
  for (const [name, options] of Object.entries(of.variants)) {
    if (isBooleanVariant(options)) {
      defaults[name] ??= "false";
    }
  }
  const recipe = cvaLibrary(of.base, {
    compoundVariants: of.compounds.map((compound) => ({
      ...conditionForReference(compound.variants),
      className: compound.className,
    })),
    defaultVariants: defaults,
    variants: of.variants,
  });
  return ({ props, className }) => recipe({ ...props, className });
}

function recipeOf(
  of: Model,
  options: Parameters<typeof createRecipes>[0],
): (call: Call) => string {
  const recipe = createRecipes(options).cva({
    base: of.base,
    compoundVariants: of.compounds,
    defaultVariants: of.defaults,
    variants: of.variants,
  });
  return ({ props, className }) => recipe({ ...props, className });
}

function returnsWhatTheReferenceReturns(cache: boolean): (of: Model) => void {
  return (of) => {
    const recipe = recipeOf(of, { cache });
    const reference = referenceRecipe(of);
    for (const call of [...of.calls, ...of.calls]) {
      expect(recipe(call)).toBe(reference(call));
    }
  };
}

function recordingJoin(): {
  readonly calls: readonly (readonly string[])[];
  readonly join: ClassJoin;
} {
  const calls: (readonly string[])[] = [];
  return {
    calls,
    join: (...classNames) => {
      calls.push(classNames);
      return twMerge(...classNames);
    },
  };
}

function mergesWhatTheReferenceReturns(cache: boolean): (of: Model) => void {
  return (of) => {
    const { calls, join } = recordingJoin();
    const recipe = recipeOf(of, { cache, join });
    const reference = referenceRecipe(of);
    for (const call of [...of.calls, ...of.calls]) {
      expect(recipe(call)).toBe(twMerge(reference(call)));
    }
    expect(calls.flat()).not.toContain("");
    expect(calls.map((classNames) => classNames.length)).not.toContain(0);
  };
}

describe("recipes compared with class-variance-authority", () => {
  it.each([true, false])("return the same class name, cache: %s", (cache) => {
    assert(property(model, returnsWhatTheReferenceReturns(cache)));
  });

  it.each([true, false])(
    "with a join function, merge the same class name, cache: %s",
    (cache) => {
      assert(property(model, mergesWhatTheReferenceReturns(cache)));
    },
  );
});
