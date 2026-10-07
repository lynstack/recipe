import { assert, property } from "fast-check";
import { describe, expect, it } from "vitest";

import type { ByName, Config } from "./recipe-kind.arbitraries.js";
import {
  isBooleanName,
  narrowConfig,
  optionName,
  optionNames,
  own,
} from "./recipe-kind.arbitraries.js";
import { createRecipeKind } from "./recipe-kind.js";

const listRecipe = createRecipeKind({
  initial: (base: unknown): readonly unknown[] => [base],
  reduce: (list: readonly unknown[], value: unknown): readonly unknown[] => [
    ...list,
    value,
  ],
});

/**
 * The option names that are array indexes, which `Object.keys` lists
 * first, in ascending order.
 */
const optionIndexes = ["0", "1", "10"].filter((name) =>
  optionNames.includes(name),
);

function isIndex(name: string): boolean {
  return optionIndexes.includes(name);
}

/** The options of each variant in the order that the docs describe. */
function expectedOptions(of: Config): ByName<readonly string[]> {
  return Object.fromEntries(
    Object.keys(of.variants).map((name) => {
      const names = Object.keys(of.variants[name] ?? {});
      const indexes = optionIndexes.filter((each) => names.includes(each));
      const booleans = names.some((each) => isBooleanName(each))
        ? ["false", "true"]
        : [];
      const others = names.filter(
        (each) => !isIndex(each) && !isBooleanName(each),
      );
      return [name, [...indexes, ...booleans, ...others]];
    }),
  );
}

/** The option that each variant uses by default, as the docs describe it. */
function expectedDefaults(of: Config): ByName<string> {
  return Object.fromEntries(
    Object.keys(of.variants).flatMap((name) => {
      const names = Object.keys(of.variants[name] ?? {});
      const isBoolean =
        names.length > 0 && names.every((each) => isBooleanName(each));
      const selected =
        optionName(own(of.defaultVariants, name)) ??
        (isBoolean ? "false" : undefined);
      return selected === undefined ? [] : [[name, selected]];
    }),
  );
}

function listsVariantsAsDocumented(of: Config): void {
  const recipe = listRecipe(of);
  expect(recipe.variantKeys).toStrictEqual(Object.keys(of.variants));
  expect(recipe.variantOptions).toStrictEqual(expectedOptions(of));
  expect(recipe.defaultVariants).toStrictEqual(expectedDefaults(of));
}

describe("the variants of a recipe compared with their documented order", () => {
  it("lists the names, options, and defaults of its variants", () => {
    assert(property(narrowConfig, listsVariantsAsDocumented));
  });
});
