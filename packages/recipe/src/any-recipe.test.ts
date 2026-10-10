import { describe, expect, it } from "vitest";

import type { KindRecipe } from "./types.js";
import type { KindSelection } from "./kind-selection.js";
import type { KindSlotVariants } from "./slot-recipe-kind.js";
import type { KindVariants } from "./recipe-kind.js";
import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

/** Any recipe, as the docs type it for a function that reads it. */
type AnyStyleRecipe = ((props: never) => Style) &
  Pick<
    KindRecipe<KindSelection<KindVariants<Style>, never>, Style>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** Any slot recipe, as the docs type it for a function that reads it. */
type AnySlotStyleRecipe = ((props: never) => Readonly<Record<string, Style>>) &
  Pick<
    KindRecipe<
      KindSelection<KindSlotVariants<Style>, never>,
      Readonly<Record<string, Style>>
    >,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** Lists the options of each variant of any recipe. */
function listOptions(
  recipe: AnyStyleRecipe | AnySlotStyleRecipe,
): readonly string[] {
  return recipe.variantKeys.flatMap((key) => recipe.variantOptions[key] ?? []);
}

const kind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};
const styleRecipe = createRecipeKind(kind);
const slotStyleRecipe = createSlotRecipeKind(kind);

const box = styleRecipe({
  variants: { size: { sm: { padding: 4 }, md: { padding: 8 } } },
});
const card = slotStyleRecipe({
  slots: ["root", "title"],
  variants: { tone: { dark: { root: { color: "white" } } } },
});

describe("a function that takes any recipe", () => {
  it("takes a recipe with required variants as a function of never", () => {
    expect(box({ size: "sm" })).toStrictEqual({ padding: 4 });
    expect(listOptions(box)).toStrictEqual(["sm", "md"]);
  });

  it("takes a slot recipe with required variants", () => {
    expect(card({ tone: "dark" })).toStrictEqual({
      root: { color: "white" },
      title: {},
    });
    expect(listOptions(card)).toStrictEqual(["dark"]);
  });
});
