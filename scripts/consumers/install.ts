import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

import type { Dependencies, Manifest } from "../shared/manifest.ts";
import { isDependencies, readManifest } from "../shared/manifest.ts";
import { hasCompilerOption } from "../shared/typescript.ts";
import { parseJson } from "../shared/json.ts";
import { run } from "../shared/commands.ts";

/** What the apps are installed with. */
interface Installation {
  /** The tarball of each package and library, keyed by package name. */
  readonly tarballs: ReadonlyMap<string, string>;
  /** The TypeScript that the apps compile with. */
  readonly typescript: string;
  /**
   * The React Native, React, and React types of the apps that depend on
   * React Native, when they replace the ones those apps list.
   */
  readonly reactNative: Dependencies;
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
 * The dependencies of `reactNative` that `names` lists, for an app whose
 * `manifest` depends on React Native, and none for another app.
 */
function reactNativeOf(
  manifest: Manifest,
  reactNative: Dependencies,
  names: readonly string[],
): Dependencies {
  if (manifest.dependencies["react-native"] === undefined) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(reactNative).filter(
      ([dependency]: readonly [string, string]) => names.includes(dependency),
    ),
  );
}

/** The dependencies of an app, with `@lynstack` from the tarballs. */
function dependenciesOf(
  manifest: Manifest,
  { reactNative, tarballs }: Installation,
): Dependencies {
  const dependencies = Object.fromEntries(
    Object.entries(manifest.dependencies).map(
      ([dependency, range]: readonly [string, string]) => [
        dependency,
        tarballs.has(dependency) ? `file:${tarballs.get(dependency)}` : range,
      ],
    ),
  );
  return {
    ...dependencies,
    ...reactNativeOf(manifest, reactNative, ["react", "react-native"]),
  };
}

/** The development dependencies of an app. */
function devDependenciesOf(
  manifest: Manifest,
  { reactNative, typescript }: Installation,
): Dependencies {
  return {
    ...manifest.devDependencies,
    typescript,
    ...reactNativeOf(manifest, reactNative, ["@types/react"]),
  };
}

/** The pnpm settings of an app that takes every package from `tarballs`. */
function workspaceSettings(tarballs: ReadonlyMap<string, string>): string {
  const overrides = [...tarballs].map(
    ([name, file]: readonly [string, string]) => `  "${name}": "file:${file}"`,
  );
  return `overrides:\n${overrides.join("\n")}\n`;
}

/**
 * Turns off `isolatedDeclarations` in the `tsconfig.json` of `app` for a
 * TypeScript without it, which then checks the rest of the app.
 */
function withoutIsolatedDeclarations(app: string): void {
  const file = path.join(app, "tsconfig.json");
  writeFileSync(
    file,
    readFileSync(file, "utf8").replace(
      /^\s*"isolatedDeclarations": true,\n/mu,
      "",
    ),
  );
}

/**
 * Copies the app in `source` into `app` and installs it as `installation`
 * says.
 */
function install(
  source: string,
  app: string,
  installation: Installation,
): void {
  cpSync(source, app, {
    filter: (file: string) =>
      !["node_modules", "out"].includes(path.basename(file)),
    recursive: true,
  });
  const manifest = readManifest(path.join(app, "package.json"));
  writeFileSync(
    path.join(app, "package.json"),
    JSON.stringify({
      dependencies: dependenciesOf(manifest, installation),
      devDependencies: devDependenciesOf(manifest, installation),
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
    workspaceSettings(installation.tarballs),
  );
  if (!hasCompilerOption(installation.typescript, "isolatedDeclarations")) {
    withoutIsolatedDeclarations(app);
  }
  run("pnpm", ["install", "--no-frozen-lockfile", "--ignore-scripts"], app);
}

export { install, reactNativeAt };
export type { Installation };
