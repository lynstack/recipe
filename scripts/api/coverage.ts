import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/** The names that the declarations `api` export. */
function exportsOf(api: string): readonly string[] {
  const list = [...api.matchAll(/^export \{(?<names>[^}]*)\};$/gmu)].at(-1)
    ?.groups?.["names"];
  return (list ?? "")
    .split(",")
    .map((name: string) => name.replace(/^\s*type\s+/u, "").trim())
    .filter((name: string) => name !== "")
    .map((name: string) => name.split(/\s+as\s+/u).at(-1) ?? name);
}

/**
 * The names that `text` imports or re-exports from `module`, or names as
 * `import("module").Name`, as a declaration prints it.
 */
function namesFrom(text: string, module: string): readonly string[] {
  const quoted = `"${module}"`;
  const listed = [
    ...text.matchAll(
      /(?:import|export)(?:\s+type)?\s*\{(?<names>[^}]*)\}\s*from\s*(?<from>"[^"]+")/gu,
    ),
  ]
    .filter((match: RegExpExecArray) => match.groups?.["from"] === quoted)
    .flatMap((match: RegExpExecArray) =>
      (match.groups?.["names"] ?? "").split(","),
    )
    .map(
      (name: string) =>
        name
          .replace(/^\s*type\s+/u, "")
          .trim()
          .split(/\s+as\s+/u)[0] ?? "",
    );
  const printed = [
    ...text.matchAll(/import\("(?<from>[^"]+)"\)\.(?<name>\w+)/gu),
  ]
    .filter((match: RegExpExecArray) => match.groups?.["from"] === module)
    .map((match: RegExpExecArray) => match.groups?.["name"] ?? "");
  return [...listed, ...printed];
}

/** The files in each folder of `folder` whose names match `pattern`. */
function filesInFolders(folder: string, pattern: RegExp): readonly string[] {
  if (!existsSync(folder)) {
    return [];
  }
  return readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const app = path.join(folder, entry.name);
      return readdirSync(app)
        .filter((file: string) => pattern.test(file))
        .map((file: string) => path.join(app, file));
    });
}

/**
 * The exports of the package in `packages/<name>` that nothing names: not
 * the sources of its apps in `consumers/<name>`, nor the declarations
 * they emit, which `api/consumers/<name>` keeps, nor the API of another
 * package of the workspace, which a package built on it names.
 */
function uncoveredExportsOf(root: string, name: string): readonly string[] {
  const module = `@lynstack/${name}`;
  const api = path.join(root, "api");
  const others = readdirSync(api)
    .filter((file: string) => file.endsWith(".d.ts") && file !== `${name}.d.ts`)
    .map((file: string) => path.join(api, file));
  const named = new Set(
    [
      ...filesInFolders(path.join(root, "consumers", name), /\.tsx?$/u),
      ...filesInFolders(path.join(api, "consumers", name), /\.d\.ts$/u),
      ...others,
    ].flatMap((file: string) => namesFrom(readFileSync(file, "utf8"), module)),
  );
  return exportsOf(readFileSync(path.join(api, `${name}.d.ts`), "utf8")).filter(
    (exported: string) => !named.has(exported),
  );
}

export { uncoveredExportsOf };
