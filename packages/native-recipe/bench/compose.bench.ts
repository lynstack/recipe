import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";
import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

const controlConfig = {
  base: { alignItems: "center", borderRadius: 8, flexDirection: "row" },
  variants: {
    size: {
      sm: { height: 32, paddingHorizontal: 12 },
      md: { height: 40, paddingHorizontal: 16 },
      lg: { height: 48, paddingHorizontal: 24 },
    },
    disabled: { true: { opacity: 0.5 }, false: {} },
  },
  defaultVariants: { size: "md", disabled: false },
} as const;

const buttonConfig = {
  base: { justifyContent: "center" },
  variants: {
    size: { sm: { gap: 4 }, md: { gap: 8 }, lg: { gap: 12 } },
    variant: {
      primary: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
      secondary: { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" },
      danger: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
      ghost: { backgroundColor: "transparent", borderColor: "transparent" },
    },
  },
  compoundVariants: [
    { variants: { variant: "danger", size: "lg" }, style: { borderWidth: 2 } },
    {
      variants: { variant: ["ghost", "secondary"], disabled: true },
      style: { borderStyle: "dashed" },
    },
  ],
  defaultVariants: { variant: "primary" },
} as const;

const oneConfig = {
  ...buttonConfig,
  base: { ...controlConfig.base, ...buttonConfig.base },
  variants: {
    ...controlConfig.variants,
    ...buttonConfig.variants,
    size: {
      sm: { height: 32, paddingHorizontal: 12, gap: 4 },
      md: { height: 40, paddingHorizontal: 16, gap: 8 },
      lg: { height: 48, paddingHorizontal: 24, gap: 12 },
    },
  },
  defaultVariants: {
    ...controlConfig.defaultVariants,
    ...buttonConfig.defaultVariants,
  },
} as const;

const controlSlotsConfig = {
  slots: ["root", "icon"],
  base: {
    root: controlConfig.base,
    icon: { flexShrink: 0 },
  },
  variants: {
    size: {
      sm: { root: controlConfig.variants.size.sm, icon: { width: 16 } },
      md: { root: controlConfig.variants.size.md, icon: { width: 20 } },
      lg: { root: controlConfig.variants.size.lg, icon: { width: 24 } },
    },
    disabled: { true: { root: { opacity: 0.5 } }, false: {} },
  },
  defaultVariants: controlConfig.defaultVariants,
} as const;

const buttonSlotsConfig = {
  slots: ["label"],
  base: { label: { fontWeight: "600" } },
  variants: {
    size: {
      sm: { root: { gap: 4 }, label: { fontSize: 14 } },
      md: { root: { gap: 8 }, label: { fontSize: 16 } },
      lg: { root: { gap: 12 }, label: { fontSize: 18 } },
    },
    variant: {
      primary: { root: { backgroundColor: "#2563eb" } },
      secondary: { root: { backgroundColor: "#f3f4f6" } },
      danger: { root: { backgroundColor: "#dc2626" }, icon: { opacity: 0.9 } },
      ghost: { root: { backgroundColor: "transparent" } },
    },
  },
  compoundVariants: [
    {
      variants: { variant: "danger", size: "lg" },
      styles: { label: { fontWeight: "700" } },
    },
    {
      variants: { variant: ["ghost", "secondary"], disabled: true },
      styles: { root: { borderStyle: "dashed" } },
    },
  ],
  defaultVariants: buttonConfig.defaultVariants,
} as const;

const oneSlotsConfig = {
  ...buttonSlotsConfig,
  slots: [...controlSlotsConfig.slots, ...buttonSlotsConfig.slots],
  base: { ...controlSlotsConfig.base, ...buttonSlotsConfig.base },
  variants: {
    ...controlSlotsConfig.variants,
    ...buttonSlotsConfig.variants,
    size: {
      sm: {
        root: oneConfig.variants.size.sm,
        icon: { width: 16 },
        label: { fontSize: 14 },
      },
      md: {
        root: oneConfig.variants.size.md,
        icon: { width: 20 },
        label: { fontSize: 16 },
      },
      lg: {
        root: oneConfig.variants.size.lg,
        icon: { width: 24 },
        label: { fontSize: 18 },
      },
    },
  },
  defaultVariants: oneConfig.defaultVariants,
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "danger", size: "lg" },
  { variant: "ghost", size: "sm", disabled: true },
  { variant: "danger", size: "sm", disabled: true },
] as const;

type Recipe = (props: (typeof selections)[number]) => object;

type Recipes = Readonly<Record<string, Recipe>>;

type Compared = Readonly<Record<"composed" | "one config", Recipe>>;

/** The recipes composed and of one config, with and without the cache. */
const recipes: Readonly<
  Record<string, { readonly cached: Compared; readonly uncached: Compared }>
> = {
  style: {
    cached: {
      composed: createStyleRecipe({
        ...buttonConfig,
        composes: [createStyleRecipe(controlConfig)],
      }),
      "one config": createStyleRecipe(oneConfig),
    },
    uncached: {
      composed: createStyleRecipe({
        ...buttonConfig,
        cache: false,
        composes: [createStyleRecipe({ ...controlConfig, cache: false })],
      }),
      "one config": createStyleRecipe({ ...oneConfig, cache: false }),
    },
  },
  "slot style": {
    cached: {
      composed: createSlotStyleRecipe({
        ...buttonSlotsConfig,
        composes: [createSlotStyleRecipe(controlSlotsConfig)],
      }),
      "one config": createSlotStyleRecipe(oneSlotsConfig),
    },
    uncached: {
      composed: createSlotStyleRecipe({
        ...buttonSlotsConfig,
        cache: false,
        composes: [
          createSlotStyleRecipe({ ...controlSlotsConfig, cache: false }),
        ],
      }),
      "one config": createSlotStyleRecipe({ ...oneSlotsConfig, cache: false }),
    },
  },
};

/** Benchmarks the recipes, each calling every selection. */
async function compare(
  context: TestContext,
  compared: Recipes,
  expected: unknown,
): ReturnType<TestContext["bench"]["compare"]> {
  const { bench } = context;
  let last: unknown = undefined;
  const result = await bench.compare(
    ...Object.entries(compared).map(
      ([name, recipe]: readonly [string, Recipe]) =>
        bench(name, () => {
          for (const selection of selections) {
            last = recipe(selection);
          }
        }),
    ),
  );
  expect(last).toStrictEqual(expected);
  return result;
}

describe.for(Object.entries(recipes))(
  "composed %s recipe",
  ([, { cached, uncached }]: readonly [
    string,
    { readonly cached: Compared; readonly uncached: Compared },
  ]) => {
    const expected = selections.map((each) => uncached["one config"](each));

    it.for([...Object.entries(cached), ...Object.entries(uncached)])(
      "%s returns the styles of one config",
      ([, recipe]: readonly [string, Recipe]) => {
        expect(selections.map((each) => recipe(each))).toStrictEqual(expected);
      },
    );

    it("is faster with the cache", async (context: TestContext) => {
      expect.hasAssertions();

      const result = await compare(
        context,
        { cached: cached.composed, uncached: uncached.composed },
        expected.at(-1),
      );

      expect(result.get("cached")).toBeFasterThan(result.get("uncached"));
    });

    it.for([
      ["with the cache", cached],
      ["without the cache", uncached],
    ] as const)(
      "compares with one config, %s",
      async (
        [, compared]: readonly [string, Recipes],
        context: TestContext,
      ) => {
        expect.hasAssertions();

        await compare(context, compared, expected.at(-1));
      },
    );
  },
);
