import type { LooseSelection } from "./compile-style-recipe.js";

type LooseRecipe = (selection?: LooseSelection) => unknown;

type LooseThemedRecipe<Theme extends object, Recipe extends LooseRecipe> = ((
  theme: Theme,
  selection?: LooseSelection,
) => unknown) & { readonly withTheme: (theme: Theme) => Recipe };

/**
 * Returns a themed recipe that builds the recipe of each theme with `build`
 * the first time it is called with that theme. The recipe of the last theme
 * is kept apart, so calling again with the same theme skips the lookup.
 */
function buildThemedRecipe<Theme extends object, Recipe extends LooseRecipe>(
  build: (theme: Theme) => Recipe,
): LooseThemedRecipe<Theme, Recipe> {
  const recipes = new WeakMap<Theme, Recipe>();
  let lastTheme: Theme | undefined = undefined;
  let lastRecipe: Recipe | undefined = undefined;

  function recipeFor(theme: Theme): Recipe {
    if (theme === lastTheme && lastRecipe !== undefined) {
      return lastRecipe;
    }
    let recipe = recipes.get(theme);
    if (recipe === undefined) {
      recipe = build(theme);
      recipes.set(theme, recipe);
    }
    lastTheme = theme;
    lastRecipe = recipe;
    return recipe;
  }

  return Object.assign(
    (theme: Theme, selection?: LooseSelection): unknown =>
      recipeFor(theme)(selection),
    { withTheme: recipeFor },
  );
}

export { buildThemedRecipe };
export type { LooseThemedRecipe };
