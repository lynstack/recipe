import { describe, expect, expectTypeOf, it } from "vitest";

import type { SlotStyleRecipeOf, StyleRecipeOf } from "./recipe-of.js";
import type {
  ThemedSlotStyleRecipeOf,
  ThemedStyleRecipeOf,
} from "./themed-recipe-of.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";
import { createThemedRecipes } from "./themed-recipes.js";

const boxConfig = {
  base: { borderRadius: 8 },
  variants: {
    size: { sm: { padding: 4 }, md: { padding: 8 } },
    tone: { neutral: { opacity: 0.8 }, danger: { opacity: 1 } },
  },
  compoundVariants: [
    { variants: { size: "sm", tone: "danger" }, style: { borderWidth: 1 } },
  ],
  defaultVariants: { size: "md" },
} as const;

const cardConfig = {
  variants: { raised: { true: { elevation: 2 } } },
} as const;

const fieldConfig = {
  slots: ["root", "label"],
  base: { root: { gap: 4 } },
  variants: { size: { sm: { label: { fontSize: 12 } }, md: {} } },
  compoundVariants: [
    { variants: { size: "sm" }, styles: { root: { padding: 2 } } },
  ],
  defaultVariants: { size: "md" },
} as const;

const searchConfig = {
  slots: ["icon"],
  variants: { open: { true: { root: { gap: 8 }, icon: { width: 12 } } } },
} as const;

describe("the type of the recipe of a config", () => {
  it("is the type of the recipe that createStyleRecipe returns for it", () => {
    const box: StyleRecipeOf<typeof boxConfig> = createStyleRecipe(boxConfig);

    expect(box({ size: "sm", tone: "danger" })).toStrictEqual({
      borderRadius: 8,
      padding: 4,
      opacity: 1,
      borderWidth: 1,
    });
    expectTypeOf<StyleRecipeOf<typeof boxConfig>>().toEqualTypeOf(
      createStyleRecipe(boxConfig),
    );
  });

  it("composes the recipes that its second parameter lists", () => {
    const box: StyleRecipeOf<typeof boxConfig> = createStyleRecipe(boxConfig);
    const card: StyleRecipeOf<typeof cardConfig, readonly [typeof box]> =
      createStyleRecipe({ ...cardConfig, composes: [box] });

    expect(card({ tone: "neutral", raised: true })).toStrictEqual({
      borderRadius: 8,
      padding: 8,
      opacity: 0.8,
      elevation: 2,
    });
    expectTypeOf<
      StyleRecipeOf<typeof cardConfig, readonly [typeof box]>
    >().toEqualTypeOf(createStyleRecipe({ ...cardConfig, composes: [box] }));
  });

  it("is the type of the slot recipe that createSlotStyleRecipe returns for it", () => {
    const field: SlotStyleRecipeOf<typeof fieldConfig> =
      createSlotStyleRecipe(fieldConfig);

    expect(field({ size: "sm" })).toStrictEqual({
      root: { gap: 4, padding: 2 },
      label: { fontSize: 12 },
    });
    expectTypeOf<SlotStyleRecipeOf<typeof fieldConfig>>().toEqualTypeOf(
      createSlotStyleRecipe(fieldConfig),
    );
  });

  it("composes the slot recipes that its second parameter lists", () => {
    const field: SlotStyleRecipeOf<typeof fieldConfig> =
      createSlotStyleRecipe(fieldConfig);
    const search: SlotStyleRecipeOf<
      typeof searchConfig,
      readonly [typeof field]
    > = createSlotStyleRecipe({ ...searchConfig, composes: [field] });

    expect(search({ open: true })).toStrictEqual({
      root: { gap: 8 },
      label: {},
      icon: { width: 12 },
    });
    expectTypeOf<
      SlotStyleRecipeOf<typeof searchConfig, readonly [typeof field]>
    >().toEqualTypeOf(
      createSlotStyleRecipe({ ...searchConfig, composes: [field] }),
    );
  });

  it("rejects a config that lists the recipes it composes", () => {
    const box = createStyleRecipe(boxConfig);
    const composingConfig = { ...cardConfig, composes: [box] } as const;
    const card = createStyleRecipe(composingConfig);

    expect(card({ tone: "danger" })).toStrictEqual({
      borderRadius: 8,
      padding: 8,
      opacity: 1,
    });
    // @ts-expect-error: the recipes it composes are its second parameter.
    expectTypeOf<StyleRecipeOf<typeof composingConfig>>().toBeFunction();
  });
});

