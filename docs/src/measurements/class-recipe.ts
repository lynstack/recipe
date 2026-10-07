import type { BarGroup, BarRow } from "./bars.ts";
import { librariesOf, speedNamed } from "./format.ts";
import type { Speed } from "./format.ts";
import type { Stat } from "./stats.ts";
import { cacheRows } from "./bars.ts";
import { formatTimes } from "./stats.ts";
import measurements from "./class-recipe.json";

const PERCENT = 100;
const SHARE_STEP = 5;
const SUBJECT = "class-recipe";

/** The libraries whose versions the measurements name. */
const libraries = librariesOf(measurements, [
  "class-recipe",
  "class-variance-authority",
  "tailwind-variants",
  "tailwind-merge",
  "clsx",
  "classnames",
]);

/** The libraries that `cx` is compared with, in the order of the table. */
const cxLibraries = ["class-recipe", "clsx", "classnames"] as const;

function libraryRows(speeds: readonly Speed[]): readonly BarRow[] {
  return speeds.map(({ hz, name }) => ({
    hz,
    label: name,
    subject: name === SUBJECT,
  }));
}

/** Returns the speed of the fastest library other than class-recipe. */
function fastestOther(speeds: readonly Speed[]): number {
  return Math.max(
    ...speeds.filter(({ name }) => name !== SUBJECT).map(({ hz }) => hz),
  );
}

function comparisonGroups(comparison: {
  readonly plain: readonly Speed[];
  readonly merged: readonly Speed[];
}): readonly BarGroup[] {
  return [
    { heading: "Without tailwind-merge", rows: libraryRows(comparison.plain) },
    { heading: "With tailwind-merge", rows: libraryRows(comparison.merged) },
  ];
}

/** Returns the calls per second of a library's recipe, without merging. */
function recipeSpeedOf(name: string): number {
  return speedNamed(measurements.recipe.plain, name);
}

/** How many times as fast class-recipe is as class-variance-authority. */
const speedup = Math.round(
  recipeSpeedOf(SUBJECT) / recipeSpeedOf("class-variance-authority"),
);

/**
 * How many times as fast a recipe of class-recipe whose join is `twMerge`
 * is as one of class-variance-authority whose result is passed to
 * `twMerge` on every call.
 */
const mergedSpeedup = formatTimes(
  speedNamed(measurements.recipe.merged, SUBJECT),
  speedNamed(measurements.recipe.merged, "class-variance-authority"),
);

/** The headline numbers of the performance page. */
const stats: readonly Stat[] = [
  {
    label: "as fast as class-variance-authority",
    value: formatTimes(
      recipeSpeedOf(SUBJECT),
      recipeSpeedOf("class-variance-authority"),
    ),
  },
  {
    label: "as fast as tailwind-variants",
    value: formatTimes(
      recipeSpeedOf(SUBJECT),
      recipeSpeedOf("tailwind-variants"),
    ),
  },
  {
    label: "as fast as either, with tailwind-merge",
    value: formatTimes(
      speedNamed(measurements.recipe.merged, SUBJECT),
      fastestOther(measurements.recipe.merged),
    ),
  },
  {
    label: "as fast as tailwind-variants, for slot recipes",
    value: formatTimes(
      speedNamed(measurements.slotRecipe.plain, SUBJECT),
      fastestOther(measurements.slotRecipe.plain),
    ),
  },
];

/** The speed of each library on each input of `cx`. */
const cxSpeeds: readonly {
  readonly name: string;
  readonly speeds: readonly Speed[];
}[] = measurements.cx;

/** The speed of each library on each input of `cx`, in table order. */
const cxRows: readonly {
  readonly name: string;
  readonly speeds: readonly number[];
}[] = cxSpeeds.map(({ name, speeds }) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  speeds: cxLibraries.map((library) => speedNamed(speeds, library)),
}));

/** The share of the speed of clsx that `cx` reaches on each input. */
const cxShares = cxSpeeds.map(
  ({ speeds }) => speedNamed(speeds, SUBJECT) / speedNamed(speeds, "clsx"),
);

/**
 * The least share of the speed of clsx that `cx` reaches on any input, in
 * percent, rounded down to a multiple of 5.
 */
const cxShareOfClsx =
  Math.floor((Math.min(...cxShares) * PERCENT) / SHARE_STEP) * SHARE_STEP;

/** On how many inputs `cx` is faster than clsx. */
const cxFasterInputs = cxShares.filter((share) => share > 1).length;

const recipeGroups = comparisonGroups(measurements.recipe);
const slotRecipeGroups = comparisonGroups(measurements.slotRecipe);
const cacheGroups: readonly BarGroup[] = [
  { rows: cacheRows("Recipe", measurements.recipeCache) },
  { rows: cacheRows("Slot recipe", measurements.slotRecipeCache) },
];

export {
  cacheGroups,
  cxLibraries,
  cxFasterInputs,
  cxRows,
  cxShareOfClsx,
  libraries,
  mergedSpeedup,
  recipeGroups,
  recipeSpeedOf,
  slotRecipeGroups,
  speedup,
  stats,
};
export { default as measurements } from "./class-recipe.json";
