import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

import { createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

type Styles = Readonly<Record<string, Style>>;

const styles = {
  finish: (style: Style): Style => Object.freeze(style),
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};

const controlConfig = {
  slots: ["root", "icon"],
  base: {
    root: { alignItems: "center", borderRadius: 6, display: "inline-flex" },
    icon: { flexShrink: 0 },
  },
  variants: {
    size: {
      sm: { root: { height: 32, paddingInline: 12 }, icon: { width: 16 } },
      md: { root: { height: 40, paddingInline: 16 }, icon: { width: 20 } },
      lg: { root: { height: 48 }, icon: { width: 24 } },
    },
    loading: {
      true: { root: { cursor: "wait" }, icon: { opacity: 0.5 } },
      false: {},
    },
  },
  defaultVariants: { size: "md", loading: false },
} as const;

const buttonConfig = {
  slots: ["label"],
  base: { label: { fontWeight: 500 } },
  variants: {
    variant: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        label: { color: "#fff" },
      },
      secondary: {
        root: { backgroundColor: "#f3f4f6" },
        label: { color: "#111827" },
      },
      danger: { root: { backgroundColor: "#dc2626" }, icon: { color: "#fff" } },
      ghost: {
        root: { backgroundColor: "transparent" },
        icon: { color: "#6b7280" },
      },
    },
    size: { lg: { label: { fontSize: 18 } } },
  },
  compoundVariants: [
    {
      variants: { variant: "danger", size: "lg" },
      value: { label: { fontWeight: 700 } },
    },
    {
      variants: { variant: ["ghost", "secondary"], loading: true },
      value: { root: { opacity: 0.75 } },
    },
  ],
  defaultVariants: { variant: "primary" },
} as const;

const oneConfig = {
  ...buttonConfig,
  slots: [...controlConfig.slots, ...buttonConfig.slots],
  base: { ...controlConfig.base, ...buttonConfig.base },
  variants: {
    ...controlConfig.variants,
    ...buttonConfig.variants,
    size: {
      ...controlConfig.variants.size,
      lg: { ...controlConfig.variants.size.lg, label: { fontSize: 18 } },
    },
  },
  defaultVariants: {
    ...controlConfig.defaultVariants,
    ...buttonConfig.defaultVariants,
  },
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "danger", size: "lg" },
  { variant: "ghost", size: "sm", loading: true },
  { variant: "danger", size: "sm", loading: true },
] as const;

type Selector = (selection: (typeof selections)[number]) => Styles;

type Selectors = Readonly<Record<string, Selector>>;

const cachedRecipe = createSlotRecipeKind(styles);
const uncachedRecipe = createSlotRecipeKind({ ...styles, cache: false });

const oneConfigOf = (slotRecipe: typeof cachedRecipe): Selector =>
  slotRecipe(oneConfig);

const composedOf = (slotRecipe: typeof cachedRecipe): Selector =>
  slotRecipe({ ...buttonConfig, composes: [slotRecipe(controlConfig)] });

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
  let last: Styles = {};
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

describe("composed slot recipe", () => {
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
