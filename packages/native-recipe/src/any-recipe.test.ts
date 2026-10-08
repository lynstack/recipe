import { describe, expect, expectTypeOf, it } from "vitest";

import type { NativeStyle, SlotStyles, VariantSelection } from "./types.js";
import type {
  SlotStyleRecipe,
  SlotStyleRecipeVariants,
} from "./slot-style-recipe.js";
import type { StyleRecipe, StyleRecipeVariants } from "./style-recipe.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";
import { createStyleRecipe } from "./style-recipe.js";

/** Any recipe, as the docs type it for a function that reads it. */
type AnyRecipe = ((props: never) => NativeStyle) &
  Pick<
    StyleRecipe<VariantSelection<StyleRecipeVariants, never>, NativeStyle>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** Any slot recipe, as the docs type it for a function that reads it. */
type AnySlotRecipe = ((props: never) => Readonly<Record<string, NativeStyle>>) &
  Pick<
    SlotStyleRecipe<
      VariantSelection<SlotStyleRecipeVariants, never>,
      SlotStyles<string>
    >,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** Lists the options of each variant of any recipe. */
function optionsOf(recipe: AnyRecipe | AnySlotRecipe): readonly string[] {
  return recipe.variantKeys.flatMap((key) => recipe.variantOptions[key] ?? []);
}

const tone = createStyleRecipe({
  variants: { tone: { neutral: {}, danger: { color: "red" } } },
});
const button = createStyleRecipe({
  composes: [tone],
  variants: { size: { sm: { height: 32 } } },
});
const card = createSlotStyleRecipe({
  slots: ["root"],
  variants: { tone: { dark: { root: { backgroundColor: "black" } } } },
});

describe("a function that takes any recipe", () => {
  it("takes a recipe with required variants as a function of never", () => {
    expect(optionsOf(button)).toStrictEqual(["neutral", "danger", "sm"]);
    expect(optionsOf(card)).toStrictEqual(["dark"]);
  });
});

describe("a slot recipe whose slots are declared without as const", () => {
  it("takes any string as a slot name", () => {
    const slots = ["root", "title"];
    const wide = createSlotStyleRecipe({
      slots,
      base: { body: { padding: 16 } },
      variants: { size: { sm: { root: { padding: 8 }, titel: {} } } },
    });
    const styles = wide({ size: "sm" });

    expectTypeOf(slots).toEqualTypeOf<string[]>();
    expect(styles).toStrictEqual({ root: { padding: 8 }, title: {} });
  });
});
