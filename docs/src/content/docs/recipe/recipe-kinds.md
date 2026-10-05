---
title: Recipe kinds
description: "The contract of a recipe kind: what initial, reduce, finish, and cache do, when the engine calls them, what they may change, and how they set the types of a kind's recipes."
---

A kind is how a recipe turns the values of a selection into its result.
`createRecipeKind` and `createSlotRecipeKind` take the same kind:

```ts
interface RecipeKind<Value, Accumulator, Result> {
  initial: (base: Value | undefined) => Accumulator;
  reduce: (accumulator: Accumulator, value: Value) => Accumulator;
  finish?: (accumulator: Accumulator) => Result;
  cache?: boolean;
}
```

- **`Value`** is what a config gives: the base, the value of each option,
  and the value of each compound variant.
- **`Accumulator`** is what the values are reduced into while a result is
  built.
- **`Result`** is what a recipe returns. Without `finish`, it is the
  accumulator.

## `initial`

```ts
initial: (base: Value | undefined) => Accumulator;
```

Returns the accumulator a result starts from, given the recipe's `base`,
or `undefined` when the recipe has none.

- It is called once for each result a recipe builds, and once for each
  slot of each result a slot recipe builds.
- It may return a new object each time, which `reduce` can then change in
  place.
- It must not change `base`, which every result shares.

## `reduce`

```ts
reduce: (accumulator: Accumulator, value: Value) => Accumulator;
```

Adds one value to the accumulator and returns the accumulator: the same
one, changed, or a new one.

- It is called with each value that applies to the selection, in
  [order of precedence](/recipe/recipe/how-it-works/#the-order-of-the-values),
  and never with `undefined`.
- It may be called no times at all, when no option or compound variant
  adds a value.
- It must not change `value`, which every result shares.

## `finish`

```ts
finish?: (accumulator: Accumulator) => Result;
```

Turns the accumulator into the result, once for each result built. Use it
to freeze the result, to convert the accumulator into another type, or to
do work that needs every value at once, such as resolving conflicts
between them. Without it, the result is the accumulator.

## `cache`

```ts
cache?: boolean;
```

Whether a recipe builds the result of each declared selection once and
returns it again for the same selection. It defaults to `true`. See
[Caching](/recipe/recipe/caching/).

## The rules of a kind

- **Be pure.** With the cache, a result is built once and returned to
  every later call with the same variants, so a kind that reads anything
  besides its arguments, such as the current theme, returns what it read
  the first time.
- **Never change what you receive from the config.** The base and the
  values are shared by every result. Change only the accumulator that
  `initial` returned for this result.
- **Never share a result that can change.** A cached result is shared by
  every call with the same variants; freeze an object result in `finish`.

## Types

A kind's types are inferred from its functions:

- `Value` comes from the `value` parameter of `reduce` or the `base`
  parameter of `initial`, so annotate one of them. Without either, values
  are `unknown` and a config accepts anything.
- `Accumulator` comes from the return type of `initial`.
- `Result` comes from the return type of `finish`.

Every recipe of the kind then checks its config against `Value`: a base,
option, or compound value of another type is a type error.

## Examples

Class names, concatenated as they are added:

```ts
import { createRecipeKind } from "@lynstack/recipe";

const classRecipe = createRecipeKind({
  initial: (base?: string): string => base ?? "",
  reduce: (className, classes: string) =>
    className === "" ? classes : `${className} ${classes}`,
});

const badge = classRecipe({
  base: "badge",
  variants: { tone: { info: "badge-info", danger: "badge-danger" } },
});

badge({ tone: "danger" }); // => "badge badge-danger"
```

Style objects, copied once and frozen, as in the
[Quick start](/recipe/recipe/quick-start/):

```ts
type Style = Readonly<Record<string, string | number>>;
type MutableStyle = Record<string, string | number>;

const styleRecipe = createRecipeKind({
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style) => Object.assign(style, value),
  finish: (style: MutableStyle): Style => Object.freeze(style),
});
```

[Designing a kind](/recipe/recipe/designing-a-kind/) compares these and
other designs.
