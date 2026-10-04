import path from "node:path";

import { readJson, stringField } from "./json.ts";

/** The version of each package measured, keyed by package name. */
type Versions = Readonly<Record<string, string>>;

function versionAt(packageJson: string): string {
  return stringField(readJson(packageJson), "version");
}

/**
 * Returns the version of the package in `directory`, under `name`, and of
 * each of its development dependencies in `dependencies`, as installed.
 */
function readVersions(
  directory: string,
  name: string,
  dependencies: readonly string[] = [],
): Versions {
  const entries: readonly (readonly [string, string])[] = [
    [name, versionAt(path.join(directory, "package.json"))],
    ...dependencies.map((dependency): readonly [string, string] => [
      dependency,
      versionAt(
        path.join(directory, "node_modules", dependency, "package.json"),
      ),
    ]),
  ];
  return Object.fromEntries(entries);
}

export { readVersions };
export type { Versions };
