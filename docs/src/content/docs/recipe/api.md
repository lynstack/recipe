---
title: API
description: "The reference of createRecipeKind and createSlotRecipeKind: their parameters, the functions they return, the config those take, and the recipes they create."
---

## `createRecipeKind`

```ts
function createRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindRecipe<Value, Result>;
```

Creates a kind of recipe and returns the function that creates recipes of
that kind.

| Parameter      | Description                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| `kind.initial` | `(base: Value \| undefined) => Accumulator`. Returns the accumulator a result starts from.  |
| `kind.reduce`  | `(accumulator: Accumulator, value: Value) => Accumulator`. Adds a value to the accumulator. |
| `kind.finish`  | Optional. `(accumulator: Accumulator) => Result`. Turns the accumulator into the result.    |
| `kind.cache`   | Optional. Whether recipes cache the result of each declared selection. Defaults to `true`.  |

See [Recipe kinds](/recipe/recipe/recipe-kinds/) for when each function is
called and what it may change.

### The function it returns

```ts
type CreateKindRecipe<Value, Result> = (
  config: KindRecipeConfig<Value, Variants, DefaultedName>,
) => KindRecipe<Selection, Result>;
```

Takes a config and returns a recipe. It infers `Variants` and
`DefaultedName` from the config, and `Selection` from them.

| Config property    | Description                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `base`             | Optional. The value passed to `initial`.                                                           |
| `variants`         | For each variant name, the value of each of its options.                                           |
| `compoundVariants` | Optional. A list of `{ variants, value }`: `value` applies when every variant has a listed option. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                             |

See [Variants](/recipe/recipe/variants/).

### The recipe

```ts
type KindRecipe<Selection, Result> = ((selection?: Selection) => Result) & {
  readonly variantKeys: readonly VariantKey<Selection>[];
};
```

Takes a selection of variants and returns its result. The selection is
optional when every variant is. `variantKeys` lists the names of the
variants, in the order of `variants`. See
[How it works](/recipe/recipe/how-it-works/) for what a call does, and
[Caching](/recipe/recipe/caching/) for when it returns a cached result.

## `createSlotRecipeKind`

```ts
function createSlotRecipeKind<Value, Accumulator, Result = Accumulator>(
  kind: RecipeKind<Value, Accumulator, Result>,
): CreateKindSlotRecipe<Value, Result>;
```

Creates a kind of slot recipe from the same kind as `createRecipeKind`,
and returns the function that creates slot recipes of that kind.

### The function it returns

```ts
type CreateKindSlotRecipe<Value, Result> = (
  config: KindSlotRecipeConfig<Slot, Value, Variants, DefaultedName>,
) => KindRecipe<Selection, Readonly<Record<Slot, Result>>>;
```

Takes a config and returns a slot recipe. It infers `Slot` from `slots`,
and `Variants`, `DefaultedName`, and `Selection` as for a recipe.

| Config property    | Description                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `slots`            | The names of the slots, in the order of the result.                                         |
| `base`             | Optional. The base value of each slot, keyed by slot name.                                  |
| `variants`         | For each variant name, the values of each slot for each of its options, keyed by slot name. |
| `compoundVariants` | Optional. A list of `{ variants, value }`, where `value` is keyed by slot name.             |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                      |

### The slot recipe

A slot recipe is a recipe whose result is a frozen object of each slot's
result, keyed by slot name. See [Slot recipes](/recipe/recipe/slot-recipes/).

## Types

Every exported type is listed in [Exports](/recipe/recipe/exports/), and
every export is documented with TSDoc, so your editor shows this reference
as you type.
