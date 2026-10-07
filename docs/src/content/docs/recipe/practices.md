---
title: recipe best practices
description: "A checklist for code built on @lynstack/recipe: pure kinds, frozen results, recipes created once, overrides around the recipe, and values where they apply."
sidebar:
  label: Best practices
---

Each practice links to the page that explains it.

## Kinds

- **Keep a kind pure.** A cached result is built once per selection, so a
  kind that reads anything besides its arguments returns what it read the
  first time. See [The rules of a kind](/recipe/recipe/recipe-kinds/#the-rules-of-a-kind).
- **Annotate the `value` parameter of `reduce`, or the `base` parameter of
  `initial`.** It sets the type of every value of the kind. Without it,
  values are `unknown` and a config accepts anything.
- **Return a new accumulator from `initial`, and change only that.**
  `reduce` may then change it in place, which costs one copy per result
  instead of one per value. Never change `base` or a value, which every
  result shares. See
  [Designing a kind](/recipe/recipe/designing-a-kind/#change-the-accumulator-in-place).
- **Freeze an object result in `finish`.** A cached result is shared by
  every call with the same variants. See
  [Caching](/recipe/recipe/caching/#shared-results).
- **Give a kind `combine` when two values can make one.** A recipe that
  composes others then builds its results as fast as one config. See
  [`combine`](/recipe/recipe/recipe-kinds/#combine).
- **Do work that needs every value in `finish`.** Collect the values in
  `reduce`, and merge, sort, or deduplicate them once. See
  [Collect, then finish](/recipe/recipe/designing-a-kind/#collect-then-finish).

## Recipes

- **Create kinds and recipes once, at the top level of a module.** Each
  recipe compiles its config when it is created and caches its own
  results; creating one on every render throws both away.
- **Put each value where it applies.** Values that apply to every
  selection go in `base`, the values of a variant in its options, and
  values that depend on several variants in compound variants, which apply
  after the options. See [Variants](/recipe/recipe/variants/).
- **Give variants defaults.** A variant with a default is optional, and a
  selection that leaves it out shares the result of the one that names the
  default.
- **Pass declared options only.** A selection with an undeclared option
  adds nothing for it and is built on every call.
- **Keep the cache on.** Turn it off only for a kind that cannot be pure.
  See [Caching](/recipe/recipe/caching/#turning-the-cache-off).

## Libraries

- **Apply overrides around the recipe, not through it.** Build a new
  object only when an override is passed, so that the call without one
  stays a cache lookup. See
  [Overrides](/recipe/recipe/building-a-library/#overrides).
- **Translate configs when a recipe is created.** Never translate them
  on each call.
- **Type the library with the engine's types**, so that its users get the
  same inference and errors. See
  [TypeScript](/recipe/recipe/typescript/#types-for-library-authors).
