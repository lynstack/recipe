import type { BarGroup, BarRow } from "./bars.ts";
import { librariesOf, speedNamed } from "./format.ts";
import type { Speed } from "./format.ts";
import type { Stat } from "./stats.ts";
import { cacheRows } from "./bars.ts";
import { formatTimes } from "./stats.ts";
import measurements from "./native-recipe.json";

const PERCENT = 100;
const SHARE_STEP = 5;

/** The packages whose versions the measurements name. */
const libraries = librariesOf(measurements, ["native-recipe"]);

const cacheGroups: readonly BarGroup[] = [
  { rows: cacheRows("Style recipe", measurements.styleRecipeCache) },
  { rows: cacheRows("Slot style recipe", measurements.slotStyleRecipeCache) },
];

/** The label of each task of the themed style recipe benchmark. */
const themedLabels: Readonly<Record<string, string>> = {
  plain: "Style recipe",
  "themed, one theme": "Themed style recipe, one theme",
  "themed, two themes": "Themed style recipe, two themes",
  uncached: "Style recipe, without cache",
};

const themedRows: readonly BarRow[] = measurements.themedStyleRecipe.map(
  ({ hz, name }: Speed): BarRow => ({
    hz,
    label: themedLabels[name] ?? name,
    subject: name === "themed, one theme",
  }),
);

const themedGroups: readonly BarGroup[] = [{ rows: themedRows }];

/**
 * The speed of a themed style recipe called with one theme, in percent of
 * the speed of a style recipe, rounded to a multiple of 5.
 */
const themedShare =
  Math.round(
    (speedNamed(measurements.themedStyleRecipe, "themed, one theme") /
      speedNamed(measurements.themedStyleRecipe, "plain")) *
      (PERCENT / SHARE_STEP),
  ) * SHARE_STEP;

/** How many times as fast a style recipe is with its cache as without it. */
const styleRecipeSpeedup = Math.round(
  speedNamed(measurements.styleRecipeCache, "cached") /
    speedNamed(measurements.styleRecipeCache, "uncached"),
);

/** Formats how many times as fast a recipe is with its cache. */
function cacheTimes(speeds: readonly Speed[]): string {
  return formatTimes(
    speedNamed(speeds, "cached"),
    speedNamed(speeds, "uncached"),
  );
}

/** The headline numbers of the performance page. */
const stats: readonly Stat[] = [
  {
    label: "as fast with the cache, for a style recipe",
    value: cacheTimes(measurements.styleRecipeCache),
  },
  {
    label: "as fast with the cache, for a slot style recipe",
    value: cacheTimes(measurements.slotStyleRecipeCache),
  },
  {
    label: "of the speed of a style recipe, for a themed one",
    value: `${themedShare}%`,
  },
];

export { cacheGroups, libraries, stats, styleRecipeSpeedup, themedGroups };
export { default as measurements } from "./native-recipe.json";
