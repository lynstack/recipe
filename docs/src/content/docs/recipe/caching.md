---
title: Caching
description: "How a recipe caches the result of each declared selection, which selections it builds on every call, why results must be frozen, and when to turn the cache off."
---

A recipe builds the result of each declared selection once, and returns the
same result to every later call with the same variants:

```ts
const text = styleRecipe({
  variants: { size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } } },
  defaultVariants: { size: "sm" },
});

text() === text({ size: "sm" }); // => true
```

The two calls select the same options, so they have the same key (see
[How it works](/recipe/recipe/how-it-works/)) and share one result.

## What is cached

- **Each recipe has its own cache.** Two recipes of the same kind never
  share a result.
- **Only declared selections are cached.** A selection with an option that
  its variant does not declare is built on every call.
- **Only the selections that are called.** A recipe stores a result the
  first time a selection is called, so its cache holds at most one result
  for each selection a program uses.
- **Not when there are too many selections to key.** When the number of
  possible selections is larger than `Number.MAX_SAFE_INTEGER`, which takes
  dozens of variants, a recipe builds every result on every call.

## A cached call

A cached call costs one lookup per variant and one for the cache, and
allocates nothing. Its speed does not depend on the kind, so a kind that
does more work to build a result, such as resolving conflicts between
values, costs that work once per selection. See
[Performance](/recipe/recipe/performance/) for how much faster a cached call
is.

## Shared results

Every call with the same variants returns the same result, so a caller
that changes it changes the result of every later call. Freeze an object
result in `finish`:

```ts
const styleKind = {
  // …
  finish: (style: MutableStyle): Style => Object.freeze(style),
};
```

A value that a component adds to the result, such as a `style` prop that
overrides it, belongs in a new object, built around the recipe; see
[Building a library](/recipe/recipe/building-a-library/#overrides).

## Turning the cache off

Pass `cache: false` with the kind to build the result on every call:

```ts
const uncachedStyleRecipe = createRecipeKind({ ...styleKind, cache: false });
```

Keep the cache unless the kind cannot be pure, or a recipe is called with
so many different selections, each only once, that storing them costs more
than building them. Without the cache, a call costs the work of the kind,
so prefer a kind that builds its result without copying, such as one that
reduces into a string or changes the accumulator from `initial` in place.

The package's benchmarks assert that a recipe and a slot recipe are faster
with the cache than without it.
