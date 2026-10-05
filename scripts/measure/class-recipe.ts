import type { Speed, Speeds } from "./speed.ts";
import { measureSpeeds, speedsNamed } from "./speed.ts";
import type { Environment } from "./environment.ts";
import type { Versions } from "./versions.ts";
import { readEnvironment } from "./environment.ts";
import { readVersions } from "./versions.ts";

/** A benchmark run with and without `tailwind-merge`. */
interface Comparison {
  readonly plain: readonly Speed[];
  readonly merged: readonly Speed[];
}

/** The speed of each library for one input of `cx`. */
interface CxInput {
  readonly name: string;
  readonly speeds: readonly Speed[];
}

/** What the docs of `@lynstack/class-recipe` report. */
interface ClassRecipeMeasurements extends Environment {
  readonly versions: Versions;
  readonly recipe: Comparison;
  readonly slotRecipe: Comparison;
  readonly cx: readonly CxInput[];
  readonly recipeCache: readonly Speed[];
  readonly slotRecipeCache: readonly Speed[];
}

const CX_PREFIX = "cx compared with other libraries > with ";

/** The selections that an iteration of a recipe benchmark calls. */
const RECIPE_CALLS = 6;
/** An iteration of a `cx` benchmark calls `cx` once. */
const CX_CALLS = 1;

const comparedLibraries = [
  "class-variance-authority",
  "classnames",
  "clsx",
  "tailwind-merge",
  "tailwind-variants",
] as const;

function comparisonOf(speeds: Speeds, suite: string): Comparison {
  return {
    merged: speedsNamed(
      speeds,
      `${suite} > with tailwind-merge > benchmark`,
      RECIPE_CALLS,
    ),
    plain: speedsNamed(
      speeds,
      `${suite} > without tailwind-merge > benchmark`,
      RECIPE_CALLS,
    ),
  };
}

function cxInputsOf(speeds: Speeds): readonly CxInput[] {
  return Object.keys(speeds)
    .filter((benchmark) => benchmark.startsWith(CX_PREFIX))
    .map((benchmark) => ({
      name: benchmark.slice(CX_PREFIX.length),
      speeds: speedsNamed(speeds, benchmark, CX_CALLS),
    }));
}

/** Runs the benchmarks of the package in `directory`. */
function measureClassRecipe(directory: string): ClassRecipeMeasurements {
  const speeds = measureSpeeds(directory);
  return {
    ...readEnvironment(),
    cx: cxInputsOf(speeds),
    recipe: comparisonOf(speeds, "recipe compared with other libraries"),
    recipeCache: speedsNamed(
      speeds,
      "recipe > is faster with the cache",
      RECIPE_CALLS,
    ),
    slotRecipe: comparisonOf(
      speeds,
      "slot recipe compared with other libraries",
    ),
    slotRecipeCache: speedsNamed(
      speeds,
      "slot recipe > is faster with the cache",
      RECIPE_CALLS,
    ),
    versions: readVersions(directory, "class-recipe", comparedLibraries),
  };
}

export { measureClassRecipe };
export type { ClassRecipeMeasurements, Comparison, CxInput };
