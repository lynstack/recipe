import type { PackageIconName } from "./package-icons.ts";
import classRecipePackage from "../../packages/class-recipe/package.json";
import nativeRecipeExample from "../../examples/native-recipe/App.tsx?raw";
import nativeRecipePackage from "../../packages/native-recipe/package.json";
import recipePackage from "../../packages/recipe/package.json";

const repository = "https://github.com/lynstack/recipe";

/** An app that runs an example of a package, and the site that hosts it. */
interface ExampleApp {
  readonly host: "Snack" | "StackBlitz";
  readonly url: string;
}

/** A package of the repository, as the docs present it. */
interface PackageInfo {
  /** The npm name of the package. */
  readonly name: string;
  /** The version in the repository, which is the one on npm after a release. */
  readonly version: string;
  /** The description of the package on npm. */
  readonly summary: string;
  /** The SPDX identifier of the package's license. */
  readonly license: string;
  /** What the package makes recipes for, in a word or two. */
  readonly label: string;
  /** The package's page on npm. */
  readonly npm: string;
  /** The package's folder on GitHub. */
  readonly source: string;
  /** The package's changelog on GitHub. */
  readonly changelog: string;
  /** An example of the package that runs in the browser, to edit and try. */
  readonly exampleApp: ExampleApp;
  /** The requirements of the package, on its installation page. */
  readonly requirements: string;
}

/** Opens the example in `examples/<folder>` on StackBlitz. */
function stackBlitzApp(folder: PackageIconName, file: string): ExampleApp {
  const query = new URLSearchParams({ file, title: `${folder} example` });
  return {
    host: "StackBlitz",
    url: `https://stackblitz.com/github/lynstack/recipe/tree/main/examples/${folder}?${query}`,
  };
}

/**
 * Opens `code` as the `App.js` of an Expo Snack that installs `dependency`.
 * The editor of Snack checks TypeScript with a version too old to read the
 * types of the packages, so the example runs as JavaScript.
 */
function snackApp(dependency: string, code: string): ExampleApp {
  const query = new URLSearchParams({
    dependencies: dependency,
    files: JSON.stringify({ "App.js": { contents: code, type: "CODE" } }),
    name: "native-recipe example",
    platform: "web",
  });
  return { host: "Snack", url: `https://snack.expo.dev/?${query}` };
}

function packageInfo(
  folder: PackageIconName,
  manifest: {
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly license: string;
  },
  { label, exampleApp }: Pick<PackageInfo, "exampleApp" | "label">,
): PackageInfo {
  return {
    changelog: `${repository}/blob/main/packages/${folder}/CHANGELOG.md`,
    exampleApp,
    label,
    license: manifest.license,
    name: manifest.name,
    npm: `https://www.npmjs.com/package/${manifest.name}`,
    requirements: `/recipe/${folder}/installation/#requirements`,
    source: `${repository}/tree/main/packages/${folder}`,
    summary: manifest.description,
    version: manifest.version,
  };
}

/** Each package, by the name of its folder, which is also its sidebar topic. */
const packages = {
  "class-recipe": packageInfo("class-recipe", classRecipePackage, {
    exampleApp: stackBlitzApp("class-recipe", "src/recipes.ts"),
    label: "Class names",
  }),
  "native-recipe": packageInfo("native-recipe", nativeRecipePackage, {
    exampleApp: snackApp(
      `${nativeRecipePackage.name}@${nativeRecipePackage.version}`,
      nativeRecipeExample,
    ),
    label: "React Native styles",
  }),
  recipe: packageInfo("recipe", recipePackage, {
    exampleApp: stackBlitzApp("recipe", "src/recipes.ts"),
    label: "Core engine",
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
