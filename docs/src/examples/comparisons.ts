import classRecipePackage from "../../../packages/class-recipe/package.json";
import { diffLines } from "../line-diff.ts";
import docsPackage from "../../package.json";

const sources = import.meta.glob<string>("./migrations/**/*.ts", {
  eager: true,
  import: "default",
  query: "?raw",
});

/** The libraries that the docs show how to migrate from. */
const libraries = ["class-variance-authority"] as const;

type Library = (typeof libraries)[number];

/** One side of a comparison: a library and code that uses it. */
interface ComparisonSide {
  readonly library: string;
  readonly version: string;
  readonly code: string;
  /** The lines that differ from the other side, numbered from 1. */
  readonly changed: readonly number[];
}

/** The same code before and after a migration to class-recipe. */
interface Comparison {
  readonly before: ComparisonSide;
  readonly after: ComparisonSide;
}

function isLibrary(name: string): name is Library {
  return libraries.some((library) => library === name);
}

/** Returns the library of a comparison, which names its first folder. */
function libraryOf(name: string): Library {
  const [folder = ""] = name.split("/");
  if (!isLibrary(folder)) {
    throw new Error(`${name} is not in the folder of a library`);
  }
  return folder;
}

function sourceOf(path: string): string {
  const source = sources[`./migrations/${path}.ts`];
  if (source === undefined) {
    throw new Error(`${path} has no module in migrations`);
  }
  return source;
}

/**
 * Returns the comparison in `migrations/<name>`, whose first segment names
 * the library that `before.ts` uses, with the lines that each side changes.
 */
function comparisonOf(name: string): Comparison {
  const library = libraryOf(name);
  const before = sourceOf(`${name}/before`);
  const after = sourceOf(`${name}/after`);
  const { added, removed } = diffLines(before, after);
  return {
    after: {
      changed: added,
      code: after,
      library: "class-recipe",
      version: classRecipePackage.version,
    },
    before: {
      changed: removed,
      code: before,
      library,
      version: docsPackage.devDependencies[library],
    },
  };
}

export { comparisonOf };
export type { Comparison, ComparisonSide };
