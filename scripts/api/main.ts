/**
 * Checks that the public API of each package, the declarations that its
 * build writes without their comments, is the one that `api/<package>.d.ts`
 * keeps, so that every change to a public type shows in a diff. The
 * packages must be built first.
 *
 * Options:
 * - `--update`: replaces each `api/<package>.d.ts` with the API of the
 *   package, instead of comparing them.
 */
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { parseArgs } from "node:util";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../../", import.meta.url));
const packages = path.join(root, "packages");

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
 * Writes how the API in the file `kept` differs from `api`, which it
 * writes to the file `current`.
 */
function showDifference(kept: string, api: string, current: string): void {
  writeFileSync(current, api);
  spawnSync("git", ["diff", "--no-index", "--", kept, current], {
    stdio: "inherit",
  });
}

/**
 * Whether `api/<name>.d.ts` keeps the API of the package `name`, or, with
 * `--update`, writes it there. If not, writes how they differ, using the
 * folder `temporary` for the API it has.
 */
function keepsApi(name: string, temporary: string): boolean {
  const api = apiOf(path.join(packages, name));
  const kept = path.join(root, "api", `${name}.d.ts`);
  if (options.update === true) {
    writeFileSync(kept, api);
    return true;
  }
  if (existsSync(kept) && readFileSync(kept, "utf8") === api) {
    return true;
  }
  showDifference(kept, api, path.join(temporary, `${name}.d.ts`));
  return false;
}

const temporary = mkdtempSync(path.join(os.tmpdir(), "lynstack-api-"));
const changed = readdirSync(packages).filter(
  (name: string) => !keepsApi(name, temporary),
);
rmSync(temporary, { force: true, recursive: true });
if (changed.length > 0) {
  throw new Error(
    `The API of ${changed.join(", ")} differs from api/<package>.d.ts: review the difference above, then run pnpm api --update.`,
  );
}
