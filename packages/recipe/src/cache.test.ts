import { describe, expect, it } from "vitest";

import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Style = Readonly<Record<string, number>>;

/** A style kind that counts the results it builds. */
function countingStyleKind(cache?: boolean): {
  readonly builds: () => number;
  readonly kind: Parameters<typeof createRecipeKind<Style, Style>>[0];
} {
  let builds = 0;
  return {
    builds: () => builds,
    kind: {
      cache,
      finish: (style: Style): Style => Object.freeze(style),
      initial: (base: Style | undefined): Style => {
        builds += 1;
        return { ...base };
      },
      reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
    },
  };
}

describe("the cache setting of a recipe's config", () => {
  it("turns the cache off for that recipe only", () => {
    const { builds, kind } = countingStyleKind();
    const styleRecipe = createRecipeKind(kind);
    const uncached = styleRecipe({
      cache: false,
      variants: { size: { sm: { height: 32 } } },
    });
    const cached = styleRecipe({ variants: { size: { sm: { height: 32 } } } });

    expect(uncached({ size: "sm" })).not.toBe(uncached({ size: "sm" }));
    expect(uncached({ size: "sm" })).toStrictEqual({ height: 32 });
    expect(cached({ size: "sm" })).toBe(cached({ size: "sm" }));
    expect(builds()).toBe(4);
  });

  it("turns on the cache of an uncached kind", () => {
    const { builds, kind } = countingStyleKind(false);
    const sizes = createRecipeKind(kind)({
      cache: true,
      variants: { size: { sm: { height: 32 } } },
    });

    expect(sizes({ size: "sm" })).toBe(sizes({ size: "sm" }));
    expect(builds()).toBe(1);
  });

  it("rejects a setting that is not a boolean", () => {
    const { kind } = countingStyleKind();
    const sizes = createRecipeKind(kind)({
      // @ts-expect-error cache must be a boolean
      cache: "no",
      variants: { size: { sm: { height: 32 } } },
    });

    expect(sizes({ size: "sm" })).toStrictEqual({ height: 32 });
  });
});

describe("the cache setting of a slot recipe's config", () => {
  it("turns the cache off for that slot recipe only", () => {
    const { builds, kind } = countingStyleKind();
    const slotStyleRecipe = createSlotRecipeKind(kind);
    const uncached = slotStyleRecipe({
      cache: false,
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });
    const cached = slotStyleRecipe({
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(uncached({ size: "sm" })).not.toBe(uncached({ size: "sm" }));
    expect(uncached({ size: "sm" })).toStrictEqual({ root: { height: 32 } });
    expect(cached({ size: "sm" })).toBe(cached({ size: "sm" }));
    expect(builds()).toBe(4);
  });

  it("turns on the cache of an uncached kind", () => {
    const { builds, kind } = countingStyleKind(false);
    const card = createSlotRecipeKind(kind)({
      cache: true,
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(card({ size: "sm" })).toBe(card({ size: "sm" }));
    expect(builds()).toBe(1);
  });

  it("rejects a setting that is not a boolean", () => {
    const { kind } = countingStyleKind();
    const card = createSlotRecipeKind(kind)({
      // @ts-expect-error cache must be a boolean
      cache: "no",
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(card({ size: "sm" })).toStrictEqual({ root: { height: 32 } });
  });
});
