import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const base: Style = {
  alignItems: "center",
  borderRadius: 6,
  display: "inline-flex",
  fontWeight: 500,
};

const styles = {
  finish: (style: Style): Style => Object.freeze(style),
  initial: (recipeBase: Style | undefined): Style => recipeBase ?? {},
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};

const config = {
  base,
  variants: {
    variant: {
      primary: { backgroundColor: "#2563eb", color: "#fff" },
      secondary: { backgroundColor: "#f3f4f6", color: "#111827" },
      danger: { backgroundColor: "#dc2626", color: "#fff" },
      ghost: { backgroundColor: "transparent" },
    },
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
  compoundVariants: [
    { variants: { variant: "danger", size: "lg" }, value: { fontWeight: 700 } },
    {
      variants: { variant: ["ghost", "secondary"], disabled: true },
      value: { borderStyle: "dashed" },
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
    color: "#fff",
    height: 40,
    paddingInline: 16,
  },
  {
    ...base,
    backgroundColor: "#f3f4f6",
    color: "#111827",
    height: 40,
    paddingInline: 16,
  },
  {
    ...base,
    backgroundColor: "#dc2626",
    color: "#fff",
    fontSize: 18,
    height: 48,
    paddingInline: 24,
    fontWeight: 700,
  },
  {
    ...base,
    backgroundColor: "transparent",
    fontSize: 14,
    height: 32,
    paddingInline: 12,
    opacity: 0.5,
    pointerEvents: "none",
    borderStyle: "dashed",
  },
  {
    ...base,
    backgroundColor: "#dc2626",
    color: "#fff",
    fontSize: 14,
    height: 32,
    paddingInline: 12,
    opacity: 0.5,
    pointerEvents: "none",
  },
];

type Selector = (selection: (typeof selections)[number]) => Style;

const selectors: Readonly<Record<string, Selector>> = {
  cached: createRecipeKind(styles)(config),
  uncached: createRecipeKind({ ...styles, cache: false })(config),
};

describe("recipe kind", () => {
  it.for(Object.entries(selectors))(
    "%s returns the expected values",
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
