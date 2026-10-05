import type { PackageIconName } from "./package-icons.ts";
import classRecipePackage from "../../packages/class-recipe/package.json";
import nativeRecipeExample from "../../examples/native-recipe/App.tsx?raw";
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
  /** An example of the package that runs in the browser, to edit and try. */
  readonly playground: string;
  /** The requirements of the package, on its installation page. */
  readonly requirements: string;
}

/** Opens the example in `examples/<folder>` on StackBlitz. */
function stackBlitzUrl(folder: PackageIconName, file: string): string {
  const query = new URLSearchParams({ file, title: `${folder} example` });
  return `https://stackblitz.com/github/lynstack/recipe/tree/main/examples/${folder}?${query}`;
}

/** Opens `code` as the app of an Expo Snack that installs `dependency`. */
function snackUrl(dependency: string, code: string): string {
  const query = new URLSearchParams({
    dependencies: dependency,
    files: JSON.stringify({ "App.tsx": { contents: code, type: "CODE" } }),
    name: "native-recipe example",
    platform: "web",
  });
  return `https://snack.expo.dev/?${query}`;
}

function packageInfo(
  folder: PackageIconName,
  manifest: { readonly name: string; readonly version: string },
  { label, playground }: Pick<PackageInfo, "label" | "playground">,
): PackageInfo {
  return {
    changelog: `${repository}/blob/main/packages/${folder}/CHANGELOG.md`,
    label,
    name: manifest.name,
    npm: `https://www.npmjs.com/package/${manifest.name}`,
    playground,
    requirements: `/recipe/${folder}/installation/#requirements`,
    source: `${repository}/tree/main/packages/${folder}`,
    version: manifest.version,
  };
}

/** Each package, by the name of its folder, which is also its sidebar topic. */
const packages = {
  "class-recipe": packageInfo("class-recipe", classRecipePackage, {
    label: "Class names",
    playground: stackBlitzUrl("class-recipe", "src/recipes.ts"),
  }),
  "native-recipe": packageInfo("native-recipe", nativeRecipePackage, {
    label: "React Native styles",
    playground: snackUrl(
      `${nativeRecipePackage.name}@${nativeRecipePackage.version}`,
      nativeRecipeExample,
    ),
  }),
  recipe: packageInfo("recipe", recipePackage, {
    label: "Core engine",
    playground: stackBlitzUrl("recipe", "src/recipes.ts"),
  }),
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
