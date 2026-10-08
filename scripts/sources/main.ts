/**
 * Typechecks the sources of each package, with its tests and benchmarks,
 * with a TypeScript that the packages support, such as the oldest. The
 * apps of `consumers` check what users compile; this checks that the
 * types hold in the ways the tests use them, on that TypeScript too.
 *
 * It builds the packages first, since a package's benchmarks, and the
 * packages built on `@lynstack/recipe`, import them by name. Each package
 * is compiled with the options of `tsconfig.base.json`, without those
 * that the TypeScript does not have yet.
 *
 * Options:
 * - `--typescript <version>`: the TypeScript to compile with. Required.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { parseArgs } from "node:util";
import path from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const packages = ["recipe", "class-recipe", "native-recipe"] as const;

/** The first TypeScript of each compiler option added after 5.0. */
const OPTIONS_SINCE: Readonly<Record<string, string>> = {
  erasableSyntaxOnly: "5.8",
  isolatedDeclarations: "5.5",
};

const {
  values: { typescript },
} = parseArgs({ options: { typescript: { type: "string" } } });

if (typescript === undefined) {
  throw new Error("Pass the TypeScript to compile with: --typescript 5.4.5.");
}

/** Whether TypeScript `version` is `since` or newer. */
function isAtLeast(version: string, since: string): boolean {
  const [major = 0, minor = 0] = version.split(".").map(Number);
  const [sinceMajor = 0, sinceMinor = 0] = since.split(".").map(Number);
  return major > sinceMajor || (major === sinceMajor && minor >= sinceMinor);
}

/** The options of `tsconfig.base.json` that TypeScript `version` has. */
function baseOptionsFor(version: string): Readonly<Record<string, unknown>> {
  const base: unknown = JSON.parse(
    readFileSync(path.join(root, "tsconfig.base.json"), "utf8"),
  );
  if (
    typeof base !== "object" ||
    base === null ||
    !("compilerOptions" in base) ||
    typeof base.compilerOptions !== "object" ||
    base.compilerOptions === null
  ) {
    throw new TypeError("tsconfig.base.json has no compilerOptions.");
  }
  return Object.fromEntries(
    Object.entries(base.compilerOptions).filter(
      ([name]: readonly [string, unknown]) => {
        const since = OPTIONS_SINCE[name];
        return since === undefined || isAtLeast(version, since);
      },
    ),
  );
}

/** Installs TypeScript `version` in `folder` and returns its `tsc`. */
function installTypeScript(version: string, folder: string): string {
  execFileSync(
    "npm",
    ["install", "--no-save", "--no-package-lock", `typescript@${version}`],
    { cwd: folder, stdio: "inherit" },
  );
  return path.join(folder, "node_modules", "typescript", "bin", "tsc");
}

/** How to compile the sources of a package. */
interface Compiler {
  /** The `tsc` to compile with. */
  readonly tsc: string;
  /** The compiler options. */
  readonly compilerOptions: Readonly<Record<string, unknown>>;
  /** The folder to write each package's project to. */
  readonly folder: string;
}

/** Whether the sources of the package `name` compile with `compiler`. */
function compiles(name: string, compiler: Compiler): boolean {
  const project = path.join(root, "packages", name);
  const config = path.join(compiler.folder, `tsconfig.${name}.json`);
  writeFileSync(
    config,
    JSON.stringify({
      compilerOptions: compiler.compilerOptions,
      include: [path.join(project, "src"), path.join(project, "*.config.ts")],
    }),
  );
  return (
    spawnSync(process.execPath, [compiler.tsc, "-p", config], {
      cwd: project,
      stdio: "inherit",
    }).status === 0
  );
}

execFileSync("pnpm", ["build"], { cwd: root, stdio: "inherit" });
const folder = mkdtempSync(path.join(os.tmpdir(), "lynstack-sources-"));
try {
  const compiler: Compiler = {
    compilerOptions: baseOptionsFor(typescript),
    folder,
    tsc: installTypeScript(typescript, folder),
  };
  const failed = packages.filter((name: string) => !compiles(name, compiler));
  if (failed.length > 0) {
    throw new Error(
      `The sources of ${failed.join(", ")} do not compile with TypeScript ${typescript}.`,
    );
  }
} finally {
  rmSync(folder, { force: true, recursive: true });
}
