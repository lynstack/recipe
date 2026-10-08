import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
  KindRecipe,
  RecipeComposition,
} from "@lynstack/recipe";

import type {
  InheritedDefaultedName,
  NativeStyle,
  RecipeSlotStyles,
  SlotStyles,
  VariantSelection,
} from "./types.js";
import type {
  LooseSlotStyleRecipe,
  LooseSlotStyleRecipeConfig,
} from "./compile-slot-style-recipe.js";
import type {
  LooseStyleRecipe,
  LooseStyleRecipeConfig,
} from "./compile-style-recipe.js";
import type {
  RecipeStyle,
  StyleCompoundVariant,
  StyleRecipeConfig,
} from "./style-recipe.js";
import type {
  SlotStyleCompoundVariant,
  SlotStyleRecipeConfig,
} from "./slot-style-recipe.js";
import type { LooseThemedRecipe } from "./compile-themed-recipe.js";
import { buildSlotStyleRecipe } from "./compile-slot-style-recipe.js";
import { buildStyleRecipe } from "./compile-style-recipe.js";
import { buildThemedRecipe } from "./compile-themed-recipe.js";

/**
 * A function that takes a theme and the properties of a selection, whose
 * second argument is optional when every property of `Props` is.
 */
type ThemedRecipeFunction<Theme, Props, Result> =
  Partial<Props> extends Props
    ? (theme: Theme, props?: Props) => Result
    : (theme: Theme, props: Props) => Result;

/**
 * A recipe whose styles are built from a theme: a function that returns
 * the styles of a selection of variants in a theme, with `withTheme`, which
 * returns the recipe of one theme.
 *
 * @typeParam Theme - The theme the styles are built from.
 * @typeParam Props - The variants the recipe accepts.
 * @typeParam Result - What the recipe returns.
 * @typeParam Composition - What the recipe of each theme passes on to the
 *   recipes that compose it, under a `~composition` property that exists in
 *   the type only. Without it, the type does not allow composing the recipe
 *   of a theme.
 */
type ThemedRecipe<
  Theme,
  Props,
  Result,
  Composition = unknown,
> = ThemedRecipeFunction<Theme, Props, Result> & {
  /**
   * Returns the recipe of `theme`, the same recipe for the same theme
   * object, with its variants listed in `variantKeys`, `variantOptions`,
   * and `defaultVariants`. A themed recipe composes it with the theme its
   * own config is built from.
   */
  readonly withTheme: (theme: Theme) => KindRecipe<Props, Result, Composition>;
};

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
   * @typeParam Composed - The types of the recipes it composes, inferred
   *   from `config.composes`.
   * @param config - Returns the config of the recipe for a theme.
   * @returns The themed recipe.
   */
  readonly createStyleRecipe: <
    const Variants,
    const Base = never,
    const Compounds extends readonly StyleCompoundVariant<
      NoInfer<ComposedVariants<Composed, Variants>>
    >[] = readonly [],
    const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
      never,
    const Composed extends readonly ComposableKindRecipe<NativeStyle>[] =
      readonly [],
  >(
    config: (
      theme: Theme,
    ) => StyleRecipeConfig<Variants, Base, Compounds, DefaultedName, Composed>,
  ) => ComposedThemedRecipe<
    Theme,
    ComposedVariants<Composed, Variants>,
    NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>,
    RecipeStyle<Variants, Base, Compounds, Composed>,
    undefined
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
   * @typeParam Composed - The types of the slot recipes it composes,
   *   inferred from `config.composes`.
   * @param config - Returns the config of the slot recipe for a theme.
   * @returns The themed slot recipe.
   */
  readonly createSlotStyleRecipe: <
    const Slot extends string,
    const Variants,
    const Base extends SlotStyles<string> = never,
    const Compounds extends readonly SlotStyleCompoundVariant<
      NoInfer<ComposedVariants<Composed, Variants>>
    >[] = readonly [],
    const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
      never,
    const Composed extends readonly ComposableKindSlotRecipe<NativeStyle>[] =
      readonly [],
  >(
    config: (
      theme: Theme,
    ) => SlotStyleRecipeConfig<
      Slot,
      Variants,
      Base,
      Compounds,
      DefaultedName,
      Composed
    >,
  ) => ComposedThemedRecipe<
    Theme,
    ComposedVariants<Composed, Variants>,
    NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>,
    // Not ComposedSlot, which declarations print with each composed type.
    RecipeSlotStyles<
      | Slot
      | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
      Variants,
      Base,
      Compounds,
      Composed
    >,
    readonly (
      | Slot
      | Exclude<Composed[number]["~composition"], undefined>["slots"][number]
    )[]
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
 * only the styles may depend on the theme. A themed recipe composes the
 * recipe of a theme that `withTheme` returns, such as
 * `composes: [control.withTheme(theme)]` in the config of `theme`.
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
 * button.withTheme(light).defaultVariants; // => { tone: "primary" }
 *
 * const iconButton = createStyleRecipe((theme) => ({
 *   composes: [button.withTheme(theme)],
 *   base: { width: 40, height: 40 },
 *   variants: {},
 * }));
 *
 * iconButton(light, { tone: "surface" });
 * // => { borderRadius: 8, width: 40, height: 40, backgroundColor: "#ffffff" }
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
export type { ComposedThemedRecipe, ThemedRecipe, ThemedRecipeCreators };
