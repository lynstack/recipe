import type { ComposedSlot, ComposedVariants } from "@lynstack/recipe";

import type {
  BaseOf,
  CompoundsOf,
  SlotStyleRecipeConfigParts,
  StyleRecipeConfigParts,
} from "./recipe-of.js";
import type {
  DefaultedNameOf,
  InheritedDefaultedName,
  RecipeSlotStyles,
} from "./types.js";
import type { ComposedThemedRecipe } from "./themed-recipes.js";
import type { RecipeStyle } from "./style-recipe.js";

/**
 * The recipe that a themed config composes for each of `Composed`: the
 * recipe of a theme, which `withTheme` returns, for a themed recipe, and
 * any other recipe as it is.
 */
type RecipesOfTheme<Composed extends readonly unknown[]> = {
  readonly [Index in keyof Composed]: Composed[Index] extends {
    readonly withTheme: (theme: never) => infer Recipe;
  }
    ? Recipe
    : Composed[Index];
};

/**
 * The type of the themed recipe that the `createStyleRecipe` of
 * `createThemedRecipes` returns for a config function of type `Config`
 * that composes the recipes of `Composed`. Annotate an exported themed
 * recipe with it where each file's declarations are emitted on its own, as
 * with `isolatedDeclarations`, which cannot infer the type of a call. A
 * config that lists `composes` is rejected, so that the type cannot leave
 * out the recipes it composes.
 *
 * @typeParam Config - The type of the function that returns the config for
 *   a theme, without `composes`: return the config `as const`, and give
 *   each value read from the theme its type, such as
 *   `theme.gap as Theme["gap"]`.
 * @typeParam Composed - The types of the recipes it composes, in the order
 *   of `composes`: a themed recipe, whose `withTheme` the config calls, or
 *   a recipe. Defaults to none.
 *
 * @example
 * ```ts
 * const { createStyleRecipe } = createThemedRecipes<Theme>();
 *
 * const chipConfig = (theme: Theme) =>
 *   ({
 *     base: { padding: theme.gap as Theme["gap"] },
 *     variants: { tone: { primary: { opacity: 1 }, muted: { opacity: 0.6 } } },
 *   }) as const;
 *
 * export const chip: ThemedStyleRecipeOf<typeof chipConfig> =
 *   createStyleRecipe(chipConfig);
 * ```
 */
type ThemedStyleRecipeOf<
  Config extends (theme: never) => StyleRecipeConfigParts,
  Composed extends readonly unknown[] = readonly [],
> = ComposedThemedRecipe<
  Parameters<Config>[0],
  ComposedVariants<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>,
  | Extract<
      DefaultedNameOf<ReturnType<Config>>,
      keyof ComposedVariants<
        RecipesOfTheme<Composed>,
        ReturnType<Config>["variants"]
      >
    >
  | InheritedDefaultedName<
      RecipesOfTheme<Composed>,
      ReturnType<Config>["variants"]
    >,
  RecipeStyle<
    ReturnType<Config>["variants"],
    BaseOf<ReturnType<Config>>,
    CompoundsOf<ReturnType<Config>>,
    RecipesOfTheme<Composed>
  >,
  undefined
>;

/**
 * The type of the themed slot recipe that the `createSlotStyleRecipe` of
 * `createThemedRecipes` returns for a config function of type `Config`
 * that composes the slot recipes of `Composed`. Annotate an exported themed
 * slot recipe with it where each file's declarations are emitted on its
 * own, as with `isolatedDeclarations`, which cannot infer the type of a
 * call. A config that lists `composes` is rejected, so that the type cannot
 * leave out the slot recipes it composes.
 *
 * @typeParam Config - The type of the function that returns the config for
 *   a theme, without `composes`: return the config `as const`, and give
 *   each value read from the theme its type, such as
 *   `theme.gap as Theme["gap"]`.
 * @typeParam Composed - The types of the slot recipes it composes, in the
 *   order of `composes`: a themed slot recipe, whose `withTheme` the config
 *   calls, or a slot recipe. Defaults to none.
 *
 * @example
 * ```ts
 * const { createSlotStyleRecipe } = createThemedRecipes<Theme>();
 *
 * const tagConfig = (theme: Theme) =>
 *   ({
 *     slots: ["root", "label"],
 *     base: { root: { gap: theme.gap as Theme["gap"] } },
 *     variants: { size: { sm: { label: { fontSize: 12 } } } },
 *   }) as const;
 *
 * export const tag: ThemedSlotStyleRecipeOf<typeof tagConfig> =
 *   createSlotStyleRecipe(tagConfig);
 * ```
 */
type ThemedSlotStyleRecipeOf<
  Config extends (theme: never) => SlotStyleRecipeConfigParts,
  Composed extends readonly unknown[] = readonly [],
> = ComposedThemedRecipe<
  Parameters<Config>[0],
  ComposedVariants<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>,
  | Extract<
      DefaultedNameOf<ReturnType<Config>>,
      keyof ComposedVariants<
        RecipesOfTheme<Composed>,
        ReturnType<Config>["variants"]
      >
    >
  | InheritedDefaultedName<
      RecipesOfTheme<Composed>,
      ReturnType<Config>["variants"]
    >,
  RecipeSlotStyles<
    ComposedSlot<RecipesOfTheme<Composed>, ReturnType<Config>["slots"][number]>,
    ReturnType<Config>["variants"],
    BaseOf<ReturnType<Config>>,
    CompoundsOf<ReturnType<Config>>,
    RecipesOfTheme<Composed>
  >,
  readonly ComposedSlot<
    RecipesOfTheme<Composed>,
    ReturnType<Config>["slots"][number]
  >[]
>;

export type { ThemedSlotStyleRecipeOf, ThemedStyleRecipeOf };
