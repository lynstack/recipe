import { describe, expect, it } from "vitest";
import { API } from "typescript/unstable/sync";

const header = `import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
} from "../index.js";
const themed = createThemedRecipes<{ readonly gap: number }>();`;

/** The code of an error about a declaration that the module never reads. */
const unusedDeclaration = 6133;

const testPath = expect.getState().testPath ?? "";
const folder = `${testPath.slice(0, testPath.lastIndexOf("/"))}/messages`;

/**
 * Returns the messages of the errors that TypeScript reports in `source`, a
 * module of the package's sources that imports the creators and declares
 * `themed`, the creators of a theme.
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

const variants = `{ tone: { neutral: { opacity: 1 }, danger: { opacity: 0.5 } } }`;

describe("the error messages of a style recipe", () => {
  it("names the options of a variant", () => {
    expect(
      errorsIn(
        `createStyleRecipe({ variants: ${variants} })({ tone: "muted" });`,
      ),
    ).toStrictEqual([
      `Type '"muted"' is not assignable to type '"danger" | "neutral"'.`,
    ]);
  });

  it("names the values of a style property in a compound variant of a theme", () => {
    expect(
      errorsIn(`export const stack = themed.createStyleRecipe((theme) => ({
  variants: { wrap: { true: {}, false: {} } },
  compoundVariants: [
    { variants: { wrap: true }, style: { gap: theme.gap, flexDirection: "sideways" } },
  ],
}));`),
    ).toStrictEqual([
      `Type '"sideways"' is not assignable to type '"column" | "column-reverse" | "row" | "row-reverse" | undefined'.`,
    ]);
  });
});

describe("the error messages of a slot style recipe", () => {
  it("names a slot that an option gives and the slots", () => {
    expect(
      errorsIn(`createSlotStyleRecipe({
  slots: ["root", "label"],
  variants: { size: { sm: { root: {}, lable: { fontSize: 12 } } } },
});`),
    ).toStrictEqual([
      `Type '{ fontSize: 12; }' is not assignable to type '{ readonly fontSize: 12; } & UnknownSlot<"lable", "label" | "root">'.`,
    ]);
  });
});

describe("the error messages of a themed recipe whose config reads `themeToken`", () => {
  it("names a slot that a compound variant gives and the slots", () => {
    expect(
      errorsIn(`themed.createSlotStyleRecipe(() => ({
  slots: ["root", "label"],
  base: { root: { gap: themed.themeToken.gap } },
  variants: { size: { sm: {} } },
  compoundVariants: [{ variants: { size: "sm" }, styles: { lable: { margin: 1 } } }],
}));`),
    ).toStrictEqual([
      `Type '{ margin: 1; }' is not assignable to type '{ readonly margin: 1; } & UnknownSlot<"lable", "label" | "root">'.`,
    ]);
  });

  it("names the options of a variant that a default gives", () => {
    expect(
      errorsIn(`themed.createStyleRecipe(() => ({
  base: { gap: themed.themeToken.gap },
  variants: ${variants},
  defaultVariants: { tone: "muted" },
}));`),
    ).toStrictEqual([
      `Type '"muted"' is not assignable to type '"danger" | "neutral"'.`,
    ]);
  });
});
