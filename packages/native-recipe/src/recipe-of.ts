import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
  InheritedDefaultedName,
} from "@lynstack/recipe";

import type {
  ComposedSlotStyleRecipe,
  SlotStyleRecipeVariants,
} from "./slot-style-recipe.js";
import type {
  ComposedStyleRecipe,
  RecipeStyle,
  StyleRecipeVariants,
} from "./style-recipe.js";
import type {
  DefaultedNameOf,
  NativeStyle,
  RecipeSlotStyles,
  SlotStyles,
} from "./types.js";

/** The base style of a config of type `Config`, or `never` without one. */
type BaseOf<Config> = Config extends { readonly base: infer Base }
  ? Base
  : never;

/** The compound variants of a config of type `Config`, or none. */
type CompoundsOf<Config> = Config extends {
  readonly compoundVariants: infer Compounds;
}
  ? Compounds
  : readonly [];

/**
 * The parts of a config that {@link StyleRecipeOf} reads, without
 * `composes`, which it takes as its own type parameter.
 */
interface StyleRecipeConfigParts {
  readonly composes?: never;
  readonly base?: NativeStyle | undefined;
  readonly variants: StyleRecipeVariants;
  readonly compoundVariants?: readonly unknown[] | undefined;
  readonly defaultVariants?: object | undefined;
}

/**
 * The parts of a config that {@link SlotStyleRecipeOf} reads, without
 * `composes`, which it takes as its own type parameter.
 */
interface SlotStyleRecipeConfigParts {
  readonly composes?: never;
  readonly slots: readonly string[];
  readonly base?: SlotStyles<string> | undefined;
  readonly variants: SlotStyleRecipeVariants;
  readonly compoundVariants?: readonly unknown[] | undefined;
  readonly defaultVariants?: object | undefined;
}

/**
 * The type of the recipe that `createStyleRecipe` returns for a config of
 * type `Config` that composes the recipes of `Composed`. Annotate an
 * exported recipe with it where each file's declarations are emitted on
 * its own, as with `isolatedDeclarations`, which cannot infer the type of
 * a call. A config that lists `composes` is rejected, so that the type
 * cannot leave out the recipes it composes.
 * It applies to a config whose type is known, not in a function generic
 * over the whole config, from which `createStyleRecipe` cannot infer the
 * variants; make such a function generic over the variants instead.
 *
 * @typeParam Config - The type of the config without `composes`: declare
 *   the config `as const`, and annotate the recipe with its `typeof`.
 * @typeParam Composed - The types of the recipes it composes, in the order
 *   of `composes`. Defaults to none.
 *
 * @example
 * ```ts
 * const boxConfig = {
 *   base: { borderRadius: 8 },
 *   variants: { size: { sm: { padding: 4 }, md: { padding: 8 } } },
 *   defaultVariants: { size: "md" },
 * } as const;
 *
 * export const box: StyleRecipeOf<typeof boxConfig> =
 *   createStyleRecipe(boxConfig);
 *
 * const cardConfig = { variants: { raised: { true: { elevation: 2 } } } } as const;
 *
 * export const card: StyleRecipeOf<typeof cardConfig, readonly [typeof box]> =
 *   createStyleRecipe({ ...cardConfig, composes: [box] });
 *
 * card({ raised: true }); // => { borderRadius: 8, padding: 8, elevation: 2 }
 * ```
 */
type StyleRecipeOf<
  Config extends StyleRecipeConfigParts,
  Composed extends readonly ComposableKindRecipe<NativeStyle>[] = readonly [],
> = ComposedStyleRecipe<
  ComposedVariants<Composed, Config["variants"]>,
  | Extract<
      DefaultedNameOf<Config>,
      keyof ComposedVariants<Composed, Config["variants"]>
    >
  | InheritedDefaultedName<Composed, Config["variants"]>,
  RecipeStyle<Config["variants"], BaseOf<Config>, CompoundsOf<Config>, Composed>
>;

/**
 * The type of the slot recipe that `createSlotStyleRecipe` returns for a
 * config of type `Config` that composes the slot recipes of `Composed`.
 * Annotate an exported slot recipe with it where each file's declarations
 * are emitted on its own, as with `isolatedDeclarations`, which cannot
 * infer the type of a call. A config that lists `composes` is rejected, so
 * that the type cannot leave out the slot recipes it composes.
 * It applies to a config whose type is known, not in a function generic
 * over the whole config, from which `createSlotStyleRecipe` cannot infer the
 * variants; make such a function generic over the variants instead.
 *
 * @typeParam Config - The type of the config without `composes`: declare
 *   the config `as const`, and annotate the slot recipe with its `typeof`.
 * @typeParam Composed - The types of the slot recipes it composes, in the
 *   order of `composes`. Defaults to none.
 *
 * @example
 * ```ts
 * const fieldConfig = {
 *   slots: ["root", "label"],
 *   base: { root: { gap: 4 } },
 *   variants: { size: { sm: { label: { fontSize: 12 } } } },
 * } as const;
 *
 * export const field: SlotStyleRecipeOf<typeof fieldConfig> =
 *   createSlotStyleRecipe(fieldConfig);
 *
 * const searchConfig = {
 *   slots: ["icon"],
 *   variants: { size: { sm: { icon: { width: 12 } } } },
 * } as const;
 *
 * export const search: SlotStyleRecipeOf<
 *   typeof searchConfig,
 *   readonly [typeof field]
 * > = createSlotStyleRecipe({ ...searchConfig, composes: [field] });
 *
 * search({ size: "sm" }).icon; // => { width: 12 }
 * ```
 */
type SlotStyleRecipeOf<
  Config extends SlotStyleRecipeConfigParts,
  Composed extends readonly ComposableKindSlotRecipe<NativeStyle>[] =
    readonly [],
> = ComposedSlotStyleRecipe<
  | Config["slots"][number]
  | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
  ComposedVariants<Composed, Config["variants"]>,
  | Extract<
      DefaultedNameOf<Config>,
      keyof ComposedVariants<Composed, Config["variants"]>
    >
  | InheritedDefaultedName<Composed, Config["variants"]>,
  RecipeSlotStyles<
    | Config["slots"][number]
    | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
    Config["variants"],
    BaseOf<Config>,
    CompoundsOf<Config>,
    Composed
  >
>;

export type {
  BaseOf,
  CompoundsOf,
  SlotStyleRecipeConfigParts,
  SlotStyleRecipeOf,
  StyleRecipeConfigParts,
  StyleRecipeOf,
};
