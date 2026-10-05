import type { BarGroup } from "./bars.ts";
import { cacheRows } from "./bars.ts";
import { librariesOf } from "./format.ts";
import measurements from "./recipe.json";

/** The packages whose versions the measurements name. */
const libraries = librariesOf(measurements, ["recipe"]);

const cacheGroups: readonly BarGroup[] = [
  { rows: cacheRows("Recipe", measurements.cache) },
  { rows: cacheRows("Slot recipe", measurements.slotCache) },
];

export { cacheGroups, libraries };
export { default as measurements } from "./recipe.json";
