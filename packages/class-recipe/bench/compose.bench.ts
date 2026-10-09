import { createRecipes, cva } from "@lynstack/class-recipe";
import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2";

const controlConfig = {
  base,
  variants: {
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
      false: "",
    },
  },
  defaultVariants: { size: "md", disabled: false },
} as const;

const buttonConfig = {
  variants: {
    size: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-3",
    },
    variant: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      danger: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
      ghost: "bg-transparent hover:bg-gray-50",
    },
  },
  compoundVariants: [
    { variants: { variant: "danger", size: "lg" }, className: "font-bold" },
    {
      variants: { variant: ["outline", "ghost"], disabled: true },
      className: "border-dashed",
    },
  ],
  defaultVariants: { variant: "primary" },
} as const;

const oneConfig = {
  ...buttonConfig,
  base,
  variants: {
    ...controlConfig.variants,
    ...buttonConfig.variants,
    size: {
      sm: "h-8 px-3 text-sm gap-1",
      md: "h-10 px-4 gap-2",
      lg: "h-12 px-6 text-lg gap-3",
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
  { variant: "outline", size: "sm", disabled: true },
  { variant: "ghost", className: "w-full" },
  { variant: "danger", size: "sm", disabled: true, className: "mt-2" },
] as const;

type Recipe = (props: (typeof selections)[number]) => string;

type Recipes = Readonly<Record<string, Recipe>>;

const uncachedCva = createRecipes({ cache: false }).cva;

const cached = {
  composed: cva({ ...buttonConfig, composes: [cva(controlConfig)] }),
  "one config": cva(oneConfig),
};

const uncached = {
  composed: uncachedCva({
    ...buttonConfig,
    composes: [uncachedCva(controlConfig)],
  }),
  "one config": uncachedCva(oneConfig),
};

const expected = selections.map((each) => uncached["one config"](each));

/** Benchmarks the recipes, each calling every selection. */
async function compare(
  context: TestContext,
  recipes: Recipes,
): ReturnType<TestContext["bench"]["compare"]> {
  const { bench } = context;
  let length = 0;
  const result = await bench.compare(
    ...Object.entries(recipes).map(
      ([name, recipe]: readonly [string, Recipe]) =>
        bench(name, () => {
          for (const selection of selections) {
            length += recipe(selection).length;
          }
        }),
    ),
  );
  expect(length).toBeGreaterThan(0);
  return result;
}

describe("composed recipe", () => {
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
