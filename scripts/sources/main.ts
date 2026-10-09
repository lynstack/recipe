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
import { parseArgs } from "node:util";
import path from "node:path";
import { writeFileSync } from "node:fs";

import { field, readJson } from "../shared/json.ts";
import { packageNames, packagesFolder, root } from "../shared/workspace.ts";
import { run, succeeds } from "../shared/commands.ts";
import { hasCompilerOption } from "../shared/typescript.ts";
import { withTemporaryFolder } from "../shared/files.ts";

const {
  values: { typescript },
} = parseArgs({ options: { typescript: { type: "string" } } });

if (typescript === undefined) {
  throw new Error("Pass the TypeScript to compile with: --typescript 5.4.5.");
}

/** The options of `tsconfig.base.json` that TypeScript `version` has. */
function baseOptionsFor(version: string): Readonly<Record<string, unknown>> {
  const options = field(
    readJson(path.join(root, "tsconfig.base.json")),
    "compilerOptions",
  );
  if (typeof options !== "object" || options === null) {
    throw new TypeError("tsconfig.base.json has no compilerOptions.");
  }
  return Object.fromEntries(
    Object.entries(options).filter(([name]: readonly [string, unknown]) =>
      hasCompilerOption(version, name),
    ),
  );
}

/** Installs TypeScript `version` in `folder` and returns its `tsc`. */
function installTypeScript(version: string, folder: string): string {
  run(
    "npm",
    ["install", "--no-save", "--no-package-lock", `typescript@${version}`],
    folder,
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
  const project = path.join(packagesFolder, name);
  const config = path.join(compiler.folder, `tsconfig.${name}.json`);
  writeFileSync(
    config,
    JSON.stringify({
      compilerOptions: compiler.compilerOptions,
      include: [
        path.join(project, "src"),
        path.join(project, "bench"),
        path.join(project, "*.config.ts"),
      ],
    }),
  );
  return succeeds(process.execPath, [compiler.tsc, "-p", config], project);
}

run("pnpm", ["build"], root);
const failed = withTemporaryFolder("sources", (folder: string) => {
  const compiler: Compiler = {
    compilerOptions: baseOptionsFor(typescript),
    folder,
    tsc: installTypeScript(typescript, folder),
  };
  return packageNames().filter((name: string) => !compiles(name, compiler));
});
if (failed.length > 0) {
  throw new Error(
    `The sources of ${failed.join(", ")} do not compile with TypeScript ${typescript}.`,
  );
}
