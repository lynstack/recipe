import { describe, expect, it } from "vitest";

import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";
import { createThemedRecipes } from "./themed-recipes.js";

describe("a style recipe's config from untyped code", () => {
  it("needs variants", () => {
    expect(() =>
      // @ts-expect-error: variants is required.
      createStyleRecipe({ base: { padding: 8 } }),
    ).toThrow(
      new TypeError(
        "A recipe's config needs `variants`, an object of the options of each variant. Use `variants: {}` for a recipe without variants.",
      ),
    );
  });

  it("needs style objects", () => {
    expect(() =>
      // @ts-expect-error: base is a style object.
      createStyleRecipe({ base: [{ padding: 8 }], variants: {} }),
    ).toThrow(new TypeError("`base` needs a style object."));
    const styles = [{ padding: 8 }];
    expect(() =>
      // @ts-expect-error: base is a style object.
      createStyleRecipe({ base: styles, variants: {} }),
    ).toThrow(new TypeError("`base` needs a style object."));
    expect(() =>
      // @ts-expect-error: an option's style is an object.
      createStyleRecipe({ variants: { size: { sm: 32 } } }),
    ).toThrow(
      new TypeError(
        'The option "sm" of the variant "size" needs a style object.',
      ),
    );
    expect(() =>
      // @ts-expect-error: an option's style is an object.
      createStyleRecipe({ variants: { size: { sm: [{ padding: 8 }] } } }),
    ).toThrow(
      new TypeError(
        'The option "sm" of the variant "size" needs a style object.',
      ),
    );
  });

  it("names the style of a compound variant style", () => {
    expect(() =>
      createStyleRecipe({
        variants: { size: { sm: { height: 32 } } },
        compoundVariants: [
          // @ts-expect-error: the style of a compound variant is style.
          { variants: { size: "sm" }, styles: { padding: 4 } },
        ],
      }),
    ).toThrow(
      new TypeError(
        "Compound variant 0 needs `style`, the style it adds. Rename `styles` to `style`.",
      ),
    );
  });

  it("checks the config of each theme", () => {
    const { createStyleRecipe: createThemedStyleRecipe } = createThemedRecipes<{
      readonly gap: number;
    }>();
    const stack = createThemedStyleRecipe((theme) => ({
      base: { gap: theme.gap },
      // @ts-expect-error: an option's style is an object.
      variants: { wrap: { true: "wrap" } },
    }));

    expect(() => stack({ gap: 8 })).toThrow(
      new TypeError(
        'The option "true" of the variant "wrap" needs a style object.',
      ),
    );
  });

  it("accepts an empty style", () => {
    const box = createStyleRecipe({
      base: {},
      variants: { size: { sm: {}, md: { height: 40 } } },
      compoundVariants: [{ variants: { size: "md" }, style: {} }],
    });

    expect(box({ size: "md" })).toStrictEqual({ height: 40 });
  });
});

describe("a slot style recipe's config from untyped code", () => {
  it("needs the style of each slot", () => {
    expect(() =>
      // @ts-expect-error: base has the style of each slot.
      createSlotStyleRecipe({ slots: ["root"], base: 8, variants: {} }),
    ).toThrow(
      new TypeError(
        "`base` needs the style of each slot, such as `{ root: { padding: 16 } }`.",
      ),
    );
    expect(() =>
      createSlotStyleRecipe({
        slots: ["root"],
        // @ts-expect-error: an option has the style of each slot.
        variants: { size: { sm: { root: 8 } } },
      }),
    ).toThrow(
      new TypeError(
        'The option "sm" of the variant "size" needs the style of each slot, such as `{ root: { padding: 16 } }`.',
      ),
    );
  });

  it("names the styles of a compound variant styles", () => {
    expect(() =>
      createSlotStyleRecipe({
        slots: ["root"],
        variants: { size: { sm: { root: { padding: 8 } } } },
        compoundVariants: [
          // @ts-expect-error: the styles of a compound variant are styles.
          { variants: { size: "sm" }, style: { root: { padding: 4 } } },
        ],
      }),
    ).toThrow(
      new TypeError(
        "Compound variant 0 needs `styles`, the style it adds. Rename `style` to `styles`.",
      ),
    );
  });

  it("accepts a slot without a style", () => {
    const card = createSlotStyleRecipe({
      slots: ["root", "title"],
      base: { root: { padding: 16 } },
      variants: { size: { sm: { title: { fontSize: 12 } }, md: {} } },
    });

    expect(card({ size: "md" })).toStrictEqual({
      root: { padding: 16 },
      title: {},
    });
  });
});
