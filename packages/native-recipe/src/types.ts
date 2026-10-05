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
type NoUnknownProperties<Style> = Readonly<
  Partial<Record<Exclude<KeyOfEach<Style>, StyleKey>, never>>
>;

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
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantOption,
  VariantSelection,
} from "@lynstack/recipe";
export type {
  KeyOfEach,
  NativeStyle,
  NoUnknownProperties,
  OptionValue,
  PropertyOfEach,
  VariantsOf,
};
