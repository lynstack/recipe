import type { Example } from "./example.ts";

type Registry = Readonly<Record<string, Example>>;

const registries = import.meta.glob<Registry>("./registry/*/*.ts", {
  eager: true,
  import: "examples",
});

/**
 * The examples of the docs, by the path of their recipe in `recipes`: the
 * package, the page, and the recipe, which the registry of the page names.
 */
const examples: ReadonlyMap<string, Example> = new Map(
  Object.entries(registries).flatMap(
    ([path, registry]: readonly [string, Registry]) => {
      const page = path.slice("./registry/".length, -".ts".length);
      return Object.entries(registry).map(
        ([recipe, example]: readonly [string, Example]) =>
          [`${page}/${recipe}`, example] as const,
      );
    },
  ),
);

/**
 * Returns the example named `name`.
 *
 * @throws {RangeError} When no registry lists it.
 */
function exampleOf(name: string): Example {
  const example = examples.get(name);
  if (example === undefined) {
    throw new RangeError(`No registry lists an example named ${name}`);
  }
  return example;
}

export { exampleOf, examples };
