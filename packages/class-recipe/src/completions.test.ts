import { describe, expect, it } from "vitest";
import { API } from "typescript/unstable/sync";

const cursor = "/*|*/";

const header = `import { cva, sva } from "../index.js";`;

const testPath = expect.getState().testPath ?? "";
const folder = `${testPath.slice(0, testPath.lastIndexOf("/"))}/completions`;

/**
 * Returns the names that an editor completes at the cursor, `/*|*\/`, in
 * `source`, a module of the package's sources that imports `cva` and `sva`.
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

const variants = `{ tone: { neutral: "bg-surface", danger: "bg-danger" }, size: { sm: "h-8", md: "h-10" } }`;
const slotVariants = `{ tone: { neutral: { root: "bg-surface" }, danger: {} }, size: { sm: {}, md: {} } }`;

describe("completions in the config of cva", () => {
  it("completes the variant names of a compound variant's condition", () => {
    expect(
      completionsAt(`cva({
        variants: ${variants},
        compoundVariants: [{ variants: { ${cursor} }, className: "" }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the options of a compound variant's condition", () => {
    expect(
      completionsAt(`cva({
        variants: ${variants},
        compoundVariants: [{ variants: { tone: "${cursor}" }, className: "" }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["neutral", "danger"]));
  });

  it("completes the variant names of defaultVariants", () => {
    expect(
      completionsAt(
        `cva({ variants: ${variants}, defaultVariants: { ${cursor} } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the variant names of defaultVariants next to a default", () => {
    expect(
      completionsAt(
        `cva({ variants: ${variants}, defaultVariants: { size: "sm", ${cursor} } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone"]));
  });

  it("completes the options of defaultVariants", () => {
    expect(
      completionsAt(
        `cva({ variants: ${variants}, defaultVariants: { tone: "${cursor}" } });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["neutral", "danger"]));
  });

  it("completes the variant names of a call", () => {
    expect(
      completionsAt(
        `const button = cva({ variants: ${variants} });\nbutton({ ${cursor} });`,
      ),
    ).toStrictEqual(expect.arrayContaining(["tone", "size", "className"]));
  });
});

describe("completions in the config of sva", () => {
  it("completes the slot names of base", () => {
    expect(
      completionsAt(`sva({
        slots: ["root", "label"],
        base: { ${cursor} },
        variants: ${slotVariants},
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the slot names of an option", () => {
    expect(
      completionsAt(`sva({
        slots: ["root", "label"],
        variants: { tone: { neutral: { ${cursor} } } },
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the variant names of a compound variant's condition", () => {
    expect(
      completionsAt(`sva({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { ${cursor} }, classNames: {} }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the slot names of a compound variant", () => {
    expect(
      completionsAt(`sva({
        slots: ["root", "label"],
        variants: ${slotVariants},
        compoundVariants: [{ variants: { tone: "danger" }, classNames: { ${cursor} } }],
      });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });

  it("completes the variant names of defaultVariants", () => {
    expect(
      completionsAt(`sva({
        slots: ["root", "label"],
        variants: ${slotVariants},
        defaultVariants: { ${cursor} },
      });`),
    ).toStrictEqual(expect.arrayContaining(["tone", "size"]));
  });

  it("completes the slot names of a call's classNames", () => {
    expect(
      completionsAt(`const card = sva({ slots: ["root", "label"], variants: ${slotVariants} });
      card({ classNames: { ${cursor} } });`),
    ).toStrictEqual(expect.arrayContaining(["root", "label"]));
  });
});
