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

const config = {
  slots: ["root", "icon", "label"],
  base: {
    root: { alignItems: "center", borderRadius: 6, display: "inline-flex" },
    icon: { flexShrink: 0 },
    label: { fontWeight: 500 },
  },
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
    size: {
      sm: { root: { height: 32, paddingInline: 12 }, icon: { width: 16 } },
      md: { root: { height: 40, paddingInline: 16 }, icon: { width: 20 } },
      lg: {
        root: { height: 48 },
        icon: { width: 24 },
        label: { fontSize: 18 },
      },
    },
    loading: {
      true: { root: { cursor: "wait" }, icon: { opacity: 0.5 } },
      false: {},
    },
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
  defaultVariants: { variant: "primary", size: "md", loading: false },
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "danger", size: "lg" },
  { variant: "ghost", size: "sm", loading: true },
  { variant: "danger", size: "sm", loading: true },
] as const;

const expected = [
  {
    root: {
      ...config.base.root,
      backgroundColor: "#2563eb",
      height: 40,
      paddingInline: 16,
    },
    icon: { flexShrink: 0, width: 20 },
    label: { fontWeight: 500, color: "#fff" },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "#f3f4f6",
      height: 40,
      paddingInline: 16,
    },
    icon: { flexShrink: 0, width: 20 },
    label: { fontWeight: 500, color: "#111827" },
  },
  {
    root: { ...config.base.root, backgroundColor: "#dc2626", height: 48 },
    icon: { flexShrink: 0, color: "#fff", width: 24 },
    label: { fontWeight: 700, fontSize: 18 },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "transparent",
      height: 32,
      paddingInline: 12,
      cursor: "wait",
      opacity: 0.75,
    },
    icon: { flexShrink: 0, color: "#6b7280", width: 16, opacity: 0.5 },
    label: { fontWeight: 500 },
  },
  {
    root: {
      ...config.base.root,
      backgroundColor: "#dc2626",
      height: 32,
      paddingInline: 12,
      cursor: "wait",
    },
    icon: { flexShrink: 0, color: "#fff", width: 16, opacity: 0.5 },
    label: { fontWeight: 500 },
  },
];

type Selector = (selection: (typeof selections)[number]) => Styles;

const selectors: Readonly<Record<string, Selector>> = {
  cached: createSlotRecipeKind(styles)(config),
  uncached: createSlotRecipeKind({ ...styles, cache: false })(config),
};

describe("slot recipe kind", () => {
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
