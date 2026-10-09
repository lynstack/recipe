import { createRecipes, sva } from "@lynstack/class-recipe";
import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

const controlConfig = {
  slots: ["root", "icon"],
  base: {
    root: "inline-flex items-center justify-center rounded-md font-medium transition-colors",
    icon: "shrink-0",
  },
  variants: {
    size: {
      sm: { root: "h-8 px-3 text-sm", icon: "size-4" },
      md: { root: "h-10 px-4", icon: "size-5" },
      lg: { root: "h-12 px-6 text-lg", icon: "size-6" },
    },
    loading: {
      true: { root: "cursor-wait", icon: "animate-spin" },
      false: {},
    },
  },
  defaultVariants: { size: "md", loading: false },
} as const;

const buttonConfig = {
  slots: ["label"],
  base: { label: "truncate" },
  variants: {
    size: {
      sm: { root: "gap-1", label: "leading-4" },
      md: { root: "gap-2", label: "leading-5" },
      lg: { root: "gap-3", label: "leading-6" },
    },
    variant: {
      primary: { root: "bg-blue-600 text-white hover:bg-blue-700" },
      secondary: { root: "bg-gray-100 text-gray-900 hover:bg-gray-200" },
      danger: { root: "bg-red-600 text-white", icon: "text-white" },
      ghost: { root: "bg-transparent hover:bg-gray-50", icon: "text-gray-500" },
    },
  },
  compoundVariants: [
    {
      variants: { variant: "danger", size: "lg" },
      classNames: { label: "font-bold" },
    },
    {
      variants: { variant: ["ghost", "secondary"], loading: true },
      classNames: { root: "opacity-75" },
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
      sm: {
        root: "h-8 px-3 text-sm gap-1",
        icon: "size-4",
        label: "leading-4",
      },
      md: { root: "h-10 px-4 gap-2", icon: "size-5", label: "leading-5" },
      lg: {
        root: "h-12 px-6 text-lg gap-3",
        icon: "size-6",
        label: "leading-6",
      },
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
  { variant: "ghost", classNames: { root: "w-full" } },
  { variant: "danger", size: "sm", classNames: { label: "uppercase" } },
] as const;

type ClassNames = Readonly<Record<string, string>>;

type Recipe = (props: (typeof selections)[number]) => ClassNames;

type Recipes = Readonly<Record<string, Recipe>>;

const uncachedSva = createRecipes({ cache: false }).sva;

const cached = {
  composed: sva({ ...buttonConfig, composes: [sva(controlConfig)] }),
  "one config": sva(oneConfig),
};

const uncached = {
  composed: uncachedSva({
    ...buttonConfig,
    composes: [uncachedSva(controlConfig)],
  }),
  "one config": uncachedSva(oneConfig),
};

const expected = selections.map((each) => uncached["one config"](each));

/** Benchmarks the slot recipes, each calling every selection. */
async function compare(
  context: TestContext,
  recipes: Recipes,
): ReturnType<TestContext["bench"]["compare"]> {
  const { bench } = context;
  let last: ClassNames = {};
  const result = await bench.compare(
    ...Object.entries(recipes).map(
      ([name, recipe]: readonly [string, Recipe]) =>
        bench(name, () => {
          for (const selection of selections) {
            last = recipe(selection);
          }
        }),
    ),
  );
  expect(last).toStrictEqual(expected.at(-1));
  return result;
}

describe("composed slot recipe", () => {
  it.for([...Object.entries(cached), ...Object.entries(uncached)])(
    "%s returns the classes of one config",
    ([, recipe]: readonly [string, Recipe]) => {
      expect(selections.map((each) => recipe(each))).toStrictEqual(expected);
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
    async ([, recipes]: readonly [string, Recipes], context: TestContext) => {
      expect.hasAssertions();

      await compare(context, recipes);
    },
  );
});