interface Theme {
  readonly gap: number;
  readonly radius: number;
}

const light: Theme = { gap: 4, radius: 8 };

const themed = createThemedRecipes<Theme>();

const chipConfig = (theme: Theme) =>
  ({
    base: { borderRadius: theme.radius },
    variants: {
      tone: { primary: { opacity: 1 }, muted: { opacity: 0.6 } },
    },
    defaultVariants: { tone: "primary" },
  }) as const;

const badgeConfig = (theme: Theme) =>
  ({
    variants: { size: { sm: { padding: theme.gap } } },
  }) as const;

const tagConfig = (theme: Theme) =>
  ({
    slots: ["root", "label"],
    base: { root: { gap: theme.gap } },
    variants: { size: { sm: { label: { fontSize: 12 } } } },
  }) as const;

const pillConfig = (theme: Theme) =>
  ({
    slots: ["icon"],
    variants: {
      closable: { true: { icon: { width: theme.gap } } },
    },
  }) as const;

describe("the type of the themed recipe of a config", () => {
  it("is the type of the themed recipe that createStyleRecipe returns for it", () => {
    const chip: ThemedStyleRecipeOf<typeof chipConfig> =
      themed.createStyleRecipe(chipConfig);

    expect(chip(light, { tone: "muted" })).toStrictEqual({
      borderRadius: 8,
      opacity: 0.6,
    });
    expectTypeOf<ThemedStyleRecipeOf<typeof chipConfig>>().toEqualTypeOf(
      themed.createStyleRecipe(chipConfig),
    );
  });

  it("composes the themed recipes that its second parameter lists", () => {
    const chip: ThemedStyleRecipeOf<typeof chipConfig> =
      themed.createStyleRecipe(chipConfig);
    const badge: ThemedStyleRecipeOf<
      typeof badgeConfig,
      readonly [typeof chip]
    > = themed.createStyleRecipe((theme: Theme) => ({
      ...badgeConfig(theme),
      composes: [chip.withTheme(theme)],
    }));

    expect(badge(light, { size: "sm" })).toStrictEqual({
      borderRadius: 8,
      opacity: 1,
      padding: 4,
    });
    expectTypeOf<
      ThemedStyleRecipeOf<typeof badgeConfig, readonly [typeof chip]>
    >().toEqualTypeOf(
      themed.createStyleRecipe((theme: Theme) => ({
        ...badgeConfig(theme),
        composes: [chip.withTheme(theme)],
      })),
    );
  });

  it("is the type of the themed slot recipe that createSlotStyleRecipe returns for it", () => {
    const tag: ThemedSlotStyleRecipeOf<typeof tagConfig> =
      themed.createSlotStyleRecipe(tagConfig);

    expect(tag(light, { size: "sm" })).toStrictEqual({
      root: { gap: 4 },
      label: { fontSize: 12 },
    });
    expectTypeOf<ThemedSlotStyleRecipeOf<typeof tagConfig>>().toEqualTypeOf(
      themed.createSlotStyleRecipe(tagConfig),
    );
  });

  it("composes the themed slot recipes that its second parameter lists", () => {
    const tag: ThemedSlotStyleRecipeOf<typeof tagConfig> =
      themed.createSlotStyleRecipe(tagConfig);
    const pill: ThemedSlotStyleRecipeOf<
      typeof pillConfig,
      readonly [typeof tag]
    > = themed.createSlotStyleRecipe((theme: Theme) => ({
      ...pillConfig(theme),
      composes: [tag.withTheme(theme)],
    }));

    expect(pill(light, { closable: true, size: "sm" })).toStrictEqual({
      root: { gap: 4 },
      label: { fontSize: 12 },
      icon: { width: 4 },
    });
    expectTypeOf<
      ThemedSlotStyleRecipeOf<typeof pillConfig, readonly [typeof tag]>
    >().toEqualTypeOf(
      themed.createSlotStyleRecipe((theme: Theme) => ({
        ...pillConfig(theme),
        composes: [tag.withTheme(theme)],
      })),
    );
  });
});
