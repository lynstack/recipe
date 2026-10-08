import { ComposableKindRecipe, ComposableKindRecipe as ComposableKindRecipe$1, ComposableKindSlotRecipe, ComposableKindSlotRecipe as ComposableKindSlotRecipe$1, ComposedDefaultedName, ComposedSlot, ComposedVariants, ComposedVariants as ComposedVariants$1, CompoundCondition, DefaultVariants, KindRecipe, KindRecipe as KindRecipe$1, KindVariants, RecipeComposition, RecipeComposition as RecipeComposition$1, RecipeFunction, VariantOption, VariantSelection, VariantsOf as VariantsOf$1 } from "@lynstack/recipe";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";
//#region src/types.d.ts
type NativeStyle = ViewStyle | TextStyle | ImageStyle;
type StyleKey = keyof ViewStyle | keyof TextStyle | keyof ImageStyle;
type InheritedDefaultedName<Composed extends readonly unknown[], Variants> = Extract<ComposedDefaultedName<Composed, never>, keyof ComposedVariants$1<Composed, Variants>>;
type DefaultedNameOf<Config> = Config extends {
  readonly defaultVariants: infer Defaults;
} ? keyof Defaults : never;
type KeyOfEach<Style> = Style extends unknown ? keyof Style : never;
type NoUnknownProperties<Style> = [UnknownKey<Style>] extends [never] ? unknown : Readonly<Partial<Record<UnknownKey<Style>, never>>>;
type UnknownKey<Style> = Exclude<KeyOfEach<Style>, StyleKey>;
type PropertyOfEach<Style, Key extends PropertyKey> = { [Property in Key]: Style extends unknown ? Property extends keyof Style ? Style[Property] : never : never; }[Key];
type OptionValue<Variants> = { [Name in keyof Variants]: Variants[Name][keyof Variants[Name]]; }[keyof Variants];
type SlotStyles<Slot extends string> = Readonly<Partial<Record<Slot, NativeStyle | undefined>>>;
type NoUnknownSlotStyles<Styles, Slot extends string, Inherited extends string = never> = string extends keyof Styles ? unknown : { readonly [Name in keyof Styles]: Name extends Slot ? NoUnknownProperties<NonNullable<Styles[Name]>> : Name extends Inherited ? NoUnknownProperties<NonNullable<Styles[Name]>> : never; };
type NoUnknownVariantStyles<Variants, Slot extends string, Inherited extends string = never> = { readonly [Name in keyof Variants]: { readonly [Option in keyof Variants[Name]]: NoUnknownSlotStyles<Variants[Name][Option], Slot, Inherited>; }; };
type InheritedSlot<Composed extends readonly ComposableKindSlotRecipe$1<NativeStyle>[]> = NonNullable<Composed[number]["~composition"]>["slots"][number];
type NoUnknownCompoundStyles<Styles, Slot extends string, Inherited extends string = never> = string extends KeyOfEach<Styles> ? SlotStyles<string> : Readonly<Partial<Record<Exclude<Exclude<KeyOfEach<Styles>, Slot>, Inherited>, never>>> & { readonly [Name in Slot | Inherited]?: NoUnknownProperties<DeclaredStyle$1<Styles, Name>>; };
type DeclaredStyle$1<Styles, Slot> = Styles extends unknown ? Slot extends keyof Styles ? Exclude<Styles[Slot], undefined> : never : never;
type DeclaredSlotStyles<Variants, Base, Compounds, Composed> = Base | OptionValue<Variants> | CompoundStyles<Compounds> | ComposedStyle<Composed>;
type CompoundStyles<Compounds> = Compounds extends readonly (infer Compound)[] ? Compound extends {
  readonly styles: infer Styles;
} ? Styles : never : never;
type RecipeSlotStyles<Slot extends string, Variants, Base, Compounds, Composed = readonly []> = { readonly [Name in Slot]: { readonly [Key in KeyOfEach<DeclaredStyle$1<DeclaredSlotStyles<Variants, Base, Compounds, Composed>, Name>>]?: PropertyOfEach<DeclaredStyle$1<DeclaredSlotStyles<Variants, Base, Compounds, Composed>, Name>, Key>; }; };
type ComposedStyle<Composed> = Composed extends readonly (infer Recipe)[] ? Recipe extends ((...args: never) => infer Style) ? Style : never : never;
type VariantsOf<Recipe extends (...args: never) => unknown> = Recipe extends {
  readonly withTheme: (theme: never) => infer ThemeRecipe extends (props: never) => unknown;
} ? VariantsOf$1<ThemeRecipe> : Recipe extends ((props: never) => unknown) ? VariantsOf$1<Recipe> : never;
//#endregion
//#region src/slot-style-recipe.d.ts
type SlotStyleRecipeVariants = KindVariants<SlotStyles<string>>;
interface SlotStyleCompoundVariant<Variants, Styles = SlotStyles<string>> {
  readonly variants: CompoundCondition<Variants>;
  readonly styles: Styles;
}
interface SlotStyleRecipeConfig<Slot extends string, Variants, Base, Compounds, DefaultedName extends keyof ComposedVariants$1<Composed, Variants>, Composed extends readonly ComposableKindSlotRecipe$1<NativeStyle>[] = readonly []> {
  readonly composes?: Composed | undefined;
  readonly slots: readonly Slot[];
  readonly base?: (Base & NoUnknownSlotStyles<Base, NoInfer<Slot>, InheritedSlot<Composed>>) | undefined;
  readonly variants: Variants & SlotStyleRecipeVariants & NoUnknownVariantStyles<Variants, NoInfer<Slot>, InheritedSlot<Composed>>;
  readonly compoundVariants?: (Compounds & readonly SlotStyleCompoundVariant<NoInfer<ComposedVariants$1<Composed, Variants>>, NoUnknownCompoundStyles<CompoundStyles<Compounds>, NoInfer<Slot>, InheritedSlot<Composed>>>[]) | undefined;
  readonly defaultVariants?: DefaultVariants<ComposedVariants$1<Composed, Variants>, DefaultedName> | undefined;
  readonly cache?: boolean | undefined;
}
type SlotStyleRecipe<Props, Styles, Composition = unknown> = KindRecipe$1<Props, Styles, Composition>;
type ComposedSlotStyleRecipe<Slot extends string, Variants, DefaultedName extends keyof Variants, Styles> = SlotStyleRecipe<VariantSelection<Variants, DefaultedName>, Styles, RecipeComposition$1<Variants, DefaultedName, NativeStyle, readonly Slot[]>>;
declare function createSlotStyleRecipe<const Slot extends string, const Variants extends SlotStyleRecipeVariants, const Base extends SlotStyles<string> = never, const Compounds extends readonly SlotStyleCompoundVariant<NoInfer<ComposedVariants$1<Composed, Variants>>>[] = readonly [], const DefaultedName extends keyof ComposedVariants$1<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe$1<NativeStyle>[] = readonly []>(config: SlotStyleRecipeConfig<Slot, Variants, Base, Compounds, DefaultedName, Composed>): ComposedSlotStyleRecipe<Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number], ComposedVariants$1<Composed, Variants>, NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>, RecipeSlotStyles<Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number], Variants, Base, Compounds, Composed>>;
//#endregion
//#region src/style-recipe.d.ts
type StyleRecipeVariants = KindVariants<NativeStyle>;
type NoUnknownStyles<Variants> = { readonly [Name in keyof Variants]: { readonly [Option in keyof Variants[Name]]: NoUnknownProperties<Variants[Name][Option]>; }; };
interface StyleCompoundVariant<Variants, Style = NativeStyle> {
  readonly variants: CompoundCondition<Variants>;
  readonly style: Style;
}
interface StyleRecipeConfig<Variants, Base, Compounds, DefaultedName extends keyof ComposedVariants$1<Composed, Variants>, Composed extends readonly ComposableKindRecipe$1<NativeStyle>[] = readonly []> {
  readonly composes?: Composed | undefined;
  readonly base?: (Base & NativeStyle & NoUnknownProperties<Base>) | undefined;
  readonly variants: Variants & StyleRecipeVariants & NoUnknownStyles<Variants>;
  readonly compoundVariants?: (Compounds & readonly StyleCompoundVariant<NoInfer<ComposedVariants$1<Composed, Variants>>, NoUnknownProperties<CompoundStyle<Compounds>>>[]) | undefined;
  readonly defaultVariants?: DefaultVariants<ComposedVariants$1<Composed, Variants>, DefaultedName> | undefined;
  readonly cache?: boolean | undefined;
}
type DeclaredStyle<Variants, Base, Compounds, Composed = readonly []> = Base | OptionValue<Variants> | CompoundStyle<Compounds> | ComposedStyle<Composed>;
type CompoundStyle<Compounds> = Compounds extends readonly (infer Compound)[] ? Compound extends {
  readonly style: infer Style;
} ? Style : never : never;
type RecipeStyle<Variants, Base, Compounds, Composed = readonly []> = { readonly [Key in KeyOfEach<DeclaredStyle<Variants, Base, Compounds, Composed>>]?: PropertyOfEach<DeclaredStyle<Variants, Base, Compounds, Composed>, Key>; };
type StyleRecipe<Props, Style, Composition = unknown> = KindRecipe$1<Props, Style, Composition>;
type ComposedStyleRecipe<Variants, DefaultedName extends keyof Variants, Style> = StyleRecipe<VariantSelection<Variants, DefaultedName>, Style, RecipeComposition$1<Variants, DefaultedName, NativeStyle, undefined>>;
declare function createStyleRecipe<const Variants extends StyleRecipeVariants, const Base extends NativeStyle = never, const Compounds extends readonly StyleCompoundVariant<NoInfer<ComposedVariants$1<Composed, Variants>>>[] = readonly [], const DefaultedName extends keyof ComposedVariants$1<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe$1<NativeStyle>[] = readonly []>(config: StyleRecipeConfig<Variants, Base, Compounds, DefaultedName, Composed>): ComposedStyleRecipe<ComposedVariants$1<Composed, Variants>, NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>, RecipeStyle<Variants, Base, Compounds, Composed>>;
//#endregion
//#region src/recipe-of.d.ts
type BaseOf<Config> = Config extends {
  readonly base: infer Base;
} ? Base : never;
type CompoundsOf<Config> = Config extends {
  readonly compoundVariants: infer Compounds;
} ? Compounds : readonly [];
interface StyleRecipeConfigParts {
  readonly composes?: never;
  readonly base?: NativeStyle | undefined;
  readonly variants: StyleRecipeVariants;
  readonly compoundVariants?: readonly unknown[] | undefined;
  readonly defaultVariants?: object | undefined;
}
interface SlotStyleRecipeConfigParts {
  readonly composes?: never;
  readonly slots: readonly string[];
  readonly base?: SlotStyles<string> | undefined;
  readonly variants: SlotStyleRecipeVariants;
  readonly compoundVariants?: readonly unknown[] | undefined;
  readonly defaultVariants?: object | undefined;
}
type StyleRecipeOf<Config extends StyleRecipeConfigParts, Composed extends readonly ComposableKindRecipe$1<NativeStyle>[] = readonly []> = ComposedStyleRecipe<ComposedVariants$1<Composed, Config["variants"]>, Extract<DefaultedNameOf<Config>, keyof ComposedVariants$1<Composed, Config["variants"]>> | InheritedDefaultedName<Composed, Config["variants"]>, RecipeStyle<Config["variants"], BaseOf<Config>, CompoundsOf<Config>, Composed>>;
type SlotStyleRecipeOf<Config extends SlotStyleRecipeConfigParts, Composed extends readonly ComposableKindSlotRecipe$1<NativeStyle>[] = readonly []> = ComposedSlotStyleRecipe<Config["slots"][number] | Exclude<Composed[number]["~composition"], undefined>["slots"][number], ComposedVariants$1<Composed, Config["variants"]>, Extract<DefaultedNameOf<Config>, keyof ComposedVariants$1<Composed, Config["variants"]>> | InheritedDefaultedName<Composed, Config["variants"]>, RecipeSlotStyles<Config["slots"][number] | Exclude<Composed[number]["~composition"], undefined>["slots"][number], Config["variants"], BaseOf<Config>, CompoundsOf<Config>, Composed>>;
//#endregion
//#region src/themed-recipes.d.ts
type ThemedRecipeFunction<Theme, Props, Result> = Partial<Props> extends Props ? (theme: Theme, props?: Props) => Result : (theme: Theme, props: Props) => Result;
type ThemedRecipe<Theme, Props, Result, Composition = unknown> = ThemedRecipeFunction<Theme, Props, Result> & {
  readonly withTheme: (theme: Theme) => KindRecipe$1<Props, Result, Composition>;
};
type ComposedThemedRecipe<Theme, Variants, DefaultedName extends keyof Variants, Result, Slots> = ThemedRecipe<Theme, VariantSelection<Variants, DefaultedName>, Result, RecipeComposition$1<Variants, DefaultedName, NativeStyle, Slots>>;
interface ThemedRecipeCreators<Theme extends object> {
  readonly createStyleRecipe: <const Variants, const Base = never, const Compounds = readonly [], const DefaultedName extends keyof ComposedVariants$1<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe$1<NativeStyle>[] = readonly []>(config: (theme: Theme) => StyleRecipeConfig<Variants, Base, Compounds, DefaultedName, Composed>) => ComposedThemedRecipe<Theme, ComposedVariants$1<Composed, Variants>, NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>, RecipeStyle<Variants, Base, Compounds, Composed>, undefined>;
  readonly createSlotStyleRecipe: <const Slot extends string, const Variants, const Base extends SlotStyles<string> = never, const Compounds = readonly [], const DefaultedName extends keyof ComposedVariants$1<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe$1<NativeStyle>[] = readonly []>(config: (theme: Theme) => SlotStyleRecipeConfig<Slot, Variants, Base, Compounds, DefaultedName, Composed>) => ComposedThemedRecipe<Theme, ComposedVariants$1<Composed, Variants>, NoInfer<DefaultedName> | InheritedDefaultedName<Composed, Variants>, RecipeSlotStyles<Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number], Variants, Base, Compounds, Composed>, readonly (Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number])[]>;
}
declare function createThemedRecipes<Theme extends object>(): ThemedRecipeCreators<Theme>;
//#endregion
//#region src/themed-recipe-of.d.ts
type SlotOfEach<Recipe> = Recipe extends {
  readonly "~composition"?: infer Composition;
} ? Exclude<Composition, undefined> extends {
  readonly slots: readonly (infer Slot extends string)[];
} ? Slot : never : never;
type RecipesOfTheme<Composed extends readonly unknown[]> = { readonly [Index in keyof Composed]: Composed[Index] extends {
  readonly withTheme: (theme: never) => infer Recipe;
} ? Recipe : Composed[Index]; };
type ThemedStyleRecipeOf<Config extends (theme: never) => StyleRecipeConfigParts, Composed extends readonly unknown[] = readonly []> = ComposedThemedRecipe<Parameters<Config>[0], ComposedVariants$1<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>, Extract<DefaultedNameOf<ReturnType<Config>>, keyof ComposedVariants$1<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>> | InheritedDefaultedName<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>, RecipeStyle<ReturnType<Config>["variants"], BaseOf<ReturnType<Config>>, CompoundsOf<ReturnType<Config>>, RecipesOfTheme<Composed>>, undefined>;
type ThemedSlotStyleRecipeOf<Config extends (theme: never) => SlotStyleRecipeConfigParts, Composed extends readonly unknown[] = readonly []> = ComposedThemedRecipe<Parameters<Config>[0], ComposedVariants$1<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>, Extract<DefaultedNameOf<ReturnType<Config>>, keyof ComposedVariants$1<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>> | InheritedDefaultedName<RecipesOfTheme<Composed>, ReturnType<Config>["variants"]>, RecipeSlotStyles<ReturnType<Config>["slots"][number] | SlotOfEach<RecipesOfTheme<Composed>[number]>, ReturnType<Config>["variants"], BaseOf<ReturnType<Config>>, CompoundsOf<ReturnType<Config>>, RecipesOfTheme<Composed>>, readonly (ReturnType<Config>["slots"][number] | SlotOfEach<RecipesOfTheme<Composed>[number]>)[]>;
//#endregion
export { type ComposableKindRecipe, type ComposableKindSlotRecipe, type ComposedSlot, type ComposedVariants, type CompoundCondition, type DefaultVariants, type KindRecipe, type NativeStyle, type RecipeComposition, type RecipeFunction, type SlotStyleCompoundVariant, type SlotStyleRecipe, type SlotStyleRecipeConfig, type SlotStyleRecipeOf, type SlotStyleRecipeVariants, type SlotStyles, type StyleCompoundVariant, type StyleRecipe, type StyleRecipeConfig, type StyleRecipeOf, type StyleRecipeVariants, type ThemedRecipe, type ThemedRecipeCreators, type ThemedSlotStyleRecipeOf, type ThemedStyleRecipeOf, type VariantOption, type VariantSelection, type VariantsOf, createSlotStyleRecipe, createStyleRecipe, createThemedRecipes };
