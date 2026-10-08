import { describe, expect, it } from "vitest";

import type { Recipe, RecipeProps, RecipeVariants } from "./recipe.js";
import type { SlotRecipe, SlotRecipeVariants } from "./slot-recipe.js";
import type { SlotRecipeProps } from "./types.js";
import { cva } from "./recipe.js";
import { sva } from "./slot-recipe.js";

/** Any recipe, as the docs type it for a function that reads it. */
type AnyRecipe = ((props: never) => string) &
  Pick<
    Recipe<RecipeProps<RecipeVariants, never>>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** Any slot recipe, as the docs type it for a function that reads it. */
type AnySlotRecipe = ((props: never) => Readonly<Record<string, string>>) &
  Pick<
    SlotRecipe<string, SlotRecipeProps<string, SlotRecipeVariants, never>>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** Lists the options of each variant of any recipe. */
function optionsOf(recipe: AnyRecipe | AnySlotRecipe): readonly string[] {
  return recipe.variantKeys.flatMap((key) => recipe.variantOptions[key] ?? []);
}

/** Lists the options of a recipe of any selection, which it may call. */
function optionsOfCallable(
  recipe: Recipe<RecipeProps<RecipeVariants, never>>,
): readonly string[] {
  return recipe.variantKeys;
}

const tone = cva({ variants: { tone: { neutral: "", danger: "" } } });
const button = cva({ composes: [tone], variants: { size: { sm: "" } } });
const card = sva({ slots: ["root"], variants: { tone: { dark: {} } } });

describe("a function that takes any recipe", () => {
  it("takes a recipe with required variants as a function of never", () => {
    expect(optionsOf(button)).toStrictEqual(["neutral", "danger", "sm"]);
    expect(optionsOf(card)).toStrictEqual(["dark"]);
  });

  it("rejects such a recipe as a recipe of any selection", () => {
    // @ts-expect-error: the function may call tone without its variant.
    expect(optionsOfCallable(tone)).toStrictEqual(["tone"]);
  });
});
