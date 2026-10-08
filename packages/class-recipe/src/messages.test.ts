import { describe, expect, it } from "vitest";
import { API } from "typescript/unstable/sync";

const header = `import { cva, sva } from "../index.js";`;

/** The code of an error about a declaration that the module never reads. */
const unusedDeclaration = 6133;

const testPath = expect.getState().testPath ?? "";
const folder = `${testPath.slice(0, testPath.lastIndexOf("/"))}/messages`;

/**
 * Returns the messages of the errors that TypeScript reports in `source`, a
 * module of the package's sources that imports `cva` and `sva`.
 */
function errorsIn(source: string): readonly string[] {
  const module = `${folder}/module.ts`;
  const files = new Map([
    [
      `${folder}/tsconfig.json`,
      JSON.stringify({
        extends: "../../tsconfig.json",
        include: [],
        files: ["module.ts"],
      }),
    ],
    [module, `${header}\n${source}\n`],
  ]);
  const api = new API({
    fs: {
      readFile: (file: string): string | undefined => files.get(file),
      fileExists: (file: string): true | undefined =>
        files.has(file) ? true : undefined,
      directoryExists: (directory: string): true | undefined =>
        directory === folder ? true : undefined,
    },
  });
  try {
    const project = api
      .updateSnapshot({ openFiles: [module] })
      .getDefaultProjectForFile(module);
    return (project?.program.getSemanticDiagnostics(module) ?? [])
      .filter(({ code }) => code !== unusedDeclaration)
      .map(({ text }) => text);
  } finally {
    api.close();
  }
}

const variants = `{ tone: { neutral: "bg-gray-100", danger: "bg-red-600" } }`;

describe("the error messages of a recipe", () => {
  it("names the options of a variant", () => {
    expect(
      errorsIn(`cva({ variants: ${variants} })({ tone: "muted" });`),
    ).toStrictEqual([
      `Type '"muted"' is not assignable to type '"danger" | "neutral"'.`,
    ]);
  });

  it("names the options of a variant that composes another", () => {
    expect(
      errorsIn(`const base = cva({ variants: ${variants} });
cva({ composes: [base], variants: { tone: { muted: "bg-gray-50" } } })({ tone: "loud" });`),
    ).toStrictEqual([
      `Type '"loud"' is not assignable to type '"danger" | "muted" | "neutral"'.`,
    ]);
  });
});
