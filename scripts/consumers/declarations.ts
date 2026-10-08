import { cpSync, existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

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
  spawnSync("git", ["diff", "--no-index", "--", kept, emitted], {
    stdio: "inherit",
  });
  return false;
}

/** Replaces the declarations in `kept` with those that `app` emitted. */
function updateDeclarations(app: string, kept: string): void {
  rmSync(kept, { force: true, recursive: true });
  cpSync(path.join(app, "out"), kept, { recursive: true });
}

export { matchesDeclarations, updateDeclarations };
