/**
 * Runs the benchmarks of each package against its build and saves the
 * results in `docs/src/measurements/<package>.json`, which the docs report.
 * Pass package folder names, such as `class-recipe`, to measure only those.
 */
import { format, resolveConfig } from "prettier";
import { parseArgs } from "node:util";
import path from "node:path";
import { writeFileSync } from "node:fs";

import { packagesFolder, root } from "../shared/workspace.ts";
import { measureClassRecipe } from "./class-recipe.ts";
import { measureNativeRecipe } from "./native-recipe.ts";
import { measureRecipe } from "./recipe.ts";

/** Measures the package in a folder, given that folder's path. */
type Measure = (directory: string) => unknown;

/** The results of one package, and the file that holds them. */
interface Measured {
  readonly file: string;
  readonly results: unknown;
}

const measures: ReadonlyMap<string, Measure> = new Map<string, Measure>([
  ["recipe", measureRecipe],
  ["class-recipe", measureClassRecipe],
  ["native-recipe", measureNativeRecipe],
]);

const measurements = path.join(root, "docs", "src", "measurements");

async function formatJson(file: string, value: unknown): Promise<string> {
  const options = await resolveConfig(file);
  return format(JSON.stringify(value), { ...options, filepath: file });
}

const { positionals: requested } = parseArgs({ allowPositionals: true });
for (const name of requested) {
  if (!measures.has(name)) {
    throw new Error(`No package named "${name}" has measurements.`);
  }
}

const measured = [...measures]
  .filter(
    ([name]: readonly [string, Measure]) =>
      requested.length === 0 || requested.includes(name),
  )
  .map(([name, measure]: readonly [string, Measure]): Measured => ({
    file: path.join(measurements, `${name}.json`),
    results: measure(path.join(packagesFolder, name)),
  }));

await Promise.all(
  measured.map(async ({ file, results }) => {
    writeFileSync(file, await formatJson(file, results));
  }),
);
