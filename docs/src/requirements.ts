import type { PackageIconName } from "./icons.ts";
import nativeRecipePackage from "../../packages/native-recipe/package.json";
import versions from "../../compat/versions.json";

/** A tool or platform that a package needs, and the versions it supports. */
interface Requirement {
  readonly name: string;
  readonly supported: string;
}

/** Writes a version such as `16.9.0` as `16.9`. */
function minorOf(version: string): string {
  return version.replace(/\.\d+$/u, "");
}

/** The oldest TypeScript that reads the types of every package. */
const typeScriptVersion = minorOf(versions.typescript);

const requireVersions = versions.nodeRequire.map(minorOf).join(", ");

const sharedRequirements: readonly Requirement[] = [
  { name: "TypeScript", supported: `${typeScriptVersion} or newer` },
  {
    name: "Runtimes",
    supported: `Node.js ${minorOf(versions.node)}, Bun ${minorOf(versions.bun)}, Deno ${minorOf(versions.deno)}, or newer`,
  },
  {
    name: "Browsers",
    supported: "ES2022: Chrome 93, Firefox 92, Safari 15.4, or newer",
  },
  {
    name: "Modules",
    supported: `ES modules only: import it, or require it in Bun or from Node.js ${requireVersions}, or newer`,
  },
];

/** Writes a range such as `>=0.80.0` as `0.80`. */
function minimumOf(range: string): string {
  return range.replace(/^>=/u, "").replace(/\.0$/u, "");
}

const reactNative: Requirement = {
  name: "React Native",
  supported: `${minimumOf(nativeRecipePackage.peerDependencies["react-native"])} or newer, as in Expo SDK 54 or newer`,
};

/** Returns what the package in `folder` needs of a project that installs it. */
function requirementsOf(folder: PackageIconName): readonly Requirement[] {
  return folder === "native-recipe"
    ? [...sharedRequirements, reactNative]
    : sharedRequirements;
}

export { requirementsOf, typeScriptVersion };
export type { Requirement };
