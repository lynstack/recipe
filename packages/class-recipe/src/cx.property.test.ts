import type { Arbitrary, LetrecTypedTie } from "fast-check";
import {
  array,
  assert,
  constantFrom,
  dictionary,
  double,
  integer,
  letrec,
  oneof,
  property,
  string,
} from "fast-check";
import { describe, expect, it } from "vitest";
import { clsx } from "clsx";

import type { ClassArray, ClassValue } from "./cx.js";
import { cx } from "./cx.js";

interface ClassValues {
  readonly value: ClassValue;
}

function classValues(tie: LetrecTypedTie<ClassValues>): {
  readonly value: Arbitrary<ClassValue>;
} {
  const value = tie("value");
  return {
    value: oneof(
      { depthSize: "small", withCrossShrink: true },
      string(),
      constantFrom("flex", "p-2", " grid ", ""),
      integer(),
      double(),
      constantFrom(undefined, null, true, false),
      array(value, { maxLength: 4 }),
      dictionary(string(), constantFrom(0, 1, "", "x", null, true, false), {
        maxKeys: 4,
      }),
    ),
  };
}

const { value: classValue } = letrec(classValues);

function returnsWhatClsxReturns(inputs: ClassArray): void {
  expect(cx(...inputs)).toBe(clsx(...inputs));
}

describe(cx, () => {
  it("returns what clsx returns for any input", () => {
    assert(
      property(array(classValue, { maxLength: 6 }), returnsWhatClsxReturns),
    );
  });
});
