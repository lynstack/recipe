import { measureSpeeds, speedsNamed } from "./speed.ts";
import type { Environment } from "./environment.ts";
import type { Speed } from "./speed.ts";
import type { Versions } from "./versions.ts";
import { readEnvironment } from "./environment.ts";
import { readVersions } from "./versions.ts";

/** What the docs of `@lynstack/native-recipe` report. */
interface NativeRecipeMeasurements extends Environment {
  readonly versions: Versions;
  readonly styleRecipeCache: readonly Speed[];
  readonly slotStyleRecipeCache: readonly Speed[];
  readonly themedStyleRecipe: readonly Speed[];
}

/** Runs the benchmarks of the package in `directory`. */
function measureNativeRecipe(directory: string): NativeRecipeMeasurements {
  const speeds = measureSpeeds(directory);
  return {
    ...readEnvironment(),
    slotStyleRecipeCache: speedsNamed(
      speeds,
      "slot style recipe > is faster with the cache",
    ),
    styleRecipeCache: speedsNamed(
      speeds,
      "style recipe > is faster with the cache",
    ),
    themedStyleRecipe: speedsNamed(
      speeds,
      "themed style recipe > is faster with the cache",
    ),
    versions: readVersions(directory, "native-recipe"),
  };
}

export { measureNativeRecipe };
export type { NativeRecipeMeasurements };
