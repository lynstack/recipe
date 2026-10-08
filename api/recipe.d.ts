//#region src/types.d.ts
type Simplify<Type> = { [Key in keyof Type]: Type[Key]; };
type OptionName<Options> = `${Extract<keyof Options, string | number>}`;
type BooleanName = "true" | "false";
type NumberOption<Options> = Extract<keyof Options, number>;
type BooleanOption<Name extends string> = [Extract<Name, BooleanName>] extends [never] ? never : "true" | "false" | boolean;
type BooleanVariantName<Variants> = { [Name in keyof Variants]: [OptionName<Variants[Name]>] extends [never] ? never : [OptionName<Variants[Name]>] extends [BooleanName] ? Name : never; }[keyof Variants];
type VariantOption<Options> = [Options] extends [unknown] ? OptionName<Options> | NumberOption<Options> | BooleanOption<OptionName<Options>> : never;
type VariantSelection<Variants, DefaultedName extends keyof Variants> = Simplify<{ readonly [Name in Exclude<keyof Variants, DefaultedName | BooleanVariantName<Variants>>]: VariantOption<Variants[Name]>; } & { readonly [Name in DefaultedName | BooleanVariantName<Variants>]?: VariantOption<Variants[Name]> | undefined; }>;
type DefaultVariants<Variants, DefaultedName extends keyof Variants> = { readonly [Name in DefaultedName]: VariantOption<NoInfer<Variants>[Name]>; };
type CompoundCondition<Variants> = { readonly [Name in keyof Variants]?: VariantOption<Variants[Name]> | readonly VariantOption<Variants[Name]>[] | undefined; };
type RecipeFunction<Props, Result> = Partial<Props> extends Props ? (props?: Props) => Result : (props: Props) => Result;
type KeyName<Key> = Key extends string ? Key : Key extends number ? `${Key}` : never;
type VariantKey<Selection> = KeyName<keyof Selection>;
type OptionNameOf<Option> = Option extends string | number | boolean ? `${Option}` : string;
type VariantOptions<Selection> = { readonly [Name in keyof Selection as KeyName<Name>]-?: readonly OptionNameOf<Exclude<Selection[Name], undefined>>[]; };
type SelectionDefaults<Selection> = string extends keyof Selection ? Readonly<Record<string, string>> : { readonly [Name in keyof Selection as Pick<Selection, Name> extends Required<Pick<Selection, Name>> ? never : KeyName<Name>]-?: OptionNameOf<Exclude<Selection[Name], undefined>>; };
type VariantsOf<Recipe extends (props: never) => unknown> = Simplify<NonNullable<Parameters<Recipe>[0]>>;
interface RecipeKind<Value, Accumulator, Result> {
  readonly initial: (base: Value | undefined) => Accumulator;
  readonly reduce: (accumulator: Accumulator, value: Value) => Accumulator;
  readonly combine?: ((first: Value, second: Value) => Value) | undefined;
  readonly finish?: ((accumulator: Accumulator) => Result) | undefined;
  readonly cache?: boolean | undefined;
}
//#endregion
//#region src/unknown-slots.d.ts
type NoUnknownSlots<Variants, Slot extends string> = NoUnknownComposedSlots<Variants, Slot, never>;
interface UnknownSlot<Name, Slot extends string> {
  readonly "~unknownSlot": Name;
  readonly "~slots": Slot;
}
type NoUnknownComposedSlots<Variants, Slot extends string, InheritedSlot extends string> = { readonly [Name in keyof Variants]: { readonly [Option in keyof Variants[Name]]: string extends keyof Variants[Name][Option] ? unknown : { readonly [Unknown in Exclude<Exclude<keyof Variants[Name][Option], Slot>, InheritedSlot>]?: UnknownSlot<Unknown, Slot | InheritedSlot>; }; }; };
//#endregion
//#region src/slot-recipe-kind.d.ts
type SlotValues<Slot extends string, Value> = { readonly [Name in Slot]?: Value | undefined; };
type KindSlotVariants<Value> = KindVariants<SlotValues<string, Value>>;
interface KindSlotCompoundVariant<Variants, Slot extends string, Value> {
  readonly variants: KindCompoundCondition<Variants>;
  readonly value: SlotValues<Slot, Value>;
}
interface KindSlotRecipeConfig<Slot extends string, Value, Variants extends KindSlotVariants<Value>, DefaultedName extends keyof ComposedVariants<Composed, Variants>, Composed extends readonly ComposableKindSlotRecipe<Value>[] = readonly []> {
  readonly composes?: Composed | undefined;
  readonly slots: readonly Slot[];
  readonly base?: SlotValues<NoInfer<Slot> | InheritedSlot<Composed>, Value> | undefined;
  readonly variants: Variants & SlotVariantsCheck<Variants, NoInfer<Slot>, InheritedSlot<Composed>, Value>;
  readonly compoundVariants?: readonly KindSlotCompoundVariant<NoInfer<ComposedVariants<Composed, Variants>>, NoInfer<Slot> | InheritedSlot<Composed>, Value>[] | undefined;
  readonly defaultVariants?: WrittenKindDefaults<ComposedVariants<Composed, Variants>, DefaultedName> | undefined;
  readonly cache?: boolean | undefined;
}
type CreateKindSlotRecipe<Value, Result> = <const Slot extends string, const Variants extends KindSlotVariants<Value>, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindSlotRecipe<Value>[] = readonly []>(config: KindSlotRecipeConfig<Slot, Value, Variants, DefaultedName, Composed>) => ComposedKindRecipe<ComposedVariants<Composed, Variants>, DefaultedName | InheritedDefaultedName<Composed, Variants>, Value, Readonly<Record<Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number], Result>>, readonly (Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number])[]>;
declare function createSlotRecipeKind<Value, Accumulator, Result = Accumulator>(kind: RecipeKind<Value, Accumulator, Result>): CreateKindSlotRecipe<Value, Result>;
//#endregion
//#region src/kind-selection.d.ts
type AnySelection = Readonly<Record<string, unknown>>;
type KindSelection<Variants, DefaultedName extends keyof Variants> = string extends keyof Variants ? AnySelection : VariantSelection<Variants, DefaultedName>;
type KindCompoundCondition<Variants> = string extends keyof Variants ? AnySelection : CompoundCondition<Variants>;
type KindDefaultVariants<Variants, DefaultedName extends keyof Variants> = string extends keyof Variants ? AnySelection : DefaultVariants<Variants, DefaultedName>;
type WrittenKindDefaults<Variants, DefaultedName extends keyof Variants> = [DefaultedName] extends [never] ? { readonly [Name in keyof Variants]?: VariantOption<NoInfer<Variants>[Name]>; } : KindDefaultVariants<Variants, DefaultedName>;
type SlotVariantsCheck<Variants, Slot extends string, InheritedSlot extends string, Value> = NoUnknownComposedSlots<Variants, Slot, InheritedSlot> & { readonly [Name in keyof Variants]: { readonly [Option in keyof Variants[Name]]: string extends keyof Variants[Name][Option] ? unknown : SlotValues<Exclude<Slot | InheritedSlot, keyof typeof Object.prototype>, Value>; }; };
//#endregion
//#region src/composition.d.ts
interface RecipeComposition<Variants, DefaultedName, Value, Slots> {
  readonly variants: Variants;
  readonly defaultedName: DefaultedName;
  readonly value: Value;
  readonly slots: Slots;
}
type Composable<Composition> = unknown extends Composition ? unknown : {
  readonly "~composition"?: Composition | undefined;
};
type CompositionOf<Recipe> = Recipe extends {
  readonly "~composition"?: infer Composition;
} ? Exclude<Composition, undefined> : never;
type ComposedPart<Composed extends readonly unknown[], Part extends keyof RecipeComposition<unknown, unknown, unknown, unknown>> = ValueOfEach<CompositionOf<Composed[number]>, Part>;
type KeyOfEach<Union> = Union extends unknown ? keyof Union : never;
type ValueOfEach<Union, Key extends PropertyKey> = Union extends unknown ? Key extends keyof Union ? Union[Key] : never : never;
type MergeEach<Union> = { readonly [Key in KeyOfEach<Union>]: ValueOfEach<Union, Key>; };
type ComposedVariants<Composed extends readonly unknown[], Variants> = [Composed[number]] extends [never] ? Variants : MergeVariants<ComposedPart<Composed, "variants"> | Variants>;
type MergeVariants<Union> = { readonly [Name in KeyOfEach<Union>]: MergeEach<ValueOfEach<Union, Name>>; };
type ComposedDefaultedName<Composed extends readonly unknown[], DefaultedName> = DefaultedName | ComposedPart<Composed, "defaultedName">;
type InheritedDefaultedName<Composed extends readonly unknown[], Variants> = Extract<ComposedPart<Composed, "defaultedName">, keyof ComposedVariants<Composed, Variants>>;
type ComposedSlot<Composed extends readonly unknown[], Slot extends string> = Slot | SlotOf<ComposedPart<Composed, "slots">>;
type InheritedSlot<Composed extends readonly ComposableKindSlotRecipe<unknown>[]> = NonNullable<Composed[number]["~composition"]>["slots"][number];
type SlotOf<Slots> = Slots extends readonly (infer Slot extends string)[] ? Slot : never;
type ComposableKindRecipe<Value> = Composable<RecipeComposition<object, PropertyKey, Value, undefined>>;
type ComposableKindSlotRecipe<Value> = Composable<RecipeComposition<object, PropertyKey, Value, readonly string[]>>;
type ComposedKindRecipe<Variants, DefaultedName extends keyof Variants, Value, Result, Slots> = KindRecipe<KindSelection<Variants, DefaultedName>, Result, RecipeComposition<Variants, DefaultedName, Value, Slots>>;
//#endregion
//#region src/variants.d.ts
type LooseVariants<Value> = Readonly<Record<string, Readonly<Record<string, Value>>>>;
//#endregion
//#region src/recipe-kind.d.ts
type KindVariants<Value> = LooseVariants<Value>;
interface KindCompoundVariant<Variants, Value> {
  readonly variants: KindCompoundCondition<Variants>;
  readonly value: Value;
}
interface KindRecipeConfig<Value, Variants extends KindVariants<Value>, DefaultedName extends keyof ComposedVariants<Composed, Variants>, Composed extends readonly ComposableKindRecipe<Value>[] = readonly []> {
  readonly composes?: Composed | undefined;
  readonly base?: Value | undefined;
  readonly variants: Variants;
  readonly compoundVariants?: readonly KindCompoundVariant<NoInfer<ComposedVariants<Composed, Variants>>, Value>[] | undefined;
  readonly defaultVariants?: WrittenKindDefaults<ComposedVariants<Composed, Variants>, DefaultedName> | undefined;
  readonly cache?: boolean | undefined;
}
type KindRecipe<Selection, Result, Composition = unknown> = RecipeFunction<Selection, Result> & {
  readonly variantKeys: readonly VariantKey<Selection>[];
  readonly variantOptions: VariantOptions<Selection>;
  readonly defaultVariants: SelectionDefaults<Selection>;
} & Composable<Composition>;
type CreateKindRecipe<Value, Result> = <const Variants extends KindVariants<Value>, const DefaultedName extends keyof ComposedVariants<Composed, Variants> = never, const Composed extends readonly ComposableKindRecipe<Value>[] = readonly []>(config: KindRecipeConfig<Value, Variants, DefaultedName, Composed>) => ComposedKindRecipe<ComposedVariants<Composed, Variants>, DefaultedName | InheritedDefaultedName<Composed, Variants>, Value, Result, undefined>;
declare function createRecipeKind<Value, Accumulator, Result = Accumulator>(kind: RecipeKind<Value, Accumulator, Result>): CreateKindRecipe<Value, Result>;
//#endregion
//#region src/recipe-of.d.ts
type DefaultedNameOf<Config, Composed extends readonly unknown[]> = Config extends {
  readonly defaultVariants: infer Defaults;
  readonly variants: infer Variants;
} ? Extract<keyof Defaults, keyof ComposedVariants<Composed, Variants>> : never;
interface KindRecipeConfigParts<Value> {
  readonly composes?: never;
  readonly variants: KindVariants<Value>;
  readonly defaultVariants?: object | undefined;
}
type KindRecipeOf<Value, Result, Config extends KindRecipeConfigParts<Value>, Composed extends readonly ComposableKindRecipe<Value>[] = readonly []> = ComposedKindRecipe<ComposedVariants<Composed, Config["variants"]>, DefaultedNameOf<Config, Composed> | InheritedDefaultedName<Composed, Config["variants"]>, Value, Result, undefined>;
interface KindSlotRecipeConfigParts<Value> {
  readonly composes?: never;
  readonly slots: readonly string[];
  readonly variants: KindSlotVariants<Value>;
  readonly defaultVariants?: object | undefined;
}
type KindSlotRecipeOf<Value, Result, Config extends KindSlotRecipeConfigParts<Value>, Composed extends readonly ComposableKindSlotRecipe<Value>[] = readonly []> = ComposedKindRecipe<ComposedVariants<Composed, Config["variants"]>, DefaultedNameOf<Config, Composed> | InheritedDefaultedName<Composed, Config["variants"]>, Value, Readonly<Record<Config["slots"][number] | Exclude<Composed[number]["~composition"], undefined>["slots"][number], Result>>, readonly (Config["slots"][number] | Exclude<Composed[number]["~composition"], undefined>["slots"][number])[]>;
//#endregion
export { type Composable, type ComposableKindRecipe, type ComposableKindSlotRecipe, type ComposedDefaultedName, type ComposedSlot, type ComposedVariants, type CompoundCondition, type CreateKindRecipe, type CreateKindSlotRecipe, type DefaultVariants, type KindCompoundVariant, type KindRecipe, type KindRecipeConfig, type KindRecipeOf, type KindSelection, type KindSlotCompoundVariant, type KindSlotRecipeConfig, type KindSlotRecipeOf, type KindSlotVariants, type KindVariants, type NoUnknownSlots, type RecipeComposition, type RecipeFunction, type RecipeKind, type SlotValues, type VariantKey, type VariantOption, type VariantSelection, type VariantsOf, createRecipeKind, createSlotRecipeKind };
