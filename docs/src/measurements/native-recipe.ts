import type { BarGroup, BarRow } from "./bars.ts";
import { librariesOf, speedNamed } from "./format.ts";
import type { Speed } from "./format.ts";
import { cacheRows } from "./bars.ts";
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

/** How many times as fast a recipe is with its cache as without it. */
function cacheSpeedup(speeds: readonly Speed[]): number {
  return Math.round(
    speedNamed(speeds, "cached") / speedNamed(speeds, "uncached"),
  );
}

const styleRecipeSpeedup = cacheSpeedup(measurements.styleRecipeCache);
const slotStyleRecipeSpeedup = cacheSpeedup(measurements.slotStyleRecipeCache);

export {
  cacheGroups,
  libraries,
  slotStyleRecipeSpeedup,
  styleRecipeSpeedup,
  themedGroups,
  themedShare,
};
export { default as measurements } from "./native-recipe.json";
