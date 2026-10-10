import type {
  ComposedVariants,
  InheritedDefaultedName,
  RecipeComposition,
} from "@lynstack/recipe";

import type {
  BaseOf,
  CompoundsOf,
  SlotStyleRecipeConfigParts,
  StyleRecipeConfigParts,
} from "./recipe-of.js";
import type {
  DefaultedNameOf,
  NativeStyle,
  RecipeSlotStyles,
  VariantSelection,
} from "./types.js";
import type { RecipeStyle } from "./style-recipe.js";
import type { ThemedRecipe } from "./themed-recipes.js";

/**
 * The themed recipe of a config whose variants, with those of the recipes
 * it composes, are `Variants`, whose variants with a default are
 * `DefaultedName`, and which returns `Result`. `Slots` lists the slots of a
 * slot recipe, or is `undefined` for a recipe without slots.
 */
type ComposedThemedRecipe<
  Theme,
  Variants,
  DefaultedName extends keyof Variants,
  Result,
  Slots,
> = ThemedRecipe<
  Theme,
  VariantSelection<Variants, DefaultedName>,
  Result,
  RecipeComposition<Variants, DefaultedName, NativeStyle, Slots>
>;

/**
 * The slots of each slot recipe of the union `Recipe`. A conditional type,
 * which declarations print as the names of the slots.
 */
type SlotOfEach<Recipe> = Recipe extends {
  readonly "~composition"?: infer Composition;
}
  ? Exclude<Composition, undefined> extends {
      readonly slots: readonly (infer Slot extends string)[];
    }
    ? Slot
    : never
  : never;

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
 * It needs a config whose type is known. In a function generic over the
 * whole config, `createStyleRecipe` cannot infer the variants, so make such
 * a function generic over the variants instead.
 *
 * @typeParam Config - The type of the function that returns the config for
 *   a theme, without `composes`: return the config `as const`, and give
 *   each value read from the theme its type, such as
 *   `theme.gap as Theme["gap"]`. The function takes the theme as a typed
 *   parameter, as in `(theme: Theme) =>`, and the type reads the theme
 *   type from it, so it does not apply to a function that reads
 *   `themeToken`.
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
 * It needs a config whose type is known. In a function generic over the
 * whole config, `createSlotStyleRecipe` cannot infer the variants, so make
 * such a function generic over the variants instead.
 *
 * @typeParam Config - The type of the function that returns the config for
 *   a theme, without `composes`: return the config `as const`, and give
 *   each value read from the theme its type, such as
 *   `theme.gap as Theme["gap"]`. The function takes the theme as a typed
 *   parameter, as in `(theme: Theme) =>`, and the type reads the theme
 *   type from it, so it does not apply to a function that reads
 *   `themeToken`.
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
  // SlotOfEach, not ComposedSlot, which prints each composed type.
  RecipeSlotStyles<
    | ReturnType<Config>["slots"][number]
    | SlotOfEach<RecipesOfTheme<Composed>[number]>,
    ReturnType<Config>["variants"],
    BaseOf<ReturnType<Config>>,
    CompoundsOf<ReturnType<Config>>,
    RecipesOfTheme<Composed>
  >,
  readonly (
    | ReturnType<Config>["slots"][number]
    | SlotOfEach<RecipesOfTheme<Composed>[number]>
  )[]
>;

export type { ThemedSlotStyleRecipeOf, ThemedStyleRecipeOf };
