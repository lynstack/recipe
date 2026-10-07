import { assert, property } from "fast-check";
import { describe, expect, it } from "vitest";

import type { ByName, Config } from "./recipe-kind.arbitraries.js";
import {
  isBooleanName,
  narrowConfig,
  optionName,
  own,
  wideConfig,
} from "./recipe-kind.arbitraries.js";
import type { RecipeKind } from "./types.js";
import { createRecipeKind } from "./recipe-kind.js";

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
