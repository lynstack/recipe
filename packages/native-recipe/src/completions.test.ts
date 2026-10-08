import { describe, expect, it } from "vitest";
import { API } from "typescript/unstable/sync";

const cursor = "/*|*/";

const imports = `import { createSlotStyleRecipe, createStyleRecipe, createThemedRecipes } from "../index.js";`;

const testPath = expect.getState().testPath ?? "";
const folder = `${testPath.slice(0, testPath.lastIndexOf("/"))}/completions`;

/**
 * Returns the names that an editor completes at the cursor, `/*|*\/`, in
 * `source`, a module of the package's sources that imports the creators.
 */
function completionsAt(source: string): readonly string[] {
  const module = `${folder}/module.ts`;
  const text = `${imports}\n${source}\n`;
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
const slotVariants = `{ tone: { neutral: { root: { opacity: 1 } }, danger: {} } }`;
const themed = `const themed = createThemedRecipes<{ readonly gap: number }>();`;

describe("completions in the config of createStyleRecipe", () => {
  it("completes the style properties of base", () => {
    expect(
      completionsAt(
        `createStyleRecipe({ base: { ${cursor} }, variants: ${variants} });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });

  it("completes the style properties of an option", () => {
    expect(
      completionsAt(
        `createStyleRecipe({ variants: { tone: { neutral: { ${cursor} } } } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });

  it("completes the variant names of defaultVariants", () => {
    expect(
      completionsAt(
        `createStyleRecipe({ variants: ${variants}, defaultVariants: { ${cursor} } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the variant names of defaultVariants next to a default", () => {
    expect(
      completionsAt(
        `createStyleRecipe({ variants: ${variants}, defaultVariants: { size: "sm", ${cursor} } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone"]));
  });

  it("completes the options of defaultVariants", () => {
    expect(
      completionsAt(
        `createStyleRecipe({ variants: ${variants}, defaultVariants: { tone: "${cursor}" } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["neutral", "danger"]));
  });

  it("completes the variant names of a call", () => {
    expect(
      completionsAt(
        `const button = createStyleRecipe({ variants: ${variants} });\nbutton({ ${cursor} });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });
});

describe("completions in the config of createSlotStyleRecipe", () => {
  it("completes the slot names of base", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        base: { ${cursor} },
        variants: ${slotVariants},
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the style properties of a slot of base", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        base: { root: { ${cursor} } },
        variants: ${slotVariants},
      });`),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });

  it("completes the slot names of an option", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        variants: { tone: { neutral: { ${cursor} } } },
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the style properties of a slot of an option", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        variants: { tone: { neutral: { label: { ${cursor} } } } },
      });`),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });

  it("completes the variant names of defaultVariants", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        defaultVariants: { ${cursor} },
      });`),
    ).toStrictEqual(["tone"]);
  });
});

describe("completions in the compound variants of createStyleRecipe", () => {
  it("completes the variant names of a condition", () => {
    expect(
      completionsAt(`createStyleRecipe({
        variants: ${variants},
        compoundVariants: [{ variants: { ${cursor} }, style: {} }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the style properties", () => {
    expect(
      completionsAt(`createStyleRecipe({
        variants: ${variants},
        compoundVariants: [{ variants: { tone: "danger" }, style: { ${cursor} } }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });
});

describe("completions in the compound variants of createSlotStyleRecipe", () => {
  it("completes the variant names of a condition", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { ${cursor} }, styles: {} }],
      });`),
    ).toStrictEqual(["tone"]);
  });

  it("completes the slot names", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { tone: "danger" }, styles: { ${cursor} } }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the style properties of a slot", () => {
    expect(
      completionsAt(`createSlotStyleRecipe({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { tone: "danger" }, styles: { label: { ${cursor} } } }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });
});

describe("completions in the config of themed recipes", () => {
  it("completes the variant names of defaultVariants of a style recipe", () => {
    expect(
      completionsAt(`${themed}
      themed.createStyleRecipe((theme) => ({
        base: { gap: theme.gap },
        variants: ${variants},
        defaultVariants: { ${cursor} },
      }));`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });
});

describe("completions in the compound variants of themed recipes", () => {
  it("completes the variant names of a condition of a style recipe", () => {
    expect(
      completionsAt(`${themed}
      themed.createStyleRecipe((theme) => ({
        base: { gap: theme.gap },
        variants: ${variants},
        compoundVariants: [{ variants: { ${cursor} }, style: {} }],
      }));`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the style properties of a slot of a slot recipe", () => {
    expect(
      completionsAt(`${themed}
      themed.createSlotStyleRecipe((theme) => ({
        slots: ["root", "label"],
        base: { root: { gap: theme.gap } },
        variants: ${slotVariants},
        compoundVariants: [{ variants: { tone: "danger" }, styles: { label: { ${cursor} } } }],
      }));`),
    ).toStrictEqual(expect.arrayContaining(["margin", "opacity", "color"]));
  });
});
