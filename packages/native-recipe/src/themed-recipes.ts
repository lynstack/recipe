import type { KindRecipe } from "@lynstack/recipe";

import type {
  LooseSlotStyleRecipe,
  LooseSlotStyleRecipeConfig,
} from "./compile-slot-style-recipe.js";
import type {
  LooseStyleRecipe,
  LooseStyleRecipeConfig,
} from "./compile-style-recipe.js";
import type {
  RecipeSlotStyles,
  SlotStyleRecipeConfig,
} from "./slot-style-recipe.js";
import type { RecipeStyle, StyleRecipeConfig } from "./style-recipe.js";
import type { LooseThemedRecipe } from "./compile-themed-recipe.js";
import type { VariantSelection } from "./types.js";
import { buildSlotStyleRecipe } from "./compile-slot-style-recipe.js";
import { buildStyleRecipe } from "./compile-style-recipe.js";
import { buildThemedRecipe } from "./compile-themed-recipe.js";

/**
 * A recipe whose styles are built from a theme: a function that returns
 * the styles of a selection of variants in a theme, with `withTheme`, which
 * returns the recipe of one theme.
 *
 * @typeParam Theme - The theme the styles are built from.
 * @typeParam Props - The variants the recipe accepts.
 * @typeParam Result - What the recipe returns.
 */
type ThemedRecipe<Theme, Props, Result> = (Partial<Props> extends Props
  ? (theme: Theme, props?: Props) => Result
  : (theme: Theme, props: Props) => Result) & {
  /**
   * Returns the recipe of `theme`, the same recipe for the same theme
   * object, with the names of its variants in `variantKeys`.
   */
  readonly withTheme: (theme: Theme) => KindRecipe<Props, Result>;
};

/**
 * The functions that {@link createThemedRecipes} returns, which create
 * recipes whose styles are built from a theme of type `Theme`.
 *
 * @typeParam Theme - The theme the styles are built from.
 */
interface ThemedRecipeCreators<Theme extends object> {
  /**
   * Creates a themed style recipe: `createStyleRecipe` with a config built
   * from a theme.
   *
   * @typeParam Variants - The variant definitions, inferred from
   *   `config.variants`.
   * @typeParam Base - The base style, inferred from `config.base`.
   * @typeParam Compounds - The compound variants, inferred from
   *   `config.compoundVariants`.
   * @typeParam DefaultedName - The names of the variants that have a
   *   default, inferred from `config.defaultVariants`.
   * @param config - Returns the config of the recipe for a theme.
   * @returns The themed recipe.
   */
  readonly createStyleRecipe: <
    const Variants,
    const Base = never,
    const Compounds = readonly [],
    const DefaultedName extends keyof Variants = never,
  >(
    config: (
      theme: Theme,
    ) => StyleRecipeConfig<Variants, Base, Compounds, DefaultedName>,
  ) => ThemedRecipe<
    Theme,
    VariantSelection<Variants, DefaultedName>,
    RecipeStyle<Variants, Base, Compounds>
  >;
  /**
   * Creates a themed slot style recipe: `createSlotStyleRecipe` with a
   * config built from a theme.
   *
   * @typeParam Slot - The names of the slots, inferred from `config.slots`.
   * @typeParam Variants - The variant definitions, inferred from
   *   `config.variants`.
   * @typeParam Base - The base styles, inferred from `config.base`.
   * @typeParam Compounds - The compound variants, inferred from
   *   `config.compoundVariants`.
   * @typeParam DefaultedName - The names of the variants that have a
   *   default, inferred from `config.defaultVariants`.
   * @param config - Returns the config of the slot recipe for a theme.
   * @returns The themed slot recipe.
   */
  readonly createSlotStyleRecipe: <
    const Slot extends string,
    const Variants,
    const Base = never,
    const Compounds = readonly [],
    const DefaultedName extends keyof Variants = never,
  >(
    config: (
      theme: Theme,
    ) => SlotStyleRecipeConfig<Slot, Variants, Base, Compounds, DefaultedName>,
  ) => ThemedRecipe<
    Theme,
    VariantSelection<Variants, DefaultedName>,
    RecipeSlotStyles<Slot, Variants, Base, Compounds>
  >;
}

/**
 * Returns the functions that create recipes whose styles are built from a
 * theme of type `Theme`, such as the tokens of a design system.
 *
 * @remarks
 * Each creator takes a function that returns the config of the recipe for
 * a theme, and returns a themed recipe, which takes the theme and a
 * selection of variants. The first call with a theme object builds the
 * recipe of that theme from its config; later calls with the same object
 * reuse it, so they return the same frozen styles for the same variants,
 * as the recipes of `createStyleRecipe` and `createSlotStyleRecipe` do. A
 * theme that is no longer referenced is released with its recipe.
 *
 * The config of every theme must declare the same variants and options;
 * only the styles may depend on the theme.
 *
 * @typeParam Theme - The theme the styles are built from.
 * @returns `createStyleRecipe` and `createSlotStyleRecipe`, which take a
 *   config built from a theme.
 *
 * @example
 * ```ts
 * interface Theme {
 *   readonly colors: { readonly primary: string; readonly surface: string };
 *   readonly radius: number;
 * }
 *
 * const { createStyleRecipe } = createThemedRecipes<Theme>();
 *
 * const button = createStyleRecipe((theme) => ({
 *   base: { borderRadius: theme.radius },
 *   variants: {
 *     tone: {
 *       primary: { backgroundColor: theme.colors.primary },
 *       surface: { backgroundColor: theme.colors.surface },
 *     },
 *   },
 *   defaultVariants: { tone: "primary" },
 * }));
 *
 * const light: Theme = {
 *   colors: { primary: "#2563eb", surface: "#ffffff" },
 *   radius: 8,
 * };
 *
 * button(light, { tone: "surface" });
 * // => { borderRadius: 8, backgroundColor: "#ffffff" }
 *
 * button(light) === button(light, { tone: "primary" }); // => true
 *
 * button.withTheme(light).variantKeys; // => ["tone"]
 * ```
 */
function createThemedRecipes<
  Theme extends object,
>(): ThemedRecipeCreators<Theme>;

function createThemedRecipes(): {
  readonly createStyleRecipe: (config: never) => unknown;
  readonly createSlotStyleRecipe: (config: never) => unknown;
} {
  return {
    createSlotStyleRecipe: (
      config: (theme: object) => LooseSlotStyleRecipeConfig,
    ): LooseThemedRecipe<object, LooseSlotStyleRecipe> =>
      buildThemedRecipe((theme) => buildSlotStyleRecipe(config(theme))),
    createStyleRecipe: (
      config: (theme: object) => LooseStyleRecipeConfig,
    ): LooseThemedRecipe<object, LooseStyleRecipe> =>
      buildThemedRecipe((theme) => buildStyleRecipe(config(theme))),
  };
}

export { createThemedRecipes };
export type { ThemedRecipe, ThemedRecipeCreators };
