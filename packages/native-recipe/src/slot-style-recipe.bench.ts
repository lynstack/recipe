import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

import { createSlotRecipeKind } from "@lynstack/recipe";
import { createSlotStyleRecipe } from "@lynstack/native-recipe";

type Style = Readonly<Record<string, unknown>>;

type Styles = Readonly<Record<string, Style>>;

const slots = ["root", "icon", "label"] as const;

const config = {
  slots,
  base: {
    root: { alignItems: "center", borderRadius: 8, flexDirection: "row" },
    icon: { marginRight: 8 },
    label: { fontWeight: "600" },
  },
  variants: {
    variant: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        icon: { tintColor: "#ffffff" },
        label: { color: "#ffffff" },
      },
      secondary: {
        root: { backgroundColor: "#f3f4f6" },
        label: { color: "#111827" },
      },
      ghost: {
        root: { backgroundColor: "transparent" },
        label: { color: "#2563eb" },
      },
    },
    size: {
      sm: {
        root: { height: 32, paddingHorizontal: 12 },
        icon: { height: 16, width: 16 },
        label: { fontSize: 14 },
      },
      md: {
        root: { height: 40, paddingHorizontal: 16 },
        icon: { height: 20, width: 20 },
      },
    },
    disabled: {
      true: { root: { opacity: 0.5 } },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { variant: "ghost", disabled: true },
      styles: { root: { borderStyle: "dashed", borderWidth: 1 } },
    },
  ],
  defaultVariants: { variant: "primary", size: "md", disabled: false },
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "ghost", size: "sm" },
  { variant: "ghost", disabled: true },
  { variant: "secondary", size: "sm", disabled: true },
] as const;

const expected = [
  {
    root: {
      ...config.base.root,
      backgroundColor: "#2563eb",
      height: 40,
      paddingHorizontal: 16,
    },
    icon: { marginRight: 8, tintColor: "#ffffff", height: 20, width: 20 },
    label: { fontWeight: "600", color: "#ffffff" },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "#f3f4f6",
      height: 40,
      paddingHorizontal: 16,
    },
    icon: { marginRight: 8, height: 20, width: 20 },
    label: { fontWeight: "600", color: "#111827" },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "transparent",
      height: 32,
      paddingHorizontal: 12,
    },
    icon: { marginRight: 8, height: 16, width: 16 },
    label: { fontWeight: "600", color: "#2563eb", fontSize: 14 },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "transparent",
      height: 40,
      paddingHorizontal: 16,
      opacity: 0.5,
      borderStyle: "dashed",
      borderWidth: 1,
    },
    icon: { marginRight: 8, height: 20, width: 20 },
    label: { fontWeight: "600", color: "#2563eb" },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "#f3f4f6",
      height: 32,
      paddingHorizontal: 12,
      opacity: 0.5,
    },
    icon: { marginRight: 8, height: 16, width: 16 },
    label: { fontWeight: "600", color: "#111827", fontSize: 14 },
  },
];

type Selector = (selection: (typeof selections)[number]) => Styles;

/** The same slot recipe, built on every call. */
const uncached: Selector = createSlotRecipeKind({
  cache: false,
  finish: (style: Style): Style => Object.freeze(style),
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
})({
  ...config,
  compoundVariants: config.compoundVariants.map((compound) => ({
    value: compound.styles,
    variants: compound.variants,
  })),
});

const selectors: Readonly<Record<string, Selector>> = {
  cached: createSlotStyleRecipe(config),
  uncached,
};

describe("slot style recipe", () => {
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
    expect(result.get("cached")).toBeFasterThan(result.get("uncached"));
  });
});
