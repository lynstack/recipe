import type { Call } from "./example.ts";
import { exampleOf } from "./examples.ts";
import { formatCallResult } from "./format.ts";

const sources = import.meta.glob<string>("./recipes/**/*.ts", {
  eager: true,
  import: "default",
  query: "?raw",
});

/** Returns the code of the module of an example, as the docs show it. */
function sourceOf(name: string): string {
  const source = sources[`./recipes/${name}.ts`];
  if (source === undefined) {
    throw new Error(`${name} has no module in recipes`);
  }
  return source;
}

/**
 * Writes each of `calls` of an example's recipe and what it returns, or
 * the value of `slot` in what it returns.
 */
function formatCalls(
  name: string,
  calls: readonly Call[],
  slot?: string,
): string {
  const example = exampleOf(name);
  return calls
    .map((call) =>
      formatCallResult({
        call,
        name: example.name,
        slot,
        values: example.valuesOf(call),
      }),
    )
    .join("");
}

export { formatCalls, sourceOf };
