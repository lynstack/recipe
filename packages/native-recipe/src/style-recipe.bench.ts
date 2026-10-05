import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

import { createRecipeKind } from "@lynstack/recipe";
import { createStyleRecipe } from "@lynstack/native-recipe";

type Style = Readonly<Record<string, unknown>>;

const base = {
  alignItems: "center",
  borderRadius: 8,
  flexDirection: "row",
  justifyContent: "center",
} as const;

const config = {
  base,
  variants: {
    variant: {
      primary: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
      secondary: { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" },
      danger: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
      ghost: { backgroundColor: "transparent", borderColor: "transparent" },
    },
    size: {
      sm: { height: 32, paddingHorizontal: 12 },
      md: { height: 40, paddingHorizontal: 16 },
      lg: { height: 48, paddingHorizontal: 24 },
    },
    disabled: {
      true: { opacity: 0.5 },
      false: {},
    },
  },
  compoundVariants: [
    { variants: { variant: "danger", size: "lg" }, style: { borderWidth: 2 } },
    {
      variants: { variant: ["ghost", "secondary"], disabled: true },
      style: { borderStyle: "dashed" },
    },
  ],
  defaultVariants: { variant: "primary", size: "md", disabled: false },
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "danger", size: "lg" },
  { variant: "ghost", size: "sm", disabled: true },
  { variant: "danger", size: "sm", disabled: true },
] as const;

const expected = [
  {
    ...base,
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    height: 40,
    paddingHorizontal: 16,
  },
  {
    ...base,
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    height: 40,
    paddingHorizontal: 16,
  },
  {
    ...base,
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
    height: 48,
    paddingHorizontal: 24,
    borderWidth: 2,
  },
  {
    ...base,
    backgroundColor: "transparent",
    borderColor: "transparent",
    height: 32,
    paddingHorizontal: 12,
    opacity: 0.5,
    borderStyle: "dashed",
  },
  {
    ...base,
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
    height: 32,
    paddingHorizontal: 12,
    opacity: 0.5,
  },
];

type Selector = (selection: (typeof selections)[number]) => Style;

/** The same recipe, built on every call. */
const uncached: Selector = createRecipeKind({
  cache: false,
  finish: (style: Style): Style => Object.freeze(style),
  initial: (recipeBase: Style | undefined): Style => ({ ...recipeBase }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
})({
  ...config,
  compoundVariants: config.compoundVariants.map((compound) => ({
    value: compound.style,
    variants: compound.variants,
  })),
});

const selectors: Readonly<Record<string, Selector>> = {
  cached: createStyleRecipe(config),
  uncached,
};

describe("style recipe", () => {
  it.for(Object.entries(selectors))(
    "%s returns the expected styles",
    ([, selector]: readonly [string, Selector]) => {
      expect(selections.map((selection) => selector(selection))).toStrictEqual(
        expected,
      );
    },
  );

  it("is faster with the cache", async ({ bench }: TestContext) => {
    expect.hasAssertions();

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
    expect(result.get("cached")).toBeFasterThan(result.get("uncached"));
  });
});
