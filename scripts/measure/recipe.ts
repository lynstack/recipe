import { measureSpeeds, speedsNamed } from "./speed.ts";
import type { Environment } from "./environment.ts";
import type { Speed } from "./speed.ts";
import type { Versions } from "./versions.ts";
import { readEnvironment } from "./environment.ts";
import { readVersions } from "./versions.ts";

/** What the docs of `@lynstack/recipe` report. */
interface RecipeMeasurements extends Environment {
  readonly versions: Versions;
  readonly cache: readonly Speed[];
  readonly slotCache: readonly Speed[];
}

/** Runs the benchmarks of the package in `directory`. */
function measureRecipe(directory: string): RecipeMeasurements {
  const speeds = measureSpeeds(directory);
  return {
    ...readEnvironment(),
    cache: speedsNamed(speeds, "recipe kind > is faster with the cache"),
    slotCache: speedsNamed(
      speeds,
      "slot recipe kind > is faster with the cache",
    ),
    versions: readVersions(directory, "recipe"),
  };
}

export { measureRecipe };
export type { RecipeMeasurements };
