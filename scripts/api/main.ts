/**
 * Checks that the public API of each package, the declarations that its
 * build writes without their comments, is the one that `api/<package>.d.ts`
 * keeps, so that every change to a public type shows in a diff, and that
 * an app of `consumers` uses each of its exports. The packages must be
 * built first.
 *
 * Options:
 * - `--update`: replaces each `api/<package>.d.ts` with the API of the
 *   package, instead of comparing them.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import path from "node:path";

import { packageNames, packagesFolder, root } from "../shared/workspace.ts";
import { showDifference } from "../shared/commands.ts";
import { uncoveredExportsOf } from "./coverage.ts";
import { withTemporaryFolder } from "../shared/files.ts";

const { values: options } = parseArgs({
  options: { update: { type: "boolean" } },
});

/**
 * The API of the package in `folder`: its declarations without their
 * comments and source map.
 *
 * @throws {Error} When the package is not built.
 */
function apiOf(folder: string): string {
  const built = path.join(folder, "dist", "index.d.ts");
  if (!existsSync(built)) {
    throw new Error(`${folder} is not built.`);
  }
  return readFileSync(built, "utf8")
    .replaceAll(/^\s*\/\*\*[\s\S]*?\*\/\n/gmu, "")
    .replaceAll(/^\/\/[#@] .*\n?/gmu, "");
}

/**
 * Whether `api/<name>.d.ts` keeps the API of the package `name`, or, with
 * `--update`, writes it there. If not, writes how they differ, using the
 * folder `temporary` for the API it has.
 */
function keepsApi(name: string, temporary: string): boolean {
  const api = apiOf(path.join(packagesFolder, name));
  const kept = path.join(root, "api", `${name}.d.ts`);
  if (options.update === true) {
    writeFileSync(kept, api);
    return true;
  }
  if (existsSync(kept) && readFileSync(kept, "utf8") === api) {
    return true;
  }
  const current = path.join(temporary, `${name}.d.ts`);
  writeFileSync(current, api);
  showDifference(kept, current);
  return false;
}

const changed = withTemporaryFolder("api", (temporary: string) =>
  packageNames().filter((name: string) => !keepsApi(name, temporary)),
);
if (changed.length > 0) {
  throw new Error(
    `The API of ${changed.join(", ")} differs from api/<package>.d.ts: review the difference above, then run pnpm api --update.`,
  );
}
const uncovered = packageNames().flatMap((name: string) =>
  uncoveredExportsOf(root, name).map(
    (exported: string) => `${exported} of @lynstack/${name}`,
  ),
);
if (uncovered.length > 0) {
  throw new Error(
    `No app of consumers names ${uncovered.join(", ")}: use each where users of the package would, in consumers/<package>.`,
  );
}
