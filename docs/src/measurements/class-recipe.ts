import type { BarGroup, BarRow } from "./bars.ts";
import { librariesOf, speedNamed, versionOf } from "./format.ts";
import type { Speed } from "./format.ts";
import { cacheRows } from "./bars.ts";
import measurements from "./class-recipe.json";

const PERCENT = 100;
const SPREAD_STEP = 5;

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
    emphasis: name === "class-recipe" ? "strong" : "none",
    hz,
    label: name,
    version: versionOf(measurements, name),
  }));
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
  recipeSpeedOf("class-recipe") / recipeSpeedOf("class-variance-authority"),
);

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

/**
 * The largest gap between the fastest and the slowest library on any input
 * of `cx`, in percent, rounded up to a multiple of 5.
 */
const cxSpread =
  Math.ceil(
    (Math.max(
      ...cxRows.map(({ speeds }) => Math.max(...speeds) / Math.min(...speeds)),
    ) -
      1) *
      (PERCENT / SPREAD_STEP),
  ) * SPREAD_STEP;

/** The library fastest on every input of `cx`, if there is one. */
const cxFastest = ((): string | undefined => {
  const fastest = new Set(cxSpeeds.map(({ speeds }) => speeds[0]?.name));
  const [name] = fastest;
  return fastest.size === 1 ? name : undefined;
})();

const recipeGroups = comparisonGroups(measurements.recipe);
const slotRecipeGroups = comparisonGroups(measurements.slotRecipe);
const cacheGroups: readonly BarGroup[] = [
  {
    rows: [
      ...cacheRows("Recipe", measurements.recipeCache),
      ...cacheRows("Slot recipe", measurements.slotRecipeCache),
    ],
  },
];

export {
  cacheGroups,
  cxFastest,
  cxLibraries,
  cxRows,
  cxSpread,
  libraries,
  recipeGroups,
  recipeSpeedOf,
  slotRecipeGroups,
  speedup,
};
export { default as measurements } from "./class-recipe.json";
