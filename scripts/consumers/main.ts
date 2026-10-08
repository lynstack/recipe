/**
 * Installs the packed packages in a copy of each app of `consumers`, with
 * pnpm, outside the repository, as an app installs them from npm, and
 * compiles it with declarations. Inside the workspace, pnpm links the
 * package folders, whose types TypeScript can always name; an app that
 * installs the packages can name only the types that its own dependencies
 * export. It also checks that the declarations of the slot recipes of an
 * app's `chain.ts` grow linearly with the level of composition.
 *
 * Options:
 * - `--packages <folder>`: the tarballs to install. Without it, the
 *   packages are packed first.
 * - `--typescript <version>`: the TypeScript to compile with. Defaults to
 *   the one of the repository.
 * - `--react-native <version>`: the React Native of the apps that depend on
 *   it, with the React and React types it asks for. Defaults to the one each
 *   app lists.
 */
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import type { Dirent } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { parseArgs } from "node:util";
import path from "node:path";

import type { Dependencies, Manifest } from "./manifest.ts";
import {
  compiles,
  growsLinearly,
  hasIsolatedDeclarations,
  withoutIsolatedDeclarations,
} from "./compile.ts";
import { isDependencies, parseJson, readManifest } from "./manifest.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const consumers = path.join(root, "consumers");

const { values: options } = parseArgs({
  options: {
    packages: { type: "string" },
    "react-native": { type: "string" },
    typescript: { type: "string" },
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

/** The tarball of each package in `folder`, keyed by package name. */
function tarballsIn(folder: string): ReadonlyMap<string, string> {
  return new Map(
    readdirSync(folder)
      .filter((file: string) => file.endsWith(".tgz"))
      .map((file: string): readonly [string, string] => [
        file.replace(
          /^lynstack-(?<name>.*)-\d+\.\d+\.\d+\.tgz$/u,
          "@lynstack/$<name>",
        ),
        path.join(folder, file),
      ]),
  );
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

/** The TypeScript that the apps compile with. */
const typescript =
  options.typescript ??
  readManifest(path.join(root, "package.json")).devDependencies["typescript"] ??
  "";

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
      private: true,
      type: "module",
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
 * Installs the app `name` into `folder` from `tarballs` and checks it, and
 * returns what fails, if anything.
 */
function failureOf(
  name: string,
  folder: string,
  tarballs: ReadonlyMap<string, string>,
): string | undefined {
  const app = install(name, folder, tarballs);
  if (!compiles(app)) {
    return `the app of ${name} does not compile`;
  }
  if (!growsLinearly(app)) {
    return `the declarations of the app of ${name} grow faster than the levels of composition`;
  }
  return undefined;
}

const folder = mkdtempSync(path.join(os.tmpdir(), "lynstack-consumers-"));
const tarballs = tarballsIn(
  options.packages ?? pack(path.join(folder, "packages")),
);
const failures = readdirSync(consumers, { withFileTypes: true })
  .filter((entry: Readonly<Dirent>) => entry.isDirectory())
  .map((entry: Readonly<Dirent>) => failureOf(entry.name, folder, tarballs))
  .filter((failure: string | undefined) => failure !== undefined);
if (failures.length > 0) {
  throw new Error(`${failures.join("; ")}. The apps are in ${folder}.`);
}
rmSync(folder, { force: true, recursive: true });
