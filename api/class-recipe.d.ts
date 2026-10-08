import { Composable, ComposableKindRecipe, ComposableKindRecipe as ComposableKindRecipe$1, ComposableKindSlotRecipe, ComposableKindSlotRecipe as ComposableKindSlotRecipe$1, ComposedDefaultedName, ComposedSlot, ComposedVariants, ComposedVariants as ComposedVariants$1, CompoundCondition, DefaultVariants, KindRecipe, KindVariants, RecipeComposition, RecipeComposition as RecipeComposition$1, RecipeFunction, VariantKey, VariantOption, VariantSelection, VariantSelection as VariantSelection$1, VariantsOf as VariantsOf$1 } from "@lynstack/recipe";
//#region src/cx.d.ts
type ClassValue = ClassArray | ClassDictionary | string | number | boolean | null | undefined;
type ClassDictionary = Readonly<Record<string, unknown>>;
type ClassArray = readonly ClassValue[];
declare function cx(...inputs: ClassArray): string;
//#endregion
//#region src/join.d.ts
type ClassJoin = (...classNames: readonly string[]) => string;
//#endregion
//#region src/types.d.ts
type Simplify<Type> = { [Key in keyof Type]: Type[Key]; };
type InheritedDefaultedName<Composed extends readonly unknown[], Variants> = Extract<ComposedDefaultedName<Composed, never>, keyof ComposedVariants$1<Composed, Variants>>;
type DefaultedNameOf<Config> = Config extends {
  readonly defaultVariants: infer Defaults;
} ? keyof Defaults : never;
type OverrideName = "className" | "classNames";
type VariantKey$1<Props> = VariantKey<Omit<Props, OverrideName>>;
type KindRecipeOf<Props> = KindRecipe<Omit<Props, OverrideName>, unknown>;
type VariantOptions<Props> = KindRecipeOf<Props>["variantOptions"];
type VariantDefaults<Props> = KindRecipeOf<Props>["defaultVariants"];
type VariantsOf<Recipe extends (props: never) => unknown> = OptionsOnly<Omit<VariantsOf$1<Recipe>, OverrideName>>;
type PropsOf<Recipe extends (props: never) => unknown> = Simplify<NonNullable<Parameters<Recipe>[0]>>;
type OptionsOnly<Variants> = { [Name in keyof Variants]: Exclude<Variants[Name], object>; };
type SlotClasses<Slot extends string> = { readonly [Name in Slot]?: string | undefined; };
type SlotClassNames<Slot extends string> = Readonly<Record<Slot, string>>;
type NoUnknownSlots<Variants, Slot extends string, Inherited extends string = never> = { readonly [Name in keyof Variants]: { readonly [Option in keyof Variants[Name]]: string extends keyof Variants[Name][Option] ? unknown : Readonly<Record<Exclude<Exclude<keyof Variants[Name][Option], Slot>, Inherited>, never>>; }; };
type InheritedSlot<Composed extends readonly ComposableKindSlotRecipe$1<string>[]> = NonNullable<Composed[number]["~composition"]>["slots"][number];
type WideSelection<Slot extends string> = Readonly<Record<string, string | SlotClasses<Slot> | undefined>>;
type SlotRecipeProps<Slot extends string, Variants, DefaultedName extends keyof Variants> = Simplify<(string extends keyof Variants ? WideSelection<Slot> : VariantSelection$1<Variants, DefaultedName>) & {
  readonly classNames?: SlotClasses<Slot> | undefined;
}>;
//#endregion
//#region src/recipe.d.ts
type RecipeVariants = KindVariants<string>;
interface CompoundVariant<Variants> {
  readonly variants: CompoundCondition<Variants>;
  readonly className: string;
}
interface RecipeConfig<Variants extends RecipeVariants, DefaultedName extends keyof ComposedVariants$1<Composed, Variants>, Composed extends readonly ComposableKindRecipe$1<string>[] = readonly []> {
  readonly composes?: Composed | undefined;
  readonly base?: string | undefined;
  readonly variants: Variants & {
    readonly className?: never;
    readonly classNames?: never;
  };
  readonly compoundVariants?: readonly CompoundVariant<NoInfer<ComposedVariants$1<Composed, Variants>>>[] | undefined;
  readonly defaultVariants?: DefaultVariants<ComposedVariants$1<Composed, Variants>, DefaultedName> | undefined;
  readonly cache?: boolean | undefined;
}
type RecipeProps<Variants, DefaultedName extends keyof Variants> = Simplify<VariantSelection<Variants, DefaultedName> & {
  readonly className?: string | undefined;
}>;
type Recipe<Props, Composition = unknown> = RecipeFunction<Props, string> & {
  readonly variantKeys: readonly VariantKey$1<Props>[];
  readonly variantOptions: VariantOptions<Props>;
  readonly defaultVariants: VariantDefaults<Props>;
} & Composable<Composition>;
type ComposedRecipe<Variants, DefaultedName extends keyof Variants> = Recipe<RecipeProps<Variants, DefaultedName>, RecipeComposition$1<Variants, DefaultedName, string, undefined>>;
type CreateRecipe = <const Variants extends RecipeVariants, const DefaultedName extends keyof ComposedVariants$1<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe$1<string>[] = readonly []>(config: RecipeConfig<Variants, DefaultedName, Composed>) => ComposedRecipe<ComposedVariants$1<Composed, Variants>, DefaultedName | InheritedDefaultedName<Composed, Variants>>;
declare const createRecipe: CreateRecipe;
declare const cva: CreateRecipe;
//#endregion
//#region src/slot-recipe.d.ts
type SlotRecipeVariants = KindVariants<SlotClasses<string>>;
interface SlotCompoundVariant<Slot extends string, Variants> {
  readonly variants: CompoundCondition<Variants>;
  readonly classNames: SlotClasses<Slot>;
}
interface SlotRecipeConfig<Slot extends string, Variants extends SlotRecipeVariants, DefaultedName extends keyof ComposedVariants$1<Composed, Variants>, Composed extends readonly ComposableKindSlotRecipe$1<string>[] = readonly []> {
  readonly composes?: Composed | undefined;
  readonly slots: readonly Slot[];
  readonly base?: SlotClasses<NoInfer<Slot> | InheritedSlot<Composed>> | undefined;
  readonly variants: Variants & NoUnknownSlots<Variants, NoInfer<Slot>, InheritedSlot<Composed>> & {
    readonly className?: never;
    readonly classNames?: never;
  };
  readonly compoundVariants?: readonly SlotCompoundVariant<NoInfer<Slot> | InheritedSlot<Composed>, NoInfer<ComposedVariants$1<Composed, Variants>>>[] | undefined;
  readonly defaultVariants?: DefaultVariants<ComposedVariants$1<Composed, Variants>, DefaultedName> | undefined;
  readonly cache?: boolean | undefined;
}
type SlotRecipe<Slot extends string, Props, Composition = unknown> = RecipeFunction<Props, SlotClassNames<Slot>> & {
  readonly variantKeys: readonly VariantKey$1<Props>[];
  readonly variantOptions: VariantOptions<Props>;
  readonly defaultVariants: VariantDefaults<Props>;
} & Composable<Composition>;
type CreateSlotRecipe = <const Slot extends string, const Variants extends SlotRecipeVariants, const DefaultedName extends keyof ComposedVariants$1<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe$1<string>[] = readonly []>(config: SlotRecipeConfig<Slot, Variants, DefaultedName, Composed>) => NoInfer<ComposedSlotRecipe<Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number], ComposedVariants$1<Composed, Variants>, DefaultedName | InheritedDefaultedName<Composed, Variants>>>;
type ComposedSlotRecipe<Slot extends string, Variants, DefaultedName extends keyof Variants> = SlotRecipe<Slot, SlotRecipeProps<Slot, Variants, DefaultedName>, RecipeComposition$1<Variants, DefaultedName, string, readonly Slot[]>>;
declare const createSlotRecipe: CreateSlotRecipe;
declare const sva: CreateSlotRecipe;
//#endregion
//#region src/create-recipes.d.ts
interface RecipesOptions {
  readonly join?: ClassJoin | undefined;
  readonly cache?: boolean | undefined;
}
interface Recipes {
  readonly cx: (...inputs: ClassArray) => string;
  readonly createRecipe: CreateRecipe;
  readonly createSlotRecipe: CreateSlotRecipe;
  readonly cva: CreateRecipe;
  readonly sva: CreateSlotRecipe;
}
declare function createRecipes(options?: RecipesOptions): Recipes;
//#endregion
//#region src/recipe-of.d.ts
interface RecipeConfigParts {
  readonly composes?: never;
  readonly variants: RecipeVariants;
  readonly defaultVariants?: object | undefined;
}
type RecipeOf<Config extends RecipeConfigParts, Composed extends readonly ComposableKindRecipe$1<string>[] = readonly []> = ComposedRecipe<ComposedVariants$1<Composed, Config["variants"]>, Extract<DefaultedNameOf<Config>, keyof ComposedVariants$1<Composed, Config["variants"]>> | InheritedDefaultedName<Composed, Config["variants"]>>;
interface SlotRecipeConfigParts {
  readonly composes?: never;
  readonly slots: readonly string[];
  readonly variants: SlotRecipeVariants;
  readonly defaultVariants?: object | undefined;
}
type SlotRecipeOf<Config extends SlotRecipeConfigParts, Composed extends readonly ComposableKindSlotRecipe$1<string>[] = readonly []> = ComposedSlotRecipe<Config["slots"][number] | Exclude<Composed[number]["~composition"], undefined>["slots"][number], ComposedVariants$1<Composed, Config["variants"]>, Extract<DefaultedNameOf<Config>, keyof ComposedVariants$1<Composed, Config["variants"]>> | InheritedDefaultedName<Composed, Config["variants"]>>;
//#endregion
export { type ClassArray, type ClassDictionary, type ClassJoin, type ClassValue, type ComposableKindRecipe, type ComposableKindSlotRecipe, type ComposedSlot, type ComposedVariants, type CompoundCondition, type CompoundVariant, type CreateRecipe, type CreateSlotRecipe, type DefaultVariants, type PropsOf, type Recipe, type RecipeComposition, type RecipeConfig, type RecipeFunction, type RecipeOf, type RecipeProps, type RecipeVariants, type Recipes, type RecipesOptions, type SlotClassNames, type SlotClasses, type SlotCompoundVariant, type SlotRecipe, type SlotRecipeConfig, type SlotRecipeOf, type SlotRecipeProps, type SlotRecipeVariants, type VariantOption, type VariantSelection, type VariantsOf, createRecipe, createRecipes, createSlotRecipe, cva, cx, sva };
