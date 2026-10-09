import { execFileSync, spawnSync } from "node:child_process";

/** Runs `command` in `cwd`, showing its output, and throws if it fails. */
function run(command: string, args: readonly string[], cwd: string): void {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

/** Runs `command` in `cwd`, showing its output, and returns whether it succeeds. */
function succeeds(
  command: string,
  args: readonly string[],
  cwd: string,
): boolean {
  return spawnSync(command, args, { cwd, stdio: "inherit" }).status === 0;
}

/** Writes how the file or folder `current` differs from `kept`. */
function showDifference(kept: string, current: string): void {
  spawnSync("git", ["diff", "--no-index", "--", kept, current], {
    stdio: "inherit",
  });
}

export { run, showDifference, succeeds };
