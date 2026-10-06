import { formatCall, formatLine } from "./format.ts";
import { formatLiteral, token } from "./literal.ts";
import type { Call } from "./example.ts";
import classRecipePackage from "../../../packages/class-recipe/package.json";
import { diffLines } from "../line-diff.ts";
import docsPackage from "../../package.json";

type Module = Readonly<Record<string, unknown>>;

const sources = import.meta.glob<string>("./migrations/**/*.ts", {
  eager: true,
  import: "default",
  query: "?raw",
});

const modules = import.meta.glob<Module>("./migrations/**/*.ts", {
  eager: true,
});

/** The libraries that the docs show how to migrate from. */
const libraries = ["class-variance-authority", "tailwind-variants"] as const;

type Library = (typeof libraries)[number];

/** One side of a comparison: a library and code that uses it. */
interface ComparisonSide {
  readonly library: string;
  readonly version: string;
  readonly code: string;
  /** The lines that differ from the other side, numbered from 1. */
  readonly changed: readonly number[];
  /** The calls of the recipe and what each returns, as HTML, if any. */
  readonly output: string | undefined;
}

/** The same code before and after a migration to class-recipe. */
interface Comparison {
  readonly before: ComparisonSide;
  readonly after: ComparisonSide;
}

/** The calls that a comparison shows on each side, from its `calls.ts`. */
interface ComparisonCalls {
  /** The name of the export of each side that the calls call. */
  readonly recipe: string;
  readonly before: readonly Call[];
  readonly after: readonly Call[];
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

/**
 * Returns the code of a side of a comparison as the docs show it, without
 * the `@ts-expect-error` comments that let it pass values a library's
 * types reject, as untyped data does.
 */
function sourceOf(path: string): string {
  const source = sources[`./migrations/${path}.ts`];
  if (source === undefined) {
    throw new Error(`${path} has no module in migrations`);
  }
  return source
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("// @ts-expect-error"))
    .join("\n");
}

function isCallList(value: unknown): value is readonly Call[] {
  return (
    Array.isArray(value) &&
    value.every((call: unknown) => typeof call === "object" && call !== null)
  );
}

/** Returns the calls of a comparison, or none when it has no `calls.ts`. */
function callsOf(name: string): ComparisonCalls | undefined {
  const module = modules[`./migrations/${name}/calls.ts`];
  if (module === undefined) {
    return undefined;
  }
  const { after, before, recipe } = module;
  if (typeof recipe !== "string" || !isCallList(before) || !isCallList(after)) {
    throw new TypeError(
      `${name}/calls.ts must export recipe, before, and after`,
    );
  }
  return { after, before, recipe };
}

/** The badge after a result that differs on the other side of a comparison. */
const differsBadge = '<span class="comparison-differs">Differs</span>';

/**
 * Returns the classes in what a recipe returns: for a slot recipe of
 * tailwind-variants, which returns a function for each slot, what each
 * function returns without arguments.
 */
function classesOf(result: unknown): unknown {
  if (typeof result !== "object" || result === null) {
    return result;
  }
  return Object.fromEntries(
    Object.entries(result).map(([slot, value]: readonly [string, unknown]) => [
      slot,
      typeof value === "function" ? Reflect.apply(value, undefined, []) : value,
    ]),
  );
}

/**
 * Returns what a comparison compares of a result: the classes of each
 * slot in order, for a slot recipe, whose slots a migration may rename.
 */
function comparable(result: unknown): unknown {
  return typeof result === "object" && result !== null
    ? Object.values(result)
    : result;
}

/** Whether two results hold the same classes, in the same order. */
function isSameResult(result: unknown, other: unknown): boolean {
  return (
    JSON.stringify(comparable(result)) === JSON.stringify(comparable(other))
  );
}

/** Calls the recipe that `path` exports as `recipe` with each of `calls`. */
function resultsOf(
  path: string,
  recipe: string,
  calls: readonly Call[],
): readonly unknown[] {
  const exported = modules[`./migrations/${path}.ts`]?.[recipe];
  if (typeof exported !== "function") {
    throw new TypeError(`${path}.ts exports no function named ${recipe}`);
  }
  return calls.map((call) =>
    classesOf(Reflect.apply(exported, undefined, [call])),
  );
}

/** The calls of one side, what they return, and what the other side returns. */
interface SideResults {
  readonly calls: readonly Call[];
  readonly results: readonly unknown[];
  readonly otherResults: readonly unknown[];
}

/**
 * Writes each of `calls` with what it returns, as highlighted HTML, and
 * puts a badge after each result that differs from the result of the call
 * at the same place on the other side.
 */
function formatResults(
  recipe: string,
  { calls, results, otherResults }: SideResults,
): string {
  return calls
    .map((call, index) => {
      const result = results[index];
      const lines = [
        formatLine(formatCall(recipe, call).html),
        formatLine(
          `${token("arrow", "→ ").html}${formatLiteral(result).html}${
            isSameResult(result, otherResults[index]) ? "" : differsBadge
          }`,
        ),
      ];
      return `<span class="example-call">${lines.join("")}</span>`;
    })
    .join("");
}

/** Writes the calls of each side of a comparison and what they return. */
function outputsOf(
  name: string,
  { after, before, recipe }: ComparisonCalls,
): { readonly after: string; readonly before: string } {
  const beforeResults = resultsOf(`${name}/before`, recipe, before);
  const afterResults = resultsOf(`${name}/after`, recipe, after);
  return {
    after: formatResults(recipe, {
      calls: after,
      otherResults: beforeResults,
      results: afterResults,
    }),
    before: formatResults(recipe, {
      calls: before,
      otherResults: afterResults,
      results: beforeResults,
    }),
  };
}

/**
 * Returns the comparison in `migrations/<name>`, whose first segment names
 * the library that `before.ts` uses, with the lines that each side changes
 * and, when it has a `calls.ts`, what its calls return on each side, the
 * results that differ marked.
 */
function comparisonOf(name: string): Comparison {
  const library = libraryOf(name);
  const before = sourceOf(`${name}/before`);
  const after = sourceOf(`${name}/after`);
  const { added, removed } = diffLines(before, after);
  const calls = callsOf(name);
  const outputs = calls && outputsOf(name, calls);
  return {
    after: {
      changed: added,
      code: after,
      library: "class-recipe",
      output: outputs?.after,
      version: classRecipePackage.version,
    },
    before: {
      changed: removed,
      code: before,
      library,
      output: outputs?.before,
      version: docsPackage.devDependencies[library],
    },
  };
}

export { comparisonOf };
export type { Comparison, ComparisonSide };
