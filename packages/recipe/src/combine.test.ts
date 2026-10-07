import { describe, expect, expectTypeOf, it } from "vitest";

import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Classes = readonly string[];

/**
 * Returns a kind of lists of classes, which combines lists by concatenating
 * them, with the calls of each of its functions.
 */
function recordingKind(): {
  readonly calls: readonly (readonly [string, ...Classes[]])[];
  readonly kind: {
    readonly initial: (base: Classes | undefined) => Classes;
    readonly reduce: (classes: Classes, value: Classes) => Classes;
    readonly combine: (first: Classes, second: Classes) => Classes;
    readonly cache: false;
  };
} {
  const calls: (readonly [string, ...Classes[]])[] = [];
  return {
    calls,
    kind: {
      cache: false,
      combine: (first, second) => {
        calls.push(["combine", first, second]);
        return [...first, ...second];
      },
      initial: (base) => {
        calls.push(["initial", base ?? []]);
        return [...(base ?? [])];
      },
      reduce: (classes, value) => {
        calls.push(["reduce", value]);
        return [...classes, ...value];
      },
    },
  };
}

describe("a recipe whose kind combines values", () => {
  it("reduces one value for its bases and one for each option", () => {
    const { calls, kind } = recordingKind();
    const listRecipe = createRecipeKind(kind);
    const control = listRecipe({
      base: ["control"],
      variants: { size: { sm: ["control-sm"] } },
    });
    const button = listRecipe({
      composes: [control],
      base: ["button"],
      variants: { size: { sm: ["button-sm"] } },
    });
    const created = calls.length;

    expect(button({ size: "sm" })).toStrictEqual([
      "control",
      "button",
      "control-sm",
      "button-sm",
    ]);
    expect(calls.slice(created)).toStrictEqual([
      ["initial", ["control", "button"]],
      ["reduce", ["control-sm", "button-sm"]],
    ]);
  });

  it("combines values only when it is created", () => {
    const { calls, kind } = recordingKind();
    const listRecipe = createRecipeKind(kind);
    const control = listRecipe({ base: ["control"], variants: {} });
    const button = listRecipe({
      composes: [control],
      base: ["button"],
      variants: {},
    });
    const combines = (): number =>
      calls.filter(([name]) => name === "combine").length;

    expect(combines()).toBe(1);

    button();
    button();

    expect(combines()).toBe(1);
  });

  it("combines no value of a recipe that composes none", () => {
    const { calls, kind } = recordingKind();
    const button = createRecipeKind(kind)({
      base: ["button"],
      variants: { size: { sm: ["button-sm"] } },
    });

    expect(button({ size: "sm" })).toStrictEqual(["button", "button-sm"]);
    expect(calls.map(([name]) => name)).toStrictEqual(["initial", "reduce"]);
  });

  it("combines the values of each slot of a slot recipe", () => {
    const { calls, kind } = recordingKind();
    const slotListRecipe = createSlotRecipeKind(kind);
    const field = slotListRecipe({
      slots: ["root"],
      base: { root: ["field"] },
      variants: { size: { sm: { root: ["field-sm"] } } },
    });
    const select = slotListRecipe({
      composes: [field],
      slots: ["label"],
      base: { root: ["select"], label: ["select-label"] },
      variants: { size: { sm: { root: ["select-sm"] } } },
    });
    const created = calls.length;

    expect(select({ size: "sm" })).toStrictEqual({
      root: ["field", "select", "field-sm", "select-sm"],
      label: ["select-label"],
    });
    expect(calls.slice(created)).toStrictEqual([
      ["initial", ["field", "select"]],
      ["initial", ["select-label"]],
      ["reduce", ["field-sm", "select-sm"]],
    ]);
  });

  it("infers the kind's value for a combine whose parameters have no types", () => {
    const listRecipe = createRecipeKind({
      initial: (base: Classes = []): Classes => [...base],
      reduce: (classes, value: Classes) => [...classes, ...value],
      combine: (first, second) => [...first, ...second],
    });
    const control = listRecipe({ variants: { size: { sm: ["control-sm"] } } });
    const button = listRecipe({
      composes: [control],
      variants: { size: { sm: ["button-sm"] } },
    });

    expectTypeOf(button({ size: "sm" })).toEqualTypeOf<Classes>();
    expect(button({ size: "sm" })).toStrictEqual(["control-sm", "button-sm"]);

    // @ts-expect-error: the kind's values are lists of classes.
    const sizes = listRecipe({ variants: { size: { sm: "sm" } } });

    expect(sizes({ size: "sm" })).toStrictEqual(["s", "m"]);
  });

  it("rejects a combine whose values have another type", () => {
    const sumRecipe = createRecipeKind<number, number>({
      initial: (): number => 0,
      reduce: (sum: number, value: number): number => sum + value,
      // @ts-expect-error: the kind's values are numbers, not strings.
      combine: (first: string, second: string): string => first + second,
    });
    const sizes = sumRecipe({ variants: { size: { sm: 2 } } });

    expect(sizes({ size: "sm" })).toBe(2);
  });
});
