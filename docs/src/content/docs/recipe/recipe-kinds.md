---
title: Recipe kinds
description: "Define a kind of recipe with createRecipeKind: how it starts from a base, reduces the values of a selection, finishes the result, and caches it."
---

`createRecipeKind` takes the functions that turn the values of a selection
into a recipe's result, and whether its recipes cache that result. It
returns the function that creates recipes of that kind:

- `initial` returns the accumulator to start from, given the recipe's
  `base`, or `undefined` when it has none. It is called for each result a
  recipe builds, so it can return a new object each time.
- `reduce` adds a value to the accumulator and returns the accumulator. It
  is called with the value of each variant's selected option, in the order
  of `variants`, then with the value of each matching compound variant, in
  the order of `compoundVariants`.
- `finish`, optional, turns the accumulator into the result, for example
  by freezing it. Without it, the result is the accumulator.
- `cache`, optional, is whether a recipe builds the result of each declared
  selection once and returns it again for the same selection. It defaults
  to `true`; see [Cache](/recipe/recipe/recipes/#cache).

The type of a value comes from the `value` parameter of `reduce` or the
`base` parameter of `initial`, so annotate one of them. Every recipe of
the kind takes values of that type.
