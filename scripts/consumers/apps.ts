import { execFileSync } from "node:child_process";
import path from "node:path";
import { readdirSync } from "node:fs";

import { field, parseJson } from "../shared/json.ts";
import { run, succeeds } from "../shared/commands.ts";
import type { Manifest } from "../shared/manifest.ts";
import { foldersIn } from "../shared/files.ts";
import { readManifest } from "../shared/manifest.ts";
import { root } from "../shared/workspace.ts";

/** An app of `consumers`. */
interface App {
  /** The folder of the app in `consumers`, `<package>/<app>`. */
  readonly name: string;
  /** The package name of a library, which other apps install. */
  readonly library: string | undefined;
  readonly manifest: Manifest;
}

/** The app in the folder `name` of `consumers`. */
function appIn(consumers: string, name: string): App {
  const manifest = readManifest(path.join(consumers, name, "package.json"));
  return {
    library: manifest.exports === undefined ? undefined : manifest.name,
    manifest,
    name,
  };
}

/**
 * The apps of `consumers`, each in `consumers/<package>/<app>`, the
 * libraries before the apps that install them.
 */
function appsIn(consumers: string): readonly App[] {
  const apps = foldersIn(consumers).flatMap((name: string) =>
    foldersIn(path.join(consumers, name)).map((app: string) =>
      appIn(consumers, `${name}/${app}`),
    ),
  );
  const libraries = new Set(apps.map((app: App) => app.library));
  const installsLibrary = (app: App): boolean =>
    Object.keys(app.manifest.dependencies).some((dependency: string) =>
      libraries.has(dependency),
    );
  return [
    ...apps.filter((app: App) => !installsLibrary(app)),
    ...apps.filter((app: App) => installsLibrary(app)),
  ];
}

/**
 * The configs that an app compiles with: `tsconfig.json`, which emits its
 * declarations, then each profile, such as `tsconfig.strictest.json`.
 */
function configsOf(app: string): readonly string[] {
  return [
    "tsconfig.json",
    ...readdirSync(app)
      .filter((file: string) => /^tsconfig\..+\.json$/u.test(file))
      .toSorted(),
  ];
}

/** Whether the installed app in `app` compiles with each of its configs. */
function compiles(app: string): boolean {
  return configsOf(app).every((config: string) =>
    succeeds("pnpm", ["exec", "tsc", "-p", config], app),
  );
}

/**
 * Packs the installed library in the folder `app` into `destination`, and
 * returns its tarball.
 */
function packLibrary(app: string, destination: string): string {
  const packed = execFileSync(
    "pnpm",
    ["pack", "--pack-destination", destination, "--json"],
    { cwd: app, encoding: "utf8" },
  );
  const filename = field(parseJson(packed), "filename");
  if (typeof filename !== "string") {
    throw new TypeError(`pnpm pack wrote no tarball for ${app}.`);
  }
  return filename;
}

/** Packs the packages of the workspace into `destination`. */
function packPackages(destination: string): string {
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

export { appsIn, compiles, packLibrary, packPackages, tarballsIn };
export type { App };
