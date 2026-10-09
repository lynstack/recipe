/**
 * Installs the packed packages in a copy of each app of `consumers`, with
 * pnpm, outside the repository, as an app installs them from npm, and
 * compiles it with declarations. Inside the workspace, pnpm links the
 * package folders, whose types TypeScript can always name; an app that
 * installs the packages can name only the types that its own dependencies
 * export. It also checks that the declarations of the recipes of each
 * chain of an app, `chain.ts` or a module ending in `-chain.ts`, grow
 * linearly with the level of composition, and,
 * with the TypeScript and React Native of the repository, that the app
 * emits the declarations that `api/consumers/<app>` keeps.
 *
 * Options:
 * - `--packages <folder>`: the tarballs to install. Without it, the
 *   packages are packed first.
 * - `--typescript <version>`: the TypeScript to compile with. Defaults to
 *   the one of the repository.
 * - `--react-native <version>`: the React Native of the apps that depend on
 *   it, with the React and React types it asks for. Defaults to the one each
 *   app lists.
 * - `--update`: replaces the declarations that `api/consumers` keeps with
 *   those the apps emit, instead of comparing them.
 */
import { parseArgs } from "node:util";
import path from "node:path";
import { rmSync } from "node:fs";

import {
  appsIn,
  compiles,
  packLibrary,
  packPackages,
  tarballsIn,
} from "./apps.ts";
import {
  growsLinearly,
  matchesDeclarations,
  updateDeclarations,
} from "./declarations.ts";
import { install, reactNativeAt } from "./install.ts";
import type { Installation } from "./install.ts";
import type { Manifest } from "../shared/manifest.ts";
import { readManifest } from "../shared/manifest.ts";
import { readRepositoryTypeScript } from "../shared/typescript.ts";
import { root } from "../shared/workspace.ts";
import { temporaryFolder } from "../shared/files.ts";

const consumers = path.join(root, "consumers");
const keptDeclarations = path.join(root, "api", "consumers");

const { values: options } = parseArgs({
  options: {
    packages: { type: "string" },
    "react-native": { type: "string" },
    typescript: { type: "string" },
    update: { type: "boolean" },
  },
});

const repositoryTypescript = readRepositoryTypeScript();

/** The TypeScript that the apps compile with. */
const typescript = options.typescript ?? repositoryTypescript;

if (
  options.update === true &&
  (typescript !== repositoryTypescript || options["react-native"] !== undefined)
) {
  throw new Error(
    "--update keeps the declarations of the TypeScript and React Native of the repository only.",
  );
}

/**
 * Whether an app whose `manifest` is that of the repository compiles with
 * the TypeScript and React Native of the repository, with which it emits
 * the declarations it keeps.
 */
function keepsDeclarations(manifest: Manifest): boolean {
  const listed = manifest.dependencies["react-native"];
  return (
    typescript === repositoryTypescript &&
    (listed === undefined ||
      options["react-native"] === undefined ||
      options["react-native"] === listed)
  );
}

/**
 * Checks the declarations that the installed `app` of `name` emits against
 * those it keeps, or keeps them with `--update`, and returns what fails, if
 * anything.
 */
function declarationsFailureOf(name: string, app: string): string | undefined {
  const manifest = readManifest(path.join(consumers, name, "package.json"));
  if (!keepsDeclarations(manifest)) {
    return undefined;
  }
  const kept = path.join(keptDeclarations, name);
  if (options.update === true) {
    updateDeclarations(app, kept);
    return undefined;
  }
  if (!matchesDeclarations(app, kept)) {
    return `the app of ${name} emits other declarations than api/consumers/${name}: review the difference above, then run pnpm consumers --update`;
  }
  return undefined;
}

/**
 * Checks the declarations that the compiled `app` of `name` emits, and
 * returns what fails, if anything.
 */
function failureOf(name: string, app: string): string | undefined {
  if (!growsLinearly(app)) {
    return `the declarations of the app of ${name} grow faster than the levels of composition`;
  }
  return declarationsFailureOf(name, app);
}

const folder = temporaryFolder("consumers");
const packages =
  options.packages ?? packPackages(path.join(folder, "packages"));
const tarballs = new Map(tarballsIn(packages));
const installation: Installation = {
  reactNative:
    options["react-native"] === undefined
      ? {}
      : reactNativeAt(options["react-native"]),
  tarballs,
  typescript,
};
const failures: string[] = [];
for (const { library, name } of appsIn(consumers)) {
  const app = path.join(folder, name);
  install(path.join(consumers, name), app, installation);
  if (compiles(app)) {
    if (library !== undefined) {
      tarballs.set(library, packLibrary(app, path.join(folder, "libraries")));
    }
    const failure = failureOf(name, app);
    if (failure !== undefined) {
      failures.push(failure);
    }
  } else {
    failures.push(`the app of ${name} does not compile`);
  }
}
if (failures.length > 0) {
  throw new Error(`${failures.join("; ")}. The apps are in ${folder}.`);
}
rmSync(folder, { force: true, recursive: true });
