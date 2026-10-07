import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styles = {
  finish: (style: Style): Style => Object.freeze(style),
  initial: (recipeBase: Style | undefined): Style => recipeBase ?? {},
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};

const base: Style = {
  alignItems: "center",
  borderRadius: 6,
  display: "inline-flex",
  fontWeight: 500,
};

const controlConfig = {
  base,
  variants: {
    size: {
      sm: { fontSize: 14, height: 32, paddingInline: 12 },
      md: { height: 40, paddingInline: 16 },
      lg: { fontSize: 18, height: 48, paddingInline: 24 },
    },
    disabled: {
      true: { opacity: 0.5, pointerEvents: "none" },
      false: {},
    },
  },
  defaultVariants: { size: "md", disabled: false },
} as const;

const buttonConfig = {
  variants: {
    variant: {
      primary: { backgroundColor: "#2563eb", color: "#fff" },
      secondary: { backgroundColor: "#f3f4f6", color: "#111827" },
      danger: { backgroundColor: "#dc2626", color: "#fff" },
      ghost: { backgroundColor: "transparent" },
    },
  },
  compoundVariants: [
    { variants: { variant: "danger", size: "lg" }, value: { fontWeight: 700 } },
    {
      variants: { variant: ["ghost", "secondary"], disabled: true },
      value: { borderStyle: "dashed" },
    },
  ],
  defaultVariants: { variant: "primary" },
} as const;

const oneConfig = {
  ...controlConfig,
  ...buttonConfig,
  variants: { ...controlConfig.variants, ...buttonConfig.variants },
  defaultVariants: {
    ...controlConfig.defaultVariants,
    ...buttonConfig.defaultVariants,
  },
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "danger", size: "lg" },
  { variant: "ghost", size: "sm", disabled: true },
  { variant: "danger", size: "sm", disabled: true },
] as const;

type Selector = (selection: (typeof selections)[number]) => Style;

type Selectors = Readonly<Record<string, Selector>>;

const cachedRecipe = createRecipeKind(styles);
const uncachedRecipe = createRecipeKind({ ...styles, cache: false });

const oneConfigOf = (styleRecipe: typeof cachedRecipe): Selector =>
  styleRecipe(oneConfig);

const composedOf = (styleRecipe: typeof cachedRecipe): Selector =>
  styleRecipe({ ...buttonConfig, composes: [styleRecipe(controlConfig)] });

const cached = {
  composed: composedOf(cachedRecipe),
  "one config": oneConfigOf(cachedRecipe),
};

const uncached = {
  composed: composedOf(uncachedRecipe),
  "one config": oneConfigOf(uncachedRecipe),
};

const expected = selections.map((each) => uncached["one config"](each));

/** Benchmarks the selectors, each calling every selection. */
async function compare(
  context: TestContext,
  selectors: Selectors,
): ReturnType<TestContext["bench"]["compare"]> {
  const { bench } = context;
  let last: Style = {};
  const result = await bench.compare(
    ...Object.entries(selectors).map(
      ([name, selector]: readonly [string, Selector]) =>
        bench(name, () => {
          for (const selection of selections) {
            last = selector(selection);
          }
        }),
    ),
  );
  expect(last).toStrictEqual(expected.at(-1));
  return result;
}

describe("composed recipe", () => {
  it.for([...Object.entries(cached), ...Object.entries(uncached)])(
    "%s returns the values of one config",
    ([, selector]: readonly [string, Selector]) => {
      expect(selections.map((each) => selector(each))).toStrictEqual(expected);
    },
  );

  it("is faster with the cache", async (context: TestContext) => {
    expect.hasAssertions();

    const result = await compare(context, {
      cached: cached.composed,
      uncached: uncached.composed,
    });

    expect(result.get("cached")).toBeFasterThan(result.get("uncached"));
  });

  it.for([
    ["with the cache", cached],
    ["without the cache", uncached],
  ] as const)(
    "compares with one config, %s",
    async (
      [, selectors]: readonly [string, Selectors],
      context: TestContext,
    ) => {
      expect.hasAssertions();

      await compare(context, selectors);
    },
  );
});
