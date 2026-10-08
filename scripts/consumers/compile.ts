import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

/** The first TypeScript that has `isolatedDeclarations`. */
const ISOLATED_DECLARATIONS = { major: 5, minor: 5 } as const;

/** Whether `typescript` has `isolatedDeclarations`, which 5.5 added. */
function hasIsolatedDeclarations(typescript: string): boolean {
  const [major = 0, minor = 0] = typescript.split(".").map(Number);
  return (
    major > ISOLATED_DECLARATIONS.major ||
    (major === ISOLATED_DECLARATIONS.major &&
      minor >= ISOLATED_DECLARATIONS.minor)
  );
}

/**
 * Turns off `isolatedDeclarations` in the `tsconfig.json` of `app` for a
 * TypeScript without it, which then checks the rest of the app.
 */
function withoutIsolatedDeclarations(app: string): void {
  const file = path.join(app, "tsconfig.json");
  writeFileSync(
    file,
    readFileSync(file, "utf8").replace(
      /^\s*"isolatedDeclarations": true,\n/mu,
      "",
    ),
  );
}

/** Whether the app in `app` compiles. */
function compiles(app: string): boolean {
  return (
    spawnSync("pnpm", ["exec", "tsc", "-p", "tsconfig.json"], {
      cwd: app,
      stdio: "inherit",
    }).status === 0
  );
}

/**
 * How much larger a declaration two levels of composition deeper may be,
 * at most, when declarations grow linearly with the level.
 */
const LINEAR_GROWTH = 2;

/** The declaration of the constant `name` in the declarations `text`. */
function declarationOf(text: string, name: string): string {
  const declaration = text
    .split(/^(?=declare const |export )/mu)
    .find((part: string) => part.startsWith(`declare const ${name}:`));
  if (declaration === undefined) {
    throw new Error(`The declarations have no constant named ${name}.`);
  }
  return declaration;
}

/**
 * Whether the declarations of the recipes of each chain of `app`, a module
 * named `chain.ts` or ending in `-chain.ts`, each of whose recipes composes
 * the one before, grow linearly with their level. The recipe four levels
 * deep then takes less than twice the declaration of the one two levels
 * deep; a type that repeats the types of the recipes it composes takes at
 * least four times.
 */
function growsLinearly(app: string): boolean {
  const out = path.join(app, "out");
  if (!existsSync(out)) {
    return true;
  }
  return readdirSync(out)
    .filter((file: string) => /(?:^|-)chain\.d\.ts$/u.test(file))
    .every((file: string) => {
      const text = readFileSync(path.join(out, file), "utf8");
      return (
        declarationOf(text, "level4").length <
        LINEAR_GROWTH * declarationOf(text, "level2").length
      );
    });
}

export {
  compiles,
  growsLinearly,
  hasIsolatedDeclarations,
  withoutIsolatedDeclarations,
};
