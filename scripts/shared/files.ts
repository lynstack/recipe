import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import type { Dirent } from "node:fs";
import os from "node:os";
import path from "node:path";

/** The folders in `folder`. */
function foldersIn(folder: string): readonly string[] {
  return readdirSync(folder, { withFileTypes: true })
    .filter((entry: Readonly<Dirent>) => entry.isDirectory())
    .map((entry: Readonly<Dirent>) => entry.name);
}

/** Creates a temporary folder for the script `name`. */
function temporaryFolder(name: string): string {
  return mkdtempSync(path.join(os.tmpdir(), `lynstack-${name}-`));
}

/**
 * Calls `use` with a temporary folder for the script `name`, and removes
 * the folder afterward.
 */
function withTemporaryFolder<Result>(
  name: string,
  use: (folder: string) => Result,
): Result {
  const folder = temporaryFolder(name);
  try {
    return use(folder);
  } finally {
    rmSync(folder, { force: true, recursive: true });
  }
}

export { foldersIn, temporaryFolder, withTemporaryFolder };
