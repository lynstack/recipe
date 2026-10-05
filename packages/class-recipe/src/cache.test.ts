import { describe, expect, it } from "vitest";

import { cva, sva } from "./index.js";
import type { ClassJoin } from "./join.js";
import { createRecipes } from "./create-recipes.js";

/** Returns a join that records the class strings of each call. */
function recordingJoin(): {
  readonly calls: (readonly string[])[];
  readonly join: ClassJoin;
} {
  const calls: (readonly string[])[] = [];
  return {
    calls,
    join: (...classNames) => {
      calls.push(classNames);
      return classNames.join(" ");
    },
  };
}

describe("the cache setting of a recipe's config", () => {
  it("builds the class name on every call of that recipe only", () => {
    const { calls, join } = recordingJoin();
    const recipes = createRecipes({ join });
    const uncached = recipes.cva({
      cache: false,
      variants: { size: { sm: "h-8" } },
    });
    const cached = recipes.cva({ variants: { tone: { muted: "opacity-60" } } });

    expect(uncached({ size: "sm" })).toBe("h-8");
    expect(uncached({ size: "sm" })).toBe("h-8");
    expect(cached({ tone: "muted" })).toBe("opacity-60");
    expect(cached({ tone: "muted" })).toBe("opacity-60");
    expect(calls).toStrictEqual([["h-8"], ["h-8"], ["opacity-60"]]);
  });

  it("caches the class name when createRecipes turns the cache off", () => {
    const { calls, join } = recordingJoin();
    const button = createRecipes({ cache: false, join }).cva({
      cache: true,
      variants: { size: { sm: "h-8" } },
    });

    expect(button({ size: "sm" })).toBe("h-8");
    expect(button({ size: "sm" })).toBe("h-8");
    expect(calls).toStrictEqual([["h-8"]]);
  });

  it("rejects a setting that is not a boolean", () => {
    const button = cva({
      // @ts-expect-error cache must be a boolean
      cache: "no",
      variants: { size: { sm: "h-8" } },
    });

    expect(button({ size: "sm" })).toBe("h-8");
  });
});

describe("the cache setting of a slot recipe's config", () => {
  it("returns a new object on every call of that slot recipe only", () => {
    const uncached = sva({
      cache: false,
      slots: ["root"],
      variants: { size: { sm: { root: "h-8" } } },
    });
    const cached = sva({
      slots: ["root"],
      variants: { size: { sm: { root: "h-8" } } },
    });

    expect(uncached({ size: "sm" })).not.toBe(uncached({ size: "sm" }));
    expect(uncached({ size: "sm" })).toStrictEqual({ root: "h-8" });
    expect(Object.isFrozen(uncached({ size: "sm" }))).toBe(true);
    expect(cached({ size: "sm" })).toBe(cached({ size: "sm" }));
  });

  it("caches the object when createRecipes turns the cache off", () => {
    const card = createRecipes({ cache: false }).sva({
      cache: true,
      slots: ["root"],
      variants: { size: { sm: { root: "h-8" } } },
    });

    expect(card({ size: "sm" })).toBe(card({ size: "sm" }));
  });

  it("rejects a setting that is not a boolean", () => {
    const card = sva({
      // @ts-expect-error cache must be a boolean
      cache: "no",
      slots: ["root"],
      variants: { size: { sm: { root: "h-8" } } },
    });

    expect(card({ size: "sm" })).toStrictEqual({ root: "h-8" });
  });
});
