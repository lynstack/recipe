import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
} from "@lynstack/recipe";

import type { ComposedRecipe, RecipeVariants } from "./recipe.js";
import type { ComposedSlotRecipe, SlotRecipeVariants } from "./slot-recipe.js";
import type { DefaultedNameOf, InheritedDefaultedName } from "./types.js";

/**
 * The parts of a config that {@link RecipeOf} reads, without `composes`,
 * which it takes as its own type parameter.
 */
interface RecipeConfigParts {
  readonly composes?: never;
  readonly variants: RecipeVariants;
  readonly defaultVariants?: object | undefined;
}

/**
 * The type of the recipe that `cva` returns for a config of type `Config`
 * that composes the recipes of `Composed`. Annotate an exported recipe
 * with it where each file's declarations are emitted on its own, as with
 * `isolatedDeclarations`, which cannot infer the type of a call. A config
 * that lists `composes` is rejected, so that the type cannot leave out the
 * recipes it composes.
 * It applies to a config whose type is known, not in a function generic
 * over the whole config, from which `cva` cannot infer the variants;
 * make such a function generic over the variants instead.
 *
 * @typeParam Config - The type of the config without `composes`: declare
 *   the config `as const`, and annotate the recipe with its `typeof`.
 * @typeParam Composed - The types of the recipes it composes, in the order
 *   of `composes`. Defaults to none.
 *
 * @example
 * ```ts
 * const buttonConfig = {
 *   variants: { size: { sm: "h-8", md: "h-10" } },
 *   defaultVariants: { size: "md" },
 * } as const;
 *
 * export const button: RecipeOf<typeof buttonConfig> = cva(buttonConfig);
 *
 * const iconButtonConfig = { variants: { size: { icon: "size-10" } } } as const;
 *
 * export const iconButton: RecipeOf<
 *   typeof iconButtonConfig,
 *   readonly [typeof button]
 * > = cva({ ...iconButtonConfig, composes: [button] });
 *
 * iconButton({ size: "icon" }); // => "size-10"
 * ```
 */
type RecipeOf<
  Config extends RecipeConfigParts,
  Composed extends readonly ComposableKindRecipe<string>[] = readonly [],
> = ComposedRecipe<
  ComposedVariants<Composed, Config["variants"]>,
  | Extract<
      DefaultedNameOf<Config>,
      keyof ComposedVariants<Composed, Config["variants"]>
    >
  | InheritedDefaultedName<Composed, Config["variants"]>
>;

/**
 * The parts of a config that {@link SlotRecipeOf} reads, without
 * `composes`, which it takes as its own type parameter.
 */
interface SlotRecipeConfigParts {
  readonly composes?: never;
  readonly slots: readonly string[];
  readonly variants: SlotRecipeVariants;
  readonly defaultVariants?: object | undefined;
}

/**
 * The type of the slot recipe that `sva` returns for a config of type
 * `Config` that composes the slot recipes of `Composed`. Annotate an
 * exported slot recipe with it where each file's declarations are emitted
 * on its own, as with `isolatedDeclarations`, which cannot infer the type
 * of a call. A config that lists `composes` is rejected, so that the type
 * cannot leave out the slot recipes it composes.
 * It applies to a config whose type is known, not in a function generic
 * over the whole config, from which `sva` cannot infer the variants;
 * make such a function generic over the variants instead.
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
 *   variants: { size: { sm: { label: "text-sm" }, md: { label: "text-base" } } },
 *   defaultVariants: { size: "md" },
 * } as const;
 *
 * export const field: SlotRecipeOf<typeof fieldConfig> = sva(fieldConfig);
 *
 * const selectConfig = {
 *   slots: ["trigger"],
 *   variants: { open: { true: { trigger: "ring-2" } } },
 * } as const;
 *
 * export const select: SlotRecipeOf<
 *   typeof selectConfig,
 *   readonly [typeof field]
 * > = sva({ ...selectConfig, composes: [field] });
 *
 * select({ open: true });
 * // => { root: "", label: "text-base", trigger: "ring-2" }
 * ```
 */
type SlotRecipeOf<
  Config extends SlotRecipeConfigParts,
  Composed extends readonly ComposableKindSlotRecipe<string>[] = readonly [],
> = ComposedSlotRecipe<
  | Config["slots"][number]
  | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
  ComposedVariants<Composed, Config["variants"]>,
  | Extract<
      DefaultedNameOf<Config>,
      keyof ComposedVariants<Composed, Config["variants"]>
    >
  | InheritedDefaultedName<Composed, Config["variants"]>
>;

export type { RecipeOf, SlotRecipeOf };
