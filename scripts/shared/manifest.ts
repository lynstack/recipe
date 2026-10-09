import { field, optionalStringField, readJson } from "./json.ts";

type Dependencies = Readonly<Record<string, string>>;

/**
 * What a `package.json` lists: its dependencies, and, for a package that
 * others install, its name, version, and the files it publishes.
 */
interface Manifest {
  readonly dependencies: Dependencies;
  readonly devDependencies: Dependencies;
  readonly name: string | undefined;
  readonly version: string | undefined;
  readonly exports: unknown;
  readonly files: unknown;
}

function isDependencies(value: unknown): value is Dependencies {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((range: unknown) => typeof range === "string")
  );
}

function dependenciesField(value: unknown, key: string): Dependencies {
  const dependencies = field(value, key);
  return isDependencies(dependencies) ? dependencies : {};
}

function readManifest(file: string): Manifest {
  const value = readJson(file);
  return {
    dependencies: dependenciesField(value, "dependencies"),
    devDependencies: dependenciesField(value, "devDependencies"),
    exports: field(value, "exports"),
    files: field(value, "files"),
    name: optionalStringField(value, "name"),
    version: optionalStringField(value, "version"),
  };
}

export { isDependencies, readManifest };
export type { Dependencies, Manifest };
