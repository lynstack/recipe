import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import type { VariantsOf as RecipeVariantsOf } from "@lynstack/recipe";

/**
 * The style of a React Native element: a view, a text, or an image, as
 * `StyleSheet.create` accepts it.
 */
type NativeStyle = ViewStyle | TextStyle | ImageStyle;

type StyleKey = keyof ViewStyle | keyof TextStyle | keyof ImageStyle;

/** The keys of every style in the union `Style`. */
type KeyOfEach<Style> = Style extends unknown ? keyof Style : never;

/**
 * Rejects the properties of the styles in `Style` that no React Native
 * style has, which the `NativeStyle` constraint alone lets through next to
 * known ones.
 */
type NoUnknownProperties<Style> = [UnknownKey<Style>] extends [never]
  ? unknown
  : Readonly<Partial<Record<UnknownKey<Style>, never>>>;

/** The keys of the styles in `Style` that no React Native style has. */
type UnknownKey<Style> = Exclude<KeyOfEach<Style>, StyleKey>;

/** The values that the styles in the union `Style` give to `Key`. */
type PropertyOfEach<Style, Key extends PropertyKey> = {
  [Property in Key]: Style extends unknown
    ? Property extends keyof Style
      ? Style[Property]
      : never
    : never;
}[Key];

/** The value of each option of each variant, as a union. */
type OptionValue<Variants> = {
  [Name in keyof Variants]: Variants[Name][keyof Variants[Name]];
}[keyof Variants];

/**
 * Styles for some of a slot recipe's slots, keyed by slot name.
 *
 * @typeParam Slot - The names of the slots.
 */
type SlotStyles<Slot extends string> = Readonly<
  Partial<Record<Slot, NativeStyle | undefined>>
>;

/**
 * Rejects the slots and style properties of an option's styles that the
 * slot recipe does not have, unless the option's slot names are not known
 * at compile time.
 */
type NoUnknownSlotStyles<
  Styles,
  Slot extends string,
> = string extends keyof Styles
  ? unknown
  : {
      readonly [Name in keyof Styles]: Name extends Slot
        ? NoUnknownProperties<NonNullable<Styles[Name]>>
        : never;
    };

type NoUnknownVariantStyles<Variants, Slot extends string> = {
  readonly [Name in keyof Variants]: {
    readonly [Option in keyof Variants[Name]]: NoUnknownSlotStyles<
      Variants[Name][Option],
      Slot
    >;
  };
};

/**
 * Rejects the slots and style properties of the compound variants' styles,
 * given as a union, that the slot recipe does not have.
 */
type NoUnknownCompoundStyles<Styles, Slot extends string> = Readonly<
  Partial<Record<Exclude<KeyOfEach<Styles>, Slot>, never>>
> & {
  readonly [Name in Slot]?: NoUnknownProperties<DeclaredStyle<Styles, Name>>;
};

/** Every style that a slot recipe's config declares for `Slot`, as a union. */
type DeclaredStyle<Styles, Slot> = Styles extends unknown
  ? Slot extends keyof Styles
    ? Exclude<Styles[Slot], undefined>
    : never
  : never;

/**
 * Every slot style that a slot recipe's config declares, and the styles of
 * each slot recipe it composes, as a union.
 */
type DeclaredSlotStyles<Variants, Base, Compounds, Composed> =
  | Base
  | OptionValue<Variants>
  | CompoundStyles<Compounds>
  | ComposedStyle<Composed>;

type CompoundStyles<Compounds> = Compounds extends readonly (infer Compound)[]
  ? Compound extends { readonly styles: infer Styles }
    ? Styles
    : never
  : never;

/**
 * The styles a slot recipe returns: for each slot, each property its config
 * and the slot recipes it composes declare for it, with the types they give
 * it.
 */
type RecipeSlotStyles<
  Slot extends string,
  Variants,
  Base,
  Compounds,
  Composed = readonly [],
> = {
  readonly [Name in Slot]: {
    readonly [
      Key in KeyOfEach<
        DeclaredStyle<
          DeclaredSlotStyles<Variants, Base, Compounds, Composed>,
          Name
        >
      >
    ]?: PropertyOfEach<
      DeclaredStyle<
        DeclaredSlotStyles<Variants, Base, Compounds, Composed>,
        Name
      >,
      Key
    >;
  };
};

/**
 * What the recipes of `Composed` return, as a union: the style of a style
 * recipe, or the styles of a slot style recipe.
 */
type ComposedStyle<Composed> = Composed extends readonly (infer Recipe)[]
  ? Recipe extends (...args: never) => infer Style
    ? Style
    : never
  : never;

/**
 * The variants a recipe accepts, a themed recipe included. Use it to type
 * the props of a component built on a recipe.
 *
 * @typeParam Recipe - The type of a recipe, such as one created by
 *   `createStyleRecipe`, or of a themed recipe, such as one created by the
 *   `createStyleRecipe` of `createThemedRecipes`.
 *
 * @example
 * ```ts
 * const box = createStyleRecipe({
 *   variants: { size: { sm: { padding: 4 }, md: { padding: 8 } } },
 *   defaultVariants: { size: "md" },
 * });
 *
 * type BoxVariants = VariantsOf<typeof box>;
 * // => { readonly size?: "sm" | "md" | undefined }
 * ```
 */
type VariantsOf<Recipe extends (...args: never) => unknown> = Recipe extends {
  readonly withTheme: (
    theme: never,
  ) => infer ThemeRecipe extends (props: never) => unknown;
}
  ? RecipeVariantsOf<ThemeRecipe>
  : Recipe extends (props: never) => unknown
    ? RecipeVariantsOf<Recipe>
    : never;

export type {
  ComposedSlot,
  CompoundCondition,
  DefaultVariants,
  KindRecipe,
  RecipeComposition,
  RecipeFunction,
  VariantOption,
  VariantSelection,
} from "@lynstack/recipe";
export type {
  ComposedStyle,
  CompoundStyles,
  DeclaredStyle,
  KeyOfEach,
  NativeStyle,
  NoUnknownCompoundStyles,
  NoUnknownProperties,
  NoUnknownSlotStyles,
  NoUnknownVariantStyles,
  OptionValue,
  PropertyOfEach,
  RecipeSlotStyles,
  SlotStyles,
  VariantsOf,
};
