import { describe, expect, expectTypeOf, it } from "vitest";

import type { KindRecipeOf, KindSlotRecipeOf } from "./recipe-of.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};

const styleRecipe = createRecipeKind(styleKind);
const slotStyleRecipe = createSlotRecipeKind(styleKind);

const textConfig = {
  base: { color: "black" },
  variants: {
    size: { sm: { fontSize: 12 }, md: { fontSize: 16 } },
    muted: { true: { opacity: 0.6 } },
  },
  defaultVariants: { size: "md" },
} as const;

const headingConfig = {
  variants: {
    size: { xl: { fontSize: 32 } },
    tone: { loud: { color: "red" } },
  },
  defaultVariants: { tone: "loud" },
} as const;

const cardConfig = {
  slots: ["root", "title"],
  base: { root: { padding: 16 } },
  variants: { tone: { dark: { root: { backgroundColor: "black" } } } },
  defaultVariants: { tone: "dark" },
} as const;

const dialogConfig = {
  slots: ["footer"],
  variants: { size: { sm: { footer: { gap: 8 } } } },
} as const;

describe("the type of the recipe of a config", () => {
  it("is the type of the recipe that the kind returns for it", () => {
    const text: KindRecipeOf<Style, Style, typeof textConfig> =
      styleRecipe(textConfig);

    expect(text({})).toStrictEqual({ color: "black", fontSize: 16 });
    expectTypeOf<KindRecipeOf<Style, Style, typeof textConfig>>().toEqualTypeOf(
      styleRecipe(textConfig),
    );
  });

  it("composes the recipes that its last parameter lists", () => {
    const text: KindRecipeOf<Style, Style, typeof textConfig> =
      styleRecipe(textConfig);
    const heading: KindRecipeOf<
      Style,
      Style,
      typeof headingConfig,
      readonly [typeof text]
    > = styleRecipe({ ...headingConfig, composes: [text] });

    expect(heading({ size: "xl" })).toStrictEqual({
      color: "red",
      fontSize: 32,
    });
    expectTypeOf<
      KindRecipeOf<Style, Style, typeof headingConfig, readonly [typeof text]>
    >().toEqualTypeOf(styleRecipe({ ...headingConfig, composes: [text] }));
  });

  it("is the type of the slot recipe that the kind returns for it", () => {
    const card: KindSlotRecipeOf<Style, Style, typeof cardConfig> =
      slotStyleRecipe(cardConfig);

    expect(card({})).toStrictEqual({
      root: { padding: 16, backgroundColor: "black" },
      title: {},
    });
    expectTypeOf<
      KindSlotRecipeOf<Style, Style, typeof cardConfig>
    >().toEqualTypeOf(slotStyleRecipe(cardConfig));
  });

  it("composes the slot recipes that its last parameter lists", () => {
    const card: KindSlotRecipeOf<Style, Style, typeof cardConfig> =
      slotStyleRecipe(cardConfig);
    const dialog: KindSlotRecipeOf<
      Style,
      Style,
      typeof dialogConfig,
      readonly [typeof card]
    > = slotStyleRecipe({ ...dialogConfig, composes: [card] });

    expect(dialog({ size: "sm" })).toStrictEqual({
      root: { padding: 16, backgroundColor: "black" },
      title: {},
      footer: { gap: 8 },
    });
    expectTypeOf<
      KindSlotRecipeOf<
        Style,
        Style,
        typeof dialogConfig,
        readonly [typeof card]
      >
    >().toEqualTypeOf(slotStyleRecipe({ ...dialogConfig, composes: [card] }));
  });

  it("rejects a config that lists the recipes it composes", () => {
    const text = styleRecipe(textConfig);
    const composingConfig = { ...headingConfig, composes: [text] } as const;
    const heading = styleRecipe(composingConfig);

    expect(heading({ size: "xl" })).toStrictEqual({
      color: "red",
      fontSize: 32,
    });
    expectTypeOf<
      // @ts-expect-error: the recipes it composes are its last parameter.
      KindRecipeOf<Style, Style, typeof composingConfig>
    >().toBeFunction();
  });
});
