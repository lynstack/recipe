import path from "node:path";

import { readManifest } from "./manifest.ts";
import { root } from "./workspace.ts";

/** The first TypeScript of each compiler option added after 5.0. */
const OPTIONS_SINCE: Readonly<Record<string, string>> = {
  erasableSyntaxOnly: "5.8",
  isolatedDeclarations: "5.5",
};

/** Whether TypeScript `version` is `since` or newer. */
function isAtLeast(version: string, since: string): boolean {
  const [major = 0, minor = 0] = version.split(".").map(Number);
  const [sinceMajor = 0, sinceMinor = 0] = since.split(".").map(Number);
  return major > sinceMajor || (major === sinceMajor && minor >= sinceMinor);
}

/** Whether TypeScript `version` has the compiler option `option`. */
function hasCompilerOption(version: string, option: string): boolean {
  const since = OPTIONS_SINCE[option];
  return since === undefined || isAtLeast(version, since);
}

/** The TypeScript of the repository, which its root lists. */
function readRepositoryTypeScript(): string {
  const version = readManifest(path.join(root, "package.json")).devDependencies[
    "typescript"
  ];
  if (version === undefined) {
    throw new Error("The repository lists no TypeScript.");
  }
  return version;
}

export { hasCompilerOption, readRepositoryTypeScript };
