import type { PackageIconName } from "./package-icons.ts";
import classRecipePackage from "../../packages/class-recipe/package.json";
import nativeRecipePackage from "../../packages/native-recipe/package.json";
import recipePackage from "../../packages/recipe/package.json";

const repository = "https://github.com/lynstack/recipe";

/** A package of the repository, as the docs present it. */
interface PackageInfo {
  /** The npm name of the package. */
  readonly name: string;
  /** The version in the repository, which is the one on npm after a release. */
  readonly version: string;
  /** What the package makes recipes for, in a word or two. */
  readonly label: string;
  /** The package's page on npm. */
  readonly npm: string;
  /** The package's folder on GitHub. */
  readonly source: string;
  /** The package's changelog on GitHub. */
  readonly changelog: string;
}

function packageInfo(
  folder: PackageIconName,
  manifest: { readonly name: string; readonly version: string },
  label: string,
): PackageInfo {
  return {
    changelog: `${repository}/blob/main/packages/${folder}/CHANGELOG.md`,
    label,
    name: manifest.name,
    npm: `https://www.npmjs.com/package/${manifest.name}`,
    source: `${repository}/tree/main/packages/${folder}`,
    version: manifest.version,
  };
}

/** Each package, by the name of its folder, which is also its sidebar topic. */
const packages = {
  "class-recipe": packageInfo(
    "class-recipe",
    classRecipePackage,
    "Class names",
  ),
  "native-recipe": packageInfo(
    "native-recipe",
    nativeRecipePackage,
    "React Native styles",
  ),
  recipe: packageInfo("recipe", recipePackage, "Core engine"),
} as const satisfies Readonly<Record<PackageIconName, PackageInfo>>;

const packagesByFolder: ReadonlyMap<string, PackageInfo> = new Map(
  Object.entries(packages),
);

/** Returns the package in `folder`, or none when no package is there. */
function findPackage(folder: string | undefined): PackageInfo | undefined {
  return packagesByFolder.get(folder ?? "");
}

export { findPackage, packages };
export type { PackageInfo };
