---
title: API reference
description: "Every export of @lynstack/recipe, grouped by role: createRecipeKind and createSlotRecipeKind with their real signatures, the types an app uses, the types a library builds on, and the types of composition and slots."
sidebar:
  label: API
---

`@lynstack/recipe` exports two functions and the types around them. Every
export is documented with TSDoc, so your editor shows this reference as
you type. The signatures below are those of the package's declarations.

## Core functions

### `createRecipeKind`

```ts
function createRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindRecipe<Value, Result>;
```

Creates a kind of recipe and returns the function that creates recipes of
that kind. It infers `Value` from the `value` parameter of `reduce` or the
`base` parameter of `initial`, `Accumulator` from `initial`, and `Result`
from `finish`.

| Parameter      | Description                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `kind.initial` | `(base: Value \| undefined) => Accumulator`. Returns the accumulator a result starts from.                                   |
| `kind.reduce`  | `(accumulator: Accumulator, value: Value) => Accumulator`. Adds a value to the accumulator.                                  |
| `kind.combine` | Optional. `(first: Value, second: Value) => Value`. Combines two values into one, for recipes that compose others.           |
| `kind.finish`  | Optional. `(accumulator: Accumulator) => Result`. Turns the accumulator into the result.                                     |
| `kind.cache`   | Optional. Whether recipes cache the result of each declared selection, unless their config sets `cache`. Defaults to `true`. |

See [Recipe kinds](/recipe/recipe/recipe-kinds/) for when each function is
called and what it may change.

### The function it returns: `CreateKindRecipe`

```ts
type CreateKindRecipe<Value, Result> = <
  const Variants extends KindVariants<Value>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<Value>[] = readonly [],
>(
  config: KindRecipeConfig<Value, Variants, DefaultedName, Composed>,
) => ComposedKindRecipe<
  ComposedVariants<Composed, Variants>,
  DefaultedName | InheritedDefaultedName<Composed, Variants>,
  Value,
  Result,
  undefined
>;
```

Takes a config and returns a recipe. Its `const` type parameters infer
the option names of each variant as literal types:

- `Variants`, the `variants` of the config.
- `DefaultedName`, the names of the variants that `defaultVariants`
  gives a default.
- `Composed`, the recipes that `composes` lists, as a tuple.

