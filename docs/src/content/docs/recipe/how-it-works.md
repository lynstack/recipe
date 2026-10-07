---
title: How the recipe engine works
description: "What the engine does when it creates and calls a recipe: compiling the config, turning a selection into an integer key, the cache, and the order of reduction."
sidebar:
  label: How it works
---

A recipe does its work in two phases: once when it is created, and on each
call. The kind takes part only when a result is built.

## When a recipe is created

The function that `createRecipeKind` returns compiles the config into a
recipe, once. A recipe that composes others first merges their configs
with its own into one (see [Composing recipes](/recipe/recipe/composing/)),
combining the values that several configs give one option with the kind's
`combine`, when it has one, and compiles that:

1. It numbers the options of each variant from 1, in the order they are
   declared. A variant that declares an option named `"true"` or `"false"`
   also declares the other one, without a value.
2. It sets the default of each variant: the option in `defaultVariants`, or
   `"false"` for a boolean variant, whose only options are `"true"` and
   `"false"`.
3. It turns each compound variant into the option numbers it matches. A
   compound variant that names an undeclared variant or option, or lists no
   option for a variant, can never match, and is dropped.
4. It keeps the value of each option and compound variant, by reference.

The recipe reads the config's objects of variants and options only here,
so changing them later does not change the recipe. It keeps the values
themselves, so treat them as immutable.

## When a recipe is called

```txt
selection
  │  select an option for each variant
  ▼
option numbers ──▶ key ──▶ cached? ── yes ──▶ the cached result
                              │
                              no
                              ▼
            initial(base) ─▶ reduce(…, value) for each value ─▶ finish
                              │
                              ▼
                  cache the result under the key, return it
```

1. **Select.** For each variant, the recipe takes the option the selection
   names, or the variant's default when the selection leaves it out or
   passes `undefined`. Numbers and booleans name the option of the same
   string. A selection of `undefined` or `null` is an empty one, and
   properties that are not variants are ignored.
2. **Key.** The option numbers, read together as the digits of one number,
   form the selection's key: every declared selection has its own integer.
3. **Look up.** If the recipe has built the result of this key before, it
   returns that result. A cached call stops here: one lookup per variant
   and one for the cache, with no allocation.
4. **Build.** Otherwise the kind builds the result: `initial` returns the
   accumulator for the recipe's base, `reduce` adds each value that applies
   to the selection, and `finish` turns the accumulator into the result.
5. **Store.** The recipe caches the result under the key and returns it.

A selection with an option that its variant does not declare has no key:
it is built on every call, and that option adds no value. See
[Caching](/recipe/recipe/caching/) for when a recipe caches.

## The order of the values

`reduce` receives the values that apply to a selection in a fixed order,
from the least to the most specific:

1. The value of each variant's selected option, in the order of
   `variants`.
2. The value of each compound variant that matches, in the order of
   `compoundVariants`.

The base is not reduced: it is passed to `initial`. In a recipe that
composes others, the bases are combined into one with the kind's
`combine`; without it, the first base is passed to `initial`, and the
other bases are reduced first. A value that is
`undefined` is skipped, so an option without a value adds nothing.

The order is all the engine decides; what a later value does to an
earlier one is up to the kind. A kind that merges objects with
`Object.assign` lets a later value override the properties of an earlier
one, and a kind that concatenates class names keeps them all, in order.

## Slot recipes

A slot recipe selects, keys, and caches in the same way, and builds the
result of each slot as a recipe would, from that slot's values only. See
[Slot recipes](/recipe/recipe/slot-recipes/).
