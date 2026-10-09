import { describe, expect, it } from "vitest";
import type { TestContext } from "vitest";

import {
  createStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";
import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, unknown>>;

interface Theme {
  readonly colors: {
    readonly primary: string;
    readonly surface: string;
    readonly border: string;
  };
  readonly radius: number;
}

const light: Theme = {
  colors: { border: "#e5e7eb", primary: "#2563eb", surface: "#f3f4f6" },
  radius: 8,
};

const dark: Theme = {
  colors: { border: "#374151", primary: "#60a5fa", surface: "#1f2937" },
  radius: 8,
};

const configFor = (theme: Theme) =>
  ({
    base: {
      alignItems: "center",
      borderRadius: theme.radius,
      flexDirection: "row",
      justifyContent: "center",
    },
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
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
      {
        variants: { variant: "ghost", disabled: true },
        style: { borderStyle: "dashed" },
      },
    ],
    defaultVariants: { variant: "primary", size: "md", disabled: false },
  }) as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "primary", size: "lg" },
  { variant: "ghost", size: "sm", disabled: true },
  { variant: "secondary", size: "sm", disabled: true },
] as const;

type Selection = (typeof selections)[number];

const expectedFor = (theme: Theme): readonly Style[] => {
  const { base } = configFor(theme);
  return [
    {
      ...base,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      height: 40,
      paddingHorizontal: 16,
    },
    {
      ...base,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      height: 40,
      paddingHorizontal: 16,
    },
    {
      ...base,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      height: 48,
      paddingHorizontal: 24,
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
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      height: 32,
      paddingHorizontal: 12,
      opacity: 0.5,
    },
  ];
};

/** The style recipe of `theme`, built on every call. */
const uncachedFor = (theme: Theme): ((selection: Selection) => Style) => {
  const config = configFor(theme);
  return createRecipeKind({
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
};

type Selector = (theme: Theme, selection: Selection) => Style;

const plain = createStyleRecipe(configFor(light));
const themed = createThemedRecipes<Theme>().createStyleRecipe(configFor);
const uncachedLight = uncachedFor(light);
const uncachedDark = uncachedFor(dark);

/**
 * Each selector, with the themes it is called with in turn, two for each,
 * so that every selector makes as many calls.
 */
const selectors: Readonly<
  Record<string, readonly [Selector, readonly Theme[]]>
> = {
  plain: [(_theme, selection) => plain(selection), [light, light]],
  "themed, one theme": [themed, [light, light]],
  "themed, two themes": [themed, [light, dark]],
  uncached: [
    (theme, selection) =>
      theme === light ? uncachedLight(selection) : uncachedDark(selection),
    [light, dark],
  ],
};

describe("themed style recipe", () => {
  it.for(Object.entries(selectors))(
    "%s returns the expected styles",
    ([, [selector, themes]]: readonly [
      string,
      readonly [Selector, readonly Theme[]],
    ]) => {
      for (const theme of themes) {
        expect(
          selections.map((selection) => selector(theme, selection)),
        ).toStrictEqual(expectedFor(theme));
      }
    },
  );

  it("is faster with the cache", async ({ bench }: TestContext) => {
    expect.hasAssertions();

    let last: Style = {};
    const result = await bench.compare(
      ...Object.entries(selectors).map(
        ([name, [selector, themes]]: readonly [
          string,
          readonly [Selector, readonly Theme[]],
        ]) =>
          bench(name, () => {
            for (const theme of themes) {
              for (const selection of selections) {
                last = selector(theme, selection);
              }
            }
          }),
      ),
    );

    expect(last).toStrictEqual(expectedFor(dark).at(-1));
    expect(result.get("themed, one theme")).toBeFasterThan(
      result.get("uncached"),
    );
    expect(result.get("themed, two themes")).toBeFasterThan(
      result.get("uncached"),
    );
  });
});
