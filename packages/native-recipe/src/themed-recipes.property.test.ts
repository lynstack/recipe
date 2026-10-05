import {
  array,
  assert,
  constantFrom,
  integer,
  option,
  property,
  record,
  tuple,
} from "fast-check";
import { describe, expect, it } from "vitest";

import { createThemedRecipes } from "./themed-recipes.js";

interface Theme {
  readonly primary: string;
  readonly radius: number;
}

const themes: readonly Theme[] = [
  { primary: "#2563eb", radius: 8 },
  { primary: "#60a5fa", radius: 8 },
  { primary: "#000000", radius: 0 },
];

interface Selection {
  readonly size: "sm" | "md";
  readonly disabled?: boolean | undefined;
}

const selection = record({
  disabled: option(constantFrom(true, false), { nil: undefined }),
  size: constantFrom("sm", "md"),
});

const call = tuple(integer({ max: themes.length - 1, min: 0 }), selection);

const themed = createThemedRecipes<Theme>();

const button = themed.createStyleRecipe((theme) => ({
  base: { borderRadius: theme.radius },
  compoundVariants: [
    {
      style: { borderColor: theme.primary },
      variants: { disabled: false, size: "md" },
    },
  ],
  variants: {
    disabled: { true: { opacity: 0.5 } },
    size: {
      md: { backgroundColor: theme.primary, height: 40 },
      sm: { height: 32 },
    },
  },
}));

const field = themed.createSlotStyleRecipe((theme) => ({
  base: { label: { color: theme.primary }, root: { borderRadius: 8 } },
  slots: ["root", "label"],
  variants: {
    disabled: { true: { label: { opacity: 0.5 } } },
    size: { md: { root: { height: 40 } }, sm: { root: { height: 32 } } },
  },
}));

function expectedButton(theme: Theme, { size, disabled }: Selection): object {
  return {
    borderRadius: theme.radius,
    ...(size === "md"
      ? { backgroundColor: theme.primary, height: 40 }
      : { height: 32 }),
    ...(disabled === true ? { opacity: 0.5 } : {}),
    ...(size === "md" && disabled !== true
      ? { borderColor: theme.primary }
      : {}),
  };
}

function expectedField(theme: Theme, { size, disabled }: Selection): object {
  return {
    label: {
      color: theme.primary,
      ...(disabled === true ? { opacity: 0.5 } : {}),
    },
    root: { borderRadius: 8, height: size === "md" ? 40 : 32 },
  };
}

function returnsTheStyleOfEachTheme(
  calls: readonly (readonly [number, Selection])[],
): void {
  const firstResults = new Map<string, readonly [object, object]>();
  for (const [index, selected] of calls) {
    const theme = themes[index] ?? { primary: "", radius: 0 };
    const results = [
      button(theme, selected),
      field.withTheme(theme)(selected),
    ] as const;
    expect(results).toStrictEqual([
      expectedButton(theme, selected),
      expectedField(theme, selected),
    ]);
    const key = JSON.stringify([index, selected]);
    const [firstButton, firstField] = firstResults.get(key) ?? results;
    expect(results[0]).toBe(firstButton);
    expect(results[1]).toBe(firstField);
    firstResults.set(key, results);
  }
}

describe(createThemedRecipes, () => {
  it("returns the same style for the same theme and variants", () => {
    assert(
      property(array(call, { maxLength: 20 }), returnsTheStyleOfEachTheme),
    );
  });
});
