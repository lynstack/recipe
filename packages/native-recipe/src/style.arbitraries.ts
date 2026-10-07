import type { Arbitrary } from "fast-check";
import { tuple } from "fast-check";

type ByName<Value> = Readonly<Record<string, Value>>;

/** An object with a value of `valueOfName(name)` under each of `names`. */
function entriesOf<Value>(
  names: readonly string[],
  valueOfName: (name: string) => Arbitrary<Value>,
): Arbitrary<ByName<Value>> {
  const entries = names.map((name) =>
    valueOfName(name).map((value): readonly [string, Value] => [name, value]),
  );
  return tuple(...entries).map(
    (list: readonly (readonly [string, Value])[]): ByName<Value> =>
      Object.fromEntries(list),
  );
}

export { entriesOf };
export type { ByName };
