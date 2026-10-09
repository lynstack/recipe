import { cpSync, existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

import { showDifference } from "../shared/commands.ts";

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

/** The paths of the declaration files in `folder`, relative to it. */
function declarationFilesIn(folder: string): readonly string[] {
  if (!existsSync(folder)) {
    return [];
  }
  return readdirSync(folder, { encoding: "utf8", recursive: true })
    .filter((file: string) => file.endsWith(".d.ts"))
    .toSorted();
}

/** Whether `first` and `second` hold the same declaration files. */
function sameDeclarations(first: string, second: string): boolean {
  const files = declarationFilesIn(first);
  const others = declarationFilesIn(second);
  return (
    files.length === others.length &&
    files.every(
      (file: string, index: number) =>
        file === others[index] &&
        readFileSync(path.join(first, file), "utf8") ===
          readFileSync(path.join(second, file), "utf8"),
    )
  );
}

/**
 * Whether the declarations that the installed `app` emitted are those in
 * `kept`. If not, writes how they differ.
 */
function matchesDeclarations(app: string, kept: string): boolean {
  const emitted = path.join(app, "out");
  if (sameDeclarations(kept, emitted)) {
    return true;
  }
  showDifference(kept, emitted);
  return false;
}

/** Replaces the declarations in `kept` with those that `app` emitted. */
function updateDeclarations(app: string, kept: string): void {
  rmSync(kept, { force: true, recursive: true });
  cpSync(path.join(app, "out"), kept, { recursive: true });
}

export { growsLinearly, matchesDeclarations, updateDeclarations };
