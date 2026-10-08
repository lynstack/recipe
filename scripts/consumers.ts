/**
 * Installs the packed packages in a copy of each app of `consumers`, with
 * pnpm, outside the repository, as an app installs them from npm, and
 * compiles it with declarations. Inside the workspace, pnpm links the
 * package folders, whose types TypeScript can always name; an app that
 * installs the packages can name only the types that its own dependencies
 * export.
 *
 * Options:
 * - `--packages <folder>`: the tarballs to install. Without it, the
 *   packages are packed first.
 * - `--typescript <version>`: the TypeScript to compile with. Defaults to
 *   the one of the repository.
 * - `--react-native <version>`: the React Native of the app of
 *   `@lynstack/native-recipe`, with the React and React types it asks for.
 *   Defaults to the one of that app.
 */
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import type { Dirent } from "node:fs";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { parseArgs } from "node:util";
import path from "node:path";

type Dependencies = Readonly<Record<string, string>>;

/** The dependencies of an app, as its `package.json` lists them. */
interface Manifest {
  readonly dependencies: Dependencies;
  readonly devDependencies: Dependencies;
}

const root = fileURLToPath(new URL("../", import.meta.url));
const consumers = path.join(root, "consumers");

const { values: options } = parseArgs({
  options: {
    packages: { type: "string" },
    "react-native": { type: "string" },
    typescript: { type: "string" },
  },
});

function isDependencies(value: unknown): value is Dependencies {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((range: unknown) => typeof range === "string")
  );
}

function dependenciesField(value: unknown, key: string): Dependencies {
  const dependencies: unknown =
    typeof value === "object" && value !== null
      ? Object.getOwnPropertyDescriptor(value, key)?.value
      : undefined;
  return isDependencies(dependencies) ? dependencies : {};
}

function parseJson(text: string): unknown {
  const value: unknown = JSON.parse(text);
  return value;
}

function readManifest(file: string): Manifest {
  const value = parseJson(readFileSync(file, "utf8"));
  return {
    dependencies: dependenciesField(value, "dependencies"),
    devDependencies: dependenciesField(value, "devDependencies"),
  };
}

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
 * The React Native of the app of `@lynstack/native-recipe`, if the options
 * replace the one it lists.
 */
const reactNative: Dependencies =
  options["react-native"] === undefined
    ? {}
    : reactNativeAt(options["react-native"]);

/** Returns `dependencies` with the React Native of the options, if any. */
function withReactNative(
  name: string,
  dependencies: Dependencies,
  names: readonly string[],
): Dependencies {
  if (name !== "native-recipe") {
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

/** The dependencies of the app `name`, with `@lynstack` from `tarballs`. */
function dependenciesOf(
  name: string,
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
  return withReactNative(name, dependencies, ["react", "react-native"]);
}

/** The development dependencies of the app `name`. */
function devDependenciesOf(name: string, manifest: Manifest): Dependencies {
  const typescript =
    options.typescript ??
    readManifest(path.join(root, "package.json")).devDependencies[
      "typescript"
    ] ??
    "";
  return withReactNative(name, { ...manifest.devDependencies, typescript }, [
    "@types/react",
  ]);
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
      dependencies: dependenciesOf(name, manifest, tarballs),
      devDependencies: devDependenciesOf(name, manifest),
      private: true,
      type: "module",
    }),
  );
  writeFileSync(
    path.join(app, "pnpm-workspace.yaml"),
    workspaceSettings(tarballs),
  );
  run("pnpm", ["install", "--no-frozen-lockfile", "--ignore-scripts"], app);
  return app;
}

/** Whether the app in `app` compiles. */
function compiles(app: string): boolean {
  return (
    spawnSync("pnpm", ["exec", "tsc", "-p", "tsconfig.json"], {
      cwd: app,
      stdio: "inherit",
    }).status === 0
  );
}

const folder = mkdtempSync(path.join(os.tmpdir(), "lynstack-consumers-"));
const tarballs = tarballsIn(
  options.packages ?? pack(path.join(folder, "packages")),
);
const failed = readdirSync(consumers, { withFileTypes: true })
  .filter((entry: Readonly<Dirent>) => entry.isDirectory())
  .map((entry: Readonly<Dirent>) => entry.name)
  .filter((name: string) => !compiles(install(name, folder, tarballs)));
if (failed.length > 0) {
  throw new Error(
    `These apps do not compile: ${failed.join(", ")}. They are in ${folder}.`,
  );
}
rmSync(folder, { force: true, recursive: true });
