import { buildWithTheme, resolveTheme } from "./theme-reference.js";
import type { LooseSelection } from "./compile-style-recipe.js";

type LooseRecipe = (selection?: LooseSelection) => unknown;

type LooseThemedRecipe<Recipe extends LooseRecipe> = ((
  theme: object,
  selection?: LooseSelection,
) => unknown) & { readonly withTheme: (theme: object) => Recipe };

/**
 * Returns a themed recipe that builds the recipe of each theme with `build`
 * the first time it is called with that theme. The recipe of the last theme
 * is kept apart, so calling again with the same theme skips the lookup.
 */
function buildThemedRecipe<Recipe extends LooseRecipe>(
  build: (theme: object) => Recipe,
): LooseThemedRecipe<Recipe> {
  const recipes = new WeakMap<object, Recipe>();
  let lastTheme: object | undefined = undefined;
  let lastRecipe: Recipe | undefined = undefined;

  function recipeFor(theme: object): Recipe {
    if (theme === lastTheme && lastRecipe !== undefined) {
      return lastRecipe;
    }
    const recipe = recipes.get(theme);
    if (recipe === undefined) {
      return recipeOfNewTheme(resolveTheme(theme));
    }
    lastTheme = theme;
    lastRecipe = recipe;
    return recipe;
  }

  function recipeOfNewTheme(theme: object): Recipe {
    let recipe = recipes.get(theme);
    if (recipe === undefined) {
      recipe = buildWithTheme(theme, build);
      recipes.set(theme, recipe);
    }
    lastTheme = theme;
    lastRecipe = recipe;
    return recipe;
  }

  return Object.assign(
    (theme: object, selection?: LooseSelection): unknown =>
      recipeFor(theme)(selection),
    { withTheme: recipeFor },
  );
}

export { buildThemedRecipe };
export type { LooseThemedRecipe };