`ComposedKindRecipe` and `InheritedDefaultedName` are not exported.
`InheritedDefaultedName` is the names of the variants that the recipes of
`composes` give a default. `ComposedKindRecipe` is a
[`KindRecipe`](#kindrecipe) whose selection is the
[`KindSelection`](#kindselection) of the variants of the config and of the
recipes it composes, and whose `Composition` is a
[`RecipeComposition`](#recipecomposition) of those variants. When the
variant names are not literal types, such as in a function that passes on
a config it received, the recipe accepts any selection.

#### `KindRecipeConfig`

```ts
interface KindRecipeConfig<
  Value,
  Variants extends KindVariants<Value>,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindRecipe<Value>[] = readonly [],
> {
  readonly composes?: Composed | undefined;
  readonly base?: Value | undefined;
  readonly variants: Variants;
  readonly compoundVariants?:
    | readonly KindCompoundVariant<
        NoInfer<ComposedVariants<Composed, Variants>>,
        Value
      >[]
    | undefined;
  readonly defaultVariants?:
    | KindDefaultVariants<ComposedVariants<Composed, Variants>, DefaultedName>
    | undefined;
  readonly cache?: boolean | undefined;
}
```

`KindDefaultVariants`, which is not exported, is
[`DefaultVariants`](#types-for-library-authors), or any default variants
when the variant names are not literal types. The `variants` of a
[`KindCompoundVariant`](#types-for-library-authors) are a
[`CompoundCondition`](#types-for-library-authors) in the same way.

| Property           | Description                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `composes`         | Optional. Recipes whose configs the recipe adds to its own, in order.                              |
| `base`             | Optional. The value passed to `initial`.                                                           |
| `variants`         | For each variant name, the value of each of its options.                                           |
| `compoundVariants` | Optional. A list of `{ variants, value }`: `value` applies when every variant has a listed option. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                             |
| `cache`            | Optional. Whether the recipe caches its results. Defaults to the kind's `cache`.                   |

See
[Variants](/recipe/recipe/variants/), and
[Composing recipes](/recipe/recipe/composing/) for `composes`.

#### `KindRecipe`

```ts
type KindRecipe<Selection, Result, Composition = unknown> = RecipeFunction<
  Selection,
  Result
> & {
  readonly variantKeys: readonly VariantKey<Selection>[];
  readonly variantOptions: VariantOptions<Selection>;
  readonly defaultVariants: SelectionDefaults<Selection>;
} & Composable<Composition>;
```

A recipe takes a selection of variants and returns its result. Its
argument is optional when every variant is, and required when any variant
is required (see [`RecipeFunction`](#recipefunction)). At runtime,
`undefined` and `null` are an empty selection.

- `variantKeys` lists the names of the variants, in the order of
  `variants`, after those of the recipes it composes.
- `variantOptions` lists the names of the options of each variant, as
  strings, in the order the recipe numbers them. Its type,
  `VariantOptions`, which is not exported, gives each variant a list of
  its option names as literal types.
- `defaultVariants` gives the option, as a string, that each variant a
  selection may leave out uses then. Its type, `SelectionDefaults`, which
  is not exported, has a key for each such variant.
- `Composition` is what the recipe passes on to the recipes that compose
  it, which its type carries under a `~composition` property that exists
  in the type only.

The three lists are frozen; see
[Listing the variants](/recipe/recipe/variants/#listing-the-variants).
When the variant names are not literal types, `variantOptions` is
`Readonly<Record<string, readonly string[]>>` and `defaultVariants` is
`Readonly<Record<string, string>>`. See
[How it works](/recipe/recipe/how-it-works/) for what a call does, and
[Caching](/recipe/recipe/caching/) for when it returns a cached result.

### `createSlotRecipeKind`

```ts
function createSlotRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindSlotRecipe<Value, Result>;
```

Creates a kind of slot recipe from the same kind as `createRecipeKind`,
and returns the function that creates slot recipes of that kind.

### The function it returns: `CreateKindSlotRecipe`

```ts
type CreateKindSlotRecipe<Value, Result> = <
  const Slot extends string,
  const Variants extends KindSlotVariants<Value>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<Value>[] =
    readonly [],
>(
  config: KindSlotRecipeConfig<Slot, Value, Variants, DefaultedName, Composed>,
) => ComposedKindRecipe<
  ComposedVariants<Composed, Variants>,
  DefaultedName | InheritedDefaultedName<Composed, Variants>,
  Value,
  Readonly<
    Record<
      | Slot
      | Exclude<Composed[number]["~composition"], undefined>["slots"][number],
      Result
    >
  >,
  readonly (
    Slot | Exclude<Composed[number]["~composition"], undefined>["slots"][number]
  )[]
>;
```

Takes a config and returns a slot recipe: a [`KindRecipe`](#kindrecipe)
whose result is a frozen object of each slot's result, keyed by slot name.
It infers `Slot` from `slots`, and the slots of the slot recipes it
composes are added to it. Its `Composition` lists the slots too.

The slots are the same as
[`ComposedSlot<Composed, Slot>`](#composition), written out: a
declaration file prints `ComposedSlot` with the type of each recipe that
`Composed` lists, which holds the types of the recipes that recipe
composes, so a recipe several levels of composition deep would take a
declaration many times the size of its config.

| Config property    | Description                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `composes`         | Optional. Slot recipes whose configs the slot recipe adds to its own, in order.             |
| `slots`            | The names of the slots, in the order of the result.                                         |
| `base`             | Optional. The base value of each slot, keyed by slot name.                                  |
| `variants`         | For each variant name, the values of each slot for each of its options, keyed by slot name. |
| `compoundVariants` | Optional. A list of `{ variants, value }`, where `value` is keyed by slot name.             |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                      |
| `cache`            | Optional. Whether the recipe caches its results. Defaults to the kind's `cache`.            |

A value for a slot that `slots` does not name is a type error. See
[Slot recipes](/recipe/recipe/slot-recipes/).

A slot named after a property that every object has, such as `toString`
or `constructor`, is not supported: the types reject an object of slot
values that leaves it out, since every object has that property with
another type.

### A config with the wrong shape

The types reject a config with the wrong shape. A config from untyped
code, such as JavaScript, is checked when the recipe is created, and the
function throws a `TypeError` that names the part that is wrong:

- A config without `variants`, or whose `variants` is not an object. Use
  `variants: {}` for a recipe without variants.
- A variant whose options are not an object.
- A `compoundVariants` that is not an array, or a compound variant without
  `variants`.
- In a slot recipe, a config without `slots`, or a `base`, an option, or a
  compound variant's `value` that is not an object of the value of each
  slot.

The check runs once, when the recipe is created, so it costs nothing on
a call.

### Names that a config does not declare

A default, a compound variant, or a slot's value can name a variant, an
option, or a slot that no config of the recipe declares. TypeScript
rejects such a name in a config written in the call, but not every such
name in a config declared before it (see
[A config declared before the call](/recipe/recipe/typescript/#a-config-declared-before-the-call)),
and not in untyped code. The recipe then leaves the name out:

- A default of an undeclared variant, or an option that its variant does
  not declare, is ignored.
- A compound variant's condition on an undeclared variant never matches.
  An undeclared option in its list is ignored, so a condition left
  without a declared option never matches either.
- In a slot recipe, a value for a slot that no config lists in `slots` is
  ignored.

When the recipe is created, it checks these names against its own config
and those of the recipes it composes, and warns about the ones it does
not declare with `console.warn`, in one message:

```text
A recipe's config names variants, options, or slots that it does not declare, so they add nothing:
- Compound variant 0 names the variant "tonne".
- `base` gives a value to the slot "lable".
```

A recipe created again from a config with the same mistakes, such as a
themed recipe for each theme, does not repeat the warning. Like the
check of the shape, it runs only when the recipe is created.

## Types for apps

An app that uses recipes names their variants with these:

| Export       | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| `VariantsOf` | The variants a recipe accepts, to type the props of a component built on it.     |
| `VariantKey` | The name of each variant in a selection, as a string, as `variantKeys` lists it. |

See [Typing recipes](/recipe/recipe/typescript/#typing-component-props).

## Types for library authors

A library with its own config shape builds its types on these, as
[Building a library](/recipe/recipe/building-a-library/#type-the-librarys-config)
shows:

| Export                | Description                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `RecipeKind`          | How a kind of recipe turns the values of a selection into its result.                                               |
| `CreateKindRecipe`    | The function that `createRecipeKind` returns, which creates recipes of one kind.                                    |
| `KindRecipeConfig`    | The configuration of a recipe of a kind.                                                                            |
| `KindRecipe`          | A recipe of a kind, with its variants, options, and defaults in `variantKeys`, `variantOptions`, `defaultVariants`. |
| `KindVariants`        | The variants of a recipe's config: for each variant name, the value of each of its options.                         |
| `KindCompoundVariant` | A value added when several variants have particular options at the same time.                                       |
| `VariantSelection`    | The variants a selection names, with the optional ones marked optional.                                             |
| `KindSelection`       | The selection a recipe of a kind accepts: its `VariantSelection`, or any selection for unknown variant names.       |
| `KindRecipeOf`        | The type of the recipe of a config declared `as const`, to annotate an exported recipe.                             |
| `KindSlotRecipeOf`    | The type of the slot recipe of a config declared `as const`, to annotate an exported slot recipe.                   |
| `VariantOption`       | The values accepted for one variant.                                                                                |
| `DefaultVariants`     | The option each defaulted variant uses when a selection leaves it out.                                              |
| `CompoundCondition`   | The condition of a compound variant: the options it matches for each variant it names.                              |
| `RecipeFunction`      | A function that takes a selection, whose argument is optional when every variant is.                                |

### `VariantSelection`

`VariantSelection<Variants, DefaultedName>` is the selection of a recipe
whose variants are `Variants`. Each variant in `DefaultedName`, and each
boolean variant, is optional; every other variant is required. Each
accepts its `VariantOption`: the names of its options as strings, a
number for a name that is a number, and `true` and `false` for a variant
that declares `"true"` or `"false"`.

### `KindSelection`

`KindSelection<Variants, DefaultedName>` is the selection that a recipe of
a kind accepts: the `VariantSelection` of its variants, or any selection
when the variant names are not literal types. A function generic over a
config annotates the recipe it returns with it, as
[A function generic over a config](/recipe/recipe/typescript/#a-function-generic-over-a-config)
shows.

### `KindRecipeOf` and `KindSlotRecipeOf`

`KindRecipeOf<Value, Result, Config, Composed>` is the type of the recipe
that a `CreateKindRecipe<Value, Result>` returns for a config, and
`KindSlotRecipeOf<Value, Result, Config, Composed>` that of the slot
recipe that a `CreateKindSlotRecipe<Value, Result>` returns. They
annotate an exported recipe where `isolatedDeclarations` cannot infer the
type of a call, as
[Exporting recipes](/recipe/recipe/typescript/#exporting-recipes-with-isolateddeclarations)
shows.

| Parameter  | What it is                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------- |
| `Value`    | The value of an option, or of a slot, as in `CreateKindRecipe`.                              |
| `Result`   | What a recipe of the kind returns, or returns for each slot.                                 |
| `Config`   | The type of a config declared `as const`, without `composes`, which is a type error.         |
| `Composed` | The types of the recipes it composes, in the order of `composes`. Defaults to `readonly []`. |

They apply to a config whose type is known, not in a function generic
over the whole config, which is generic over its variants instead; see
[Exporting recipes](/recipe/recipe/typescript/#exporting-recipes-with-isolateddeclarations).

### `RecipeFunction`

```ts
type RecipeFunction<Props, Result> =
  Partial<Props> extends Props
    ? (props?: Props) => Result
    : (props: Props) => Result;
```

A function whose argument is optional when every property of `Props` is,
and required otherwise.

:::tip[Types to re-export to your users]
Users of a library built on the engine should not need to install the
engine to type their code. Re-export the types they name:

- `VariantSelection`, `VariantOption`, `DefaultVariants`,
  `CompoundCondition`, and `RecipeFunction`, as they are.
- Your own `VariantsOf`, and `VariantKey` if your users need it, when
  your recipes take props besides their variants, such as a `className`
  or a `style`, so that these types leave them out. Otherwise re-export
  the engine's.
- When your recipes compose others, `RecipeComposition`, which the type
  of every recipe that can be composed names. An app installed with pnpm
  cannot import the engine, so without it, a module of the app that
  exports a recipe fails to emit its declarations. Re-export also the
  types that a user's own helper names: `ComposableKindRecipe` and
  `ComposedVariants`, and for slot recipes `ComposableKindSlotRecipe` and
  `ComposedSlot`.
- A type of the recipe of a config, such as `RecipeOf` of
  `@lynstack/class-recipe`, for users who export recipes with
  `isolatedDeclarations`. When your recipes are the engine's, re-export
  `KindRecipeOf` and `KindSlotRecipeOf`, or alias them with your kind's
  value and result.

`@lynstack/class-recipe` re-exports the first five and the types of
composition, and defines its own `VariantsOf`, which leaves out
`className` and `classNames`.
:::

## Composition

A library whose recipes other recipes can compose marks their types with
these, as
[Making library recipes composable](/recipe/recipe/composable-libraries/)
shows:

| Export                     | Description                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `RecipeComposition`        | What a recipe passes on, in its type only, to the recipes that compose it.                   |
| `Composable`               | Marks the type of a recipe that other recipes can compose, with its `RecipeComposition`.     |
| `ComposableKindRecipe`     | A recipe that a recipe whose values are of a given type can compose.                         |
| `ComposableKindSlotRecipe` | A slot recipe that a slot recipe whose values are of a given type can compose.               |
| `ComposedVariants`         | The variants of a recipe that composes others: theirs and its own, with the options of each. |
| `ComposedDefaultedName`    | The names of the variants with a default in a recipe that composes others.                   |
| `ComposedSlot`             | The slots of a slot recipe that composes others.                                             |

### `RecipeComposition`

```ts
interface RecipeComposition<Variants, DefaultedName, Value, Slots> {
  readonly variants: Variants;
  readonly defaultedName: DefaultedName;
  readonly value: Value;
  readonly slots: Slots;
}
```

`Variants` are the variants of the recipe, `DefaultedName` the names of
those with a default, `Value` the type of its values, and `Slots` the list
of its slots, or `undefined` for a recipe without slots.

## Slots

The config of a slot recipe has its own types:

| Export                    | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `CreateKindSlotRecipe`    | The function that `createSlotRecipeKind` returns, which creates slot recipes of one kind.                       |
| `KindSlotRecipeConfig`    | The configuration of a slot recipe of a kind.                                                                   |
| `KindSlotVariants`        | The variants of a slot recipe's config: for each variant name, the values of each slot for each of its options. |
| `KindSlotCompoundVariant` | Values added to some slots when several variants have particular options at the same time.                      |
| `SlotValues`              | Values for some of a slot recipe's slots, keyed by slot name.                                                   |
| `NoUnknownSlots`          | Rejects a value for a slot that a list of slot names does not name.                                             |

`KindSlotRecipeConfig` rejects a value for a slot that `slots` does not
name with `NoUnknownSlots`. A library that wraps slot recipes intersects
its own variants with it to do the same; see
[Building a library](/recipe/recipe/building-a-library/#slot-recipes).
