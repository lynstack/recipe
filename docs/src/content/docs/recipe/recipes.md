---
title: Recipes
description: "Create recipes of a kind, select their variants, list them with variantKeys, and learn how each recipe caches the result of every selection."
---

A recipe takes the same config as `cva`, with values of the kind's type
where `cva` takes class names, and `value` in compound variants where it
takes `className`:

- A variant without a default is required, except a boolean variant,
  whose only options are `"true"` and `"false"` and which defaults to
  `false`. A variant that declares one of them also declares the other,
  without a value, and accepts `true` and `false` as well as the strings.
- Option names that are numbers accept numbers as well as strings.
- A compound variant matches when every variant it names has one of the
  options it lists. One that names an undeclared variant or option never
  matches.
- An option that the config does not declare adds no value, and a value
  that is `undefined` adds nothing.
- Properties of the selection that are not variants are ignored, so a
  component can pass a recipe all of its props.

The recipe's `variantKeys` property lists the names of its variants. Use
it to split a component's props into the recipe's variants and the rest.

## Cache

A recipe builds the result of each declared selection once and caches it,
and calling it again with the same variants returns the same result.
Freeze an object result in `finish` so that callers cannot change a result
that later calls share. A selection with an undeclared option is built on
every call. Pass `cache: false` to `createRecipeKind` to build the result
on every call instead.

A cached call costs one lookup per variant and one for the cache, with no
allocation. To keep the uncached calls fast too, reduce into a value that
`reduce` can extend without copying, such as a string.

See [Performance](/recipe/recipe/performance/) for how much faster
a cached call is.
