import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedKindRecipe,
  ComposedVariants,
  InheritedDefaultedName,
} from "./composition.js";
import type { KindSlotVariants } from "./slot-recipe-kind.js";
import type { KindVariants } from "./recipe-kind.js";

/**
 * The names of the variants with a default in a config of type `Config`:
 * the keys of its `defaultVariants`, among its variants and those of the
 * recipes of `Composed`.
 */
type DefaultedNameOf<
  Config,
  Composed extends readonly unknown[],
> = Config extends {
  readonly defaultVariants: infer Defaults;
  readonly variants: infer Variants;
}
  ? Extract<keyof Defaults, keyof ComposedVariants<Composed, Variants>>
  : never;

/**
 * The parts of a config that {@link KindRecipeOf} reads, without
 * `composes`, which it takes as its own type parameter.
 */
interface KindRecipeConfigParts<Value> {
  readonly composes?: never;
  readonly variants: KindVariants<Value>;
  readonly defaultVariants?: object | undefined;
}

/**
 * The type of the recipe that a function of type
 * `CreateKindRecipe<Value, Result>` returns for a config of type `Config`
 * that composes the recipes of `Composed`. Annotate an exported recipe
 * with it where each file's declarations are emitted on its own, as with
 * `isolatedDeclarations`, which cannot infer the type of a call. A config
 * that lists `composes` is rejected, so that the type cannot leave out the
 * recipes it composes.
 *
 * It needs a config whose type is known. In a function generic over the
 * whole config, the recipe's creator cannot infer the variants, so make
 * such a function generic over the variants instead.
 *
 * @typeParam Value - The value of an option, as in `CreateKindRecipe`.
 * @typeParam Result - What a recipe of the kind returns, as in
 *   `CreateKindRecipe`.
 * @typeParam Config - The type of the config without `composes`: declare
 *   the config `as const`, and annotate the recipe with its `typeof`.
 * @typeParam Composed - The types of the recipes it composes, in the order
 *   of `composes`. Defaults to none.
 *
 * @example
 * ```ts
 * const textConfig = {
 *   variants: { size: { sm: { fontSize: 12 }, md: { fontSize: 16 } } },
 *   defaultVariants: { size: "md" },
 * } as const;
 *
 * export const text: KindRecipeOf<Style, Style, typeof textConfig> =
 *   styleRecipe(textConfig);
 *
 * const headingConfig = {
 *   variants: { size: { xl: { fontSize: 32 } } },
 * } as const;
 *
 * export const heading: KindRecipeOf<
 *   Style,
 *   Style,
 *   typeof headingConfig,
 *   readonly [typeof text]
 * > = styleRecipe({ ...headingConfig, composes: [text] });
 *
 * heading({ size: "xl" }); // => { fontSize: 32 }
 * ```
 */
type KindRecipeOf<
  Value,
  Result,
  Config extends KindRecipeConfigParts<Value>,
  Composed extends readonly ComposableKindRecipe<Value>[] = readonly [],
> = ComposedKindRecipe<
  ComposedVariants<Composed, Config["variants"]>,
  | DefaultedNameOf<Config, Composed>
  | InheritedDefaultedName<Composed, Config["variants"]>,
  Value,
  Result,
  undefined
>;

/**
 * The parts of a config that {@link KindSlotRecipeOf} reads, without
 * `composes`, which it takes as its own type parameter.
 */
interface KindSlotRecipeConfigParts<Value> {
  readonly composes?: never;
  readonly slots: readonly string[];
  readonly variants: KindSlotVariants<Value>;
  readonly defaultVariants?: object | undefined;
}

/**
 * The type of the slot recipe that a function of type
 * `CreateKindSlotRecipe<Value, Result>` returns for a config of type
 * `Config` that composes the slot recipes of `Composed`. Annotate an
 * exported slot recipe with it where each file's declarations are emitted
 * on its own, as with `isolatedDeclarations`, which cannot infer the type
 * of a call. A config that lists `composes` is rejected, so that the type
 * cannot leave out the slot recipes it composes.
 *
 * It needs a config whose type is known. In a function generic over the
 * whole config, the slot recipe's creator cannot infer the variants, so
 * make such a function generic over the variants instead.
 *
 * @typeParam Value - The value of a slot, as in `CreateKindSlotRecipe`.
 * @typeParam Result - What a slot recipe of the kind returns for each
 *   slot, as in `CreateKindSlotRecipe`.
 * @typeParam Config - The type of the config without `composes`: declare
 *   the config `as const`, and annotate the slot recipe with its `typeof`.
 * @typeParam Composed - The types of the slot recipes it composes, in the
 *   order of `composes`. Defaults to none.
 *
 * @example
 * ```ts
 * const cardConfig = {
 *   slots: ["root", "title"],
 *   variants: { tone: { dark: { root: { backgroundColor: "black" } } } },
 * } as const;
 *
 * export const card: KindSlotRecipeOf<Style, Style, typeof cardConfig> =
 *   slotStyleRecipe(cardConfig);
 *
 * const dialogConfig = {
 *   slots: ["footer"],
 *   variants: { tone: { dark: { footer: { borderColor: "white" } } } },
 * } as const;
 *
 * export const dialog: KindSlotRecipeOf<
 *   Style,
 *   Style,
 *   typeof dialogConfig,
 *   readonly [typeof card]
 * > = slotStyleRecipe({ ...dialogConfig, composes: [card] });
 *
 * dialog({ tone: "dark" });
 * // => { root: { backgroundColor: "black" }, title: {}, footer: { borderColor: "white" } }
 * ```
 */
type KindSlotRecipeOf<
  Value,
  Result,
  Config extends KindSlotRecipeConfigParts<Value>,
  Composed extends readonly ComposableKindSlotRecipe<Value>[] = readonly [],
> = ComposedKindRecipe<
  ComposedVariants<Composed, Config["variants"]>,
  | DefaultedNameOf<Config, Composed>
  | InheritedDefaultedName<Composed, Config["variants"]>,
  Value,
  Readonly<
    Record<
      | Config["slots"][number]
      | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
      Result
    >
  >,
  readonly (
    | Config["slots"][number]
    | Exclude<Composed[number]["~composition"], undefined>["slots"][number]
  )[]
>;

export type { KindRecipeOf, KindSlotRecipeOf };
