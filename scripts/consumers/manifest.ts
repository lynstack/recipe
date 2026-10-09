import { readFileSync } from "node:fs";

type Dependencies = Readonly<Record<string, string>>;

/**
 * What the `package.json` of an app lists: its dependencies, and, for a
 * library that other apps install, its name, version, and the files it
 * publishes.
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

function field(value: unknown, key: string): unknown {
  return typeof value === "object" && value !== null
    ? Object.getOwnPropertyDescriptor(value, key)?.value
    : undefined;
}

function dependenciesField(value: unknown, key: string): Dependencies {
  const dependencies = field(value, key);
  return isDependencies(dependencies) ? dependencies : {};
}

function stringField(value: unknown, key: string): string | undefined {
  const text = field(value, key);
  return typeof text === "string" ? text : undefined;
}

function parseJson(text: string): unknown {
  const value: unknown = JSON.parse(text);
  return value;
}

function readManifest(file: string): Manifest {
  const value = parseJson(readFileSync(file, "utf8"));
  return {
    dependencies: dependenciesField(value, "dependencies"),
    devDependencies: dependenciesField(value, "devDependencies"),
    exports: field(value, "exports"),
    files: field(value, "files"),
    name: stringField(value, "name"),
    version: stringField(value, "version"),
  };
}

export { isDependencies, parseJson, readManifest };
export type { Dependencies, Manifest };
