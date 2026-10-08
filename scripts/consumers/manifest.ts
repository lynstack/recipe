import { readFileSync } from "node:fs";

type Dependencies = Readonly<Record<string, string>>;

/** The dependencies of an app, as its `package.json` lists them. */
interface Manifest {
  readonly dependencies: Dependencies;
  readonly devDependencies: Dependencies;
}

function isDependencies(value: unknown): value is Dependencies {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((range: unknown) => typeof range === "string")
  );
}

function dependenciesField(value: unknown, key: string): Dependencies {
  const dependencies: unknown =
    typeof value === "object" && value !== null
      ? Object.getOwnPropertyDescriptor(value, key)?.value
      : undefined;
  return isDependencies(dependencies) ? dependencies : {};
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
  };
}

export { isDependencies, parseJson, readManifest };
export type { Dependencies, Manifest };
