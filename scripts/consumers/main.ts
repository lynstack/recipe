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
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { parseArgs } from "node:util";
import path from "node:path";

import type { Dependencies, Manifest } from "./manifest.ts";
import { appsIn, packLibrary, tarballsIn } from "./apps.ts";
import {
  compiles,
  growsLinearly,
  hasIsolatedDeclarations,
  withoutIsolatedDeclarations,
} from "./compile.ts";
import { isDependencies, parseJson, readManifest } from "./manifest.ts";
import { matchesDeclarations, updateDeclarations } from "./declarations.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
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

function run(command: string, args: readonly string[], cwd: string): void {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

/** Packs the packages of the workspace into `destination`. */
function pack(destination: string): string {
  run(
    "pnpm",
    ["--filter", "./packages/*", "pack", "--pack-destination", destination],
    root,
  );
  return destination;
}

/** React Native at `version`, and the React and React types it asks for. */
function reactNativeAt(version: string): Dependencies {
  const peers = parseJson(
    execFileSync(
      "npm",
      ["view", `react-native@${version}`, "peerDependencies", "--json"],
      { encoding: "utf8" },
    ),
  );
  if (!isDependencies(peers)) {
    throw new TypeError(`React Native ${version} has no peer dependencies.`);
  }
  return {
    "@types/react": peers["@types/react"] ?? "",
    react: peers["react"] ?? "",
    "react-native": version,
  };
}

/**
 * The React Native of the apps that depend on it, if the options replace
 * the one they list.
 */
const reactNative: Dependencies =
  options["react-native"] === undefined
    ? {}
    : reactNativeAt(options["react-native"]);

/**
 * Returns `dependencies` with the React Native of the options, if any, for
 * an app whose `manifest` depends on React Native.
 */
function withReactNative(
  manifest: Manifest,
  dependencies: Dependencies,
  names: readonly string[],
): Dependencies {
  if (manifest.dependencies["react-native"] === undefined) {
    return dependencies;
  }
  return {
    ...dependencies,
    ...Object.fromEntries(
      Object.entries(reactNative).filter(
        ([dependency]: readonly [string, string]) => names.includes(dependency),
      ),
    ),
  };
}

/** The dependencies of an app, with `@lynstack` from `tarballs`. */
function dependenciesOf(
  manifest: Manifest,
  tarballs: ReadonlyMap<string, string>,
): Dependencies {
  const dependencies = Object.fromEntries(
    Object.entries(manifest.dependencies).map(
      ([dependency, range]: readonly [string, string]) => [
        dependency,
        tarballs.has(dependency) ? `file:${tarballs.get(dependency)}` : range,
      ],
    ),
  );
  return withReactNative(manifest, dependencies, ["react", "react-native"]);
}

/** The TypeScript of the repository. */
const repositoryTypescript =
  readManifest(path.join(root, "package.json")).devDependencies["typescript"] ??
  "";

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

/** The development dependencies of an app. */
function devDependenciesOf(manifest: Manifest): Dependencies {
  return withReactNative(
    manifest,
    { ...manifest.devDependencies, typescript },
    ["@types/react"],
  );
}

/** The pnpm settings of an app that takes every package from `tarballs`. */
function workspaceSettings(tarballs: ReadonlyMap<string, string>): string {
  const overrides = [...tarballs].map(
    ([name, file]: readonly [string, string]) => `  "${name}": "file:${file}"`,
  );
  return `overrides:\n${overrides.join("\n")}\n`;
}

/** Copies the app `name` into `folder` and installs it from `tarballs`. */
function install(
  name: string,
  folder: string,
  tarballs: ReadonlyMap<string, string>,
): string {
  const app = path.join(folder, name);
  cpSync(path.join(consumers, name), app, {
    filter: (source: string) =>
      !["node_modules", "out"].includes(path.basename(source)),
    recursive: true,
  });
  const manifest = readManifest(path.join(app, "package.json"));
  writeFileSync(
    path.join(app, "package.json"),
    JSON.stringify({
      dependencies: dependenciesOf(manifest, tarballs),
      devDependencies: devDependenciesOf(manifest),
      exports: manifest.exports,
      files: manifest.files,
      name: manifest.name,
      private: true,
      type: "module",
      version: manifest.version,
    }),
  );
  writeFileSync(
    path.join(app, "pnpm-workspace.yaml"),
    workspaceSettings(tarballs),
  );
  if (!hasIsolatedDeclarations(typescript)) {
    withoutIsolatedDeclarations(app);
  }
  run("pnpm", ["install", "--no-frozen-lockfile", "--ignore-scripts"], app);
  return app;
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

const folder = mkdtempSync(path.join(os.tmpdir(), "lynstack-consumers-"));
const packages = options.packages ?? pack(path.join(folder, "packages"));
const tarballs = new Map(tarballsIn(packages));
const failures: string[] = [];
for (const { library, name } of appsIn(consumers)) {
  const app = install(name, folder, tarballs);
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
