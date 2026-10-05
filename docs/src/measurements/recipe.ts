import { librariesOf, speedNamed } from "./format.ts";
import type { BarGroup } from "./bars.ts";
import type { Speed } from "./format.ts";
import type { Stat } from "./stats.ts";
import { cacheRows } from "./bars.ts";
import { formatTimes } from "./stats.ts";
import measurements from "./recipe.json";

/** The packages whose versions the measurements name. */
const libraries = librariesOf(measurements, ["recipe"]);

const cacheGroups: readonly BarGroup[] = [
  { rows: cacheRows("Recipe", measurements.cache) },
  { rows: cacheRows("Slot recipe", measurements.slotCache) },
];

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
    label: "as fast with the cache, for a recipe",
    value: cacheTimes(measurements.cache),
  },
  {
    label: "as fast with the cache, for a slot recipe",
    value: cacheTimes(measurements.slotCache),
  },
];

export { cacheGroups, libraries, stats };
export { default as measurements } from "./recipe.json";
