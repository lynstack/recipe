import { describe, expect, it } from "vitest";
import { API } from "typescript/unstable/sync";

const cursor = "/*|*/";

const header = `import { createRecipeKind, createSlotRecipeKind } from "../index.js";
type Style = { readonly opacity?: number; readonly color?: string };
const kind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};
const recipe = createRecipeKind(kind);
const slotRecipe = createSlotRecipeKind(kind);`;

const testPath = expect.getState().testPath ?? "";
const folder = `${testPath.slice(0, testPath.lastIndexOf("/"))}/completions`;

/**
 * Returns the names that an editor completes at the cursor, `/*|*\/`, in
 * `source`, a module of the package's sources that declares a recipe and a
 * slot recipe of one kind.
 */
function completionsAt(source: string): readonly string[] {
  const module = `${folder}/module.ts`;
  const text = `${header}\n${source}\n`;
  const files = new Map([
    [
      `${folder}/tsconfig.json`,
      JSON.stringify({
        extends: "../../tsconfig.json",
        include: [],
        files: ["module.ts"],
      }),
    ],
    [module, text],
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
    const info = project?.checker.getCompletionsAtPosition(
      module,
      text.indexOf(cursor),
    );
    const names: string[] = [];
    for (const { name } of info?.entries ?? []) {
      names.push(name.replace(/\?$/u, ""));
    }
    return names;
  } finally {
    api.close();
  }
}

const variants = `{ tone: { neutral: { opacity: 1 }, danger: { opacity: 0.5 } }, size: { sm: {}, md: {} } }`;
const slotVariants = `{ tone: { neutral: { root: { opacity: 1 } }, danger: {} }, size: { sm: {}, md: {} } }`;

describe("completions in the config of a recipe", () => {
  it("completes the value of base", () => {
    expect(
      completionsAt(`recipe({ base: { ${cursor} }, variants: ${variants} });`),
    ).toStrictEqual(expect.arrayContaining(["opacity", "color"]));
  });

  it("completes the value of an option", () => {
    expect(
      completionsAt(
        `recipe({ variants: { tone: { neutral: { ${cursor} } } } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["opacity", "color"]));
  });

  it("completes the variant names of a compound variant's condition", () => {
    expect(
      completionsAt(`recipe({
        variants: ${variants},
        compoundVariants: [{ variants: { ${cursor} }, value: {} }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the options of a compound variant's condition", () => {
    expect(
      completionsAt(`recipe({
        variants: ${variants},
        compoundVariants: [{ variants: { tone: "${cursor}" }, value: {} }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["neutral", "danger"]));
  });

  it("completes the value of a compound variant", () => {
    expect(
      completionsAt(`recipe({
        variants: ${variants},
        compoundVariants: [{ variants: { tone: "danger" }, value: { ${cursor} } }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["opacity", "color"]));
  });

  it("completes the variant names of defaultVariants", () => {
    expect(
      completionsAt(
        `recipe({ variants: ${variants}, defaultVariants: { ${cursor} } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the variant names of defaultVariants next to a default", () => {
    expect(
      completionsAt(
        `recipe({ variants: ${variants}, defaultVariants: { size: "sm", ${cursor} } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone"]));
  });

  it("completes the options of defaultVariants", () => {
    expect(
      completionsAt(
        `recipe({ variants: ${variants}, defaultVariants: { tone: "${cursor}" } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["neutral", "danger"]));
  });

  it("completes the variant names of a call", () => {
    expect(
      completionsAt(
        `const button = recipe({ variants: ${variants} });\nbutton({ ${cursor} });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });
});

describe("completions in the config of a slot recipe", () => {
  it("completes the slot names of base", () => {
    expect(
      completionsAt(`slotRecipe({
        slots: ["root", "label"],
        base: { ${cursor} },
        variants: ${slotVariants},
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the slot names of an option", () => {
    expect(
      completionsAt(`slotRecipe({
        slots: ["root", "label"],
        variants: { tone: { neutral: { ${cursor} } } },
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the value of a slot of an option", () => {
    expect(
      completionsAt(`slotRecipe({
        slots: ["root", "label"],
        variants: { tone: { neutral: { label: { ${cursor} } } } },
      });`),
    ).toStrictEqual(expect.arrayContaining(["opacity", "color"]));
  });

  it("completes the variant names of a compound variant's condition", () => {
    expect(
      completionsAt(`slotRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { ${cursor} }, value: {} }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the slot names of a compound variant", () => {
    expect(
      completionsAt(`slotRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { tone: "danger" }, value: { ${cursor} } }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the variant names of defaultVariants", () => {
    expect(
      completionsAt(`slotRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        defaultVariants: { ${cursor} },
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });
});
