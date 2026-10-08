import { describe, expect, it } from "vitest";
import { API } from "typescript/unstable/sync";

const header = `import { createRecipeKind, createSlotRecipeKind } from "../index.js";
type Style = { readonly opacity?: number; readonly color?: string };
const kind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};
const recipe = createRecipeKind(kind);
const slotRecipe = createSlotRecipeKind(kind);`;

/** The code of an error about a declaration that the module never reads. */
const unusedDeclaration = 6133;

const testPath = expect.getState().testPath ?? "";
const folder = `${testPath.slice(0, testPath.lastIndexOf("/"))}/messages`;

/**
 * Returns the messages of the errors that TypeScript reports in `source`, a
 * module of the package's sources that declares a recipe and a slot recipe
 * of one kind.
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

const variants = `{ tone: { neutral: { opacity: 1 }, danger: { opacity: 0.5 } }, loud: { true: {}, false: {} } }`;

describe("the error messages of a recipe", () => {
  it("names the options of a variant", () => {
    expect(
      errorsIn(`recipe({ variants: ${variants} })({ tone: "muted" });`),
    ).toStrictEqual([
      `Type '"muted"' is not assignable to type '"danger" | "neutral"'.`,
    ]);
  });

  it("names the options of a variant that composes another", () => {
    expect(
      errorsIn(`const base = recipe({ variants: ${variants} });
recipe({ composes: [base], variants: { tone: { muted: {} } } })({ tone: "loud" });`),
    ).toStrictEqual([
      `Type '"loud"' is not assignable to type '"danger" | "muted" | "neutral"'.`,
    ]);
  });

  it("names the values of a boolean variant", () => {
    expect(
      errorsIn(
        `recipe({ variants: ${variants} })({ tone: "danger", loud: "yes" });`,
      ),
    ).toStrictEqual([
      `Type '"yes"' is not assignable to type '"false" | "true" | boolean | undefined'.`,
    ]);
  });
});
