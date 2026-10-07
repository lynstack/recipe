---
title: Glossary
description: "The terms of @lynstack/recipe, each in a sentence or two with a link: kind, accumulator, initial, reduce, finish, combine, recipe, slot recipe, variant, option, selection, key, cache, compound variant, and composes."
---

## Accumulator

What a kind reduces the values of a selection into while it builds a
result. `initial` returns it, `reduce` adds to it, and `finish` turns it
into the result. See [Recipe kinds](/recipe/recipe/recipe-kinds/).

## Cache

Each recipe's store of results, keyed by selection. A recipe builds the
result of each declared selection once and returns the same result to
later calls with the same variants. See [Caching](/recipe/recipe/caching/).

## `combine`

The optional function of a kind that turns two values into one that
adds what both add. A recipe that composes others calls it when it is
created. See [`combine`](/recipe/recipe/recipe-kinds/#combine).

## Compound variant

A value that applies when several variants have particular options at
the same time. Compound variants apply after the options, in order. See
[Compound variants](/recipe/recipe/variants/#compound-variants).

## `composes`

The property of a config that lists the recipes whose configs a recipe
adds to its own, theirs first. See
[Composing recipes](/recipe/recipe/composing/).

## `finish`

The optional function of a kind that turns the accumulator into the
result, once for each result built. Without it, the result is the
accumulator. See [`finish`](/recipe/recipe/recipe-kinds/#finish).

## `initial`

The function of a kind that returns the accumulator a result starts
from, given the recipe's base, or `undefined` without one. See
[`initial`](/recipe/recipe/recipe-kinds/#initial).

## Key

The integer that a recipe computes from the option of each variant in a
selection. Each declared selection has its own key, under which the
recipe caches its result. See
[How it works](/recipe/recipe/how-it-works/#when-a-recipe-is-called).

## Kind

How a recipe turns the values of a selection into its result: the
functions `initial`, `reduce`, and optionally `combine` and `finish`, and
whether to cache. `createRecipeKind` and `createSlotRecipeKind` take one.
See [Recipe kinds](/recipe/recipe/recipe-kinds/).

## Option

One of the named values of a variant, such as `sm` of `size`. A config
gives the value of each option. See [Variants](/recipe/recipe/variants/).

## Recipe

A function created from a config by the function that `createRecipeKind`
returns. It takes a selection and returns its result, and lists its variants in
`variantKeys`, `variantOptions`, and `defaultVariants`. See
[API reference](/recipe/recipe/api/#kindrecipe).

## `reduce`

The function of a kind that adds one value to the accumulator and
returns the accumulator. It is called with each value that applies to a
selection, in order. See [`reduce`](/recipe/recipe/recipe-kinds/#reduce).

## Selection

The argument of a recipe: the option it chooses for each variant.
Defaults fill the variants it leaves out, and props that are not variants
are ignored. See [Variants](/recipe/recipe/variants/).

## Slot recipe

A recipe for a component made of several elements, its slots. It
returns a frozen object with the result of each slot. See
[Slot recipes](/recipe/recipe/slot-recipes/).

## Variant

A named choice that a recipe's config declares, such as `size`, with
its options. A variant without a default is required, unless it is a
boolean variant, whose only options are `"true"` and `"false"`. See
[Variants](/recipe/recipe/variants/).
