---
title: How class-recipe works
description: "How class-recipe builds and caches class names: compiled once, the order of the classes, composed recipes, when the join function runs, overrides, stable slot results, and variants from untrusted input."
sidebar:
  label: How it works
---

`cva` and `sva` turn a config into a function. This page explains what
that function does when you call it, and why most calls cost almost
nothing.

## Compiled once, a lookup after that

A recipe prepares its config once, when you create it. It gives each
option of each variant a number, so that a selection, the variants of one
call, becomes a single integer.

- The first call with a selection builds its class name, and stores it in
  the recipe's **cache** under that integer.
- Every later call with the same variants reads the option of each
  variant, computes the integer, and returns the stored class name.

Create each recipe once, at the top level of a module, so that its cache
lasts. The cache grows with the selections that the recipe is called
with, up to one entry for each combination of declared options.

## The order of the classes

A class name lists its classes from the least to the most specific:

1. `base`.
2. The classes of each variant's selected option, in the order of
   `variants`.
3. The classes of each matching compound variant, in the order of
   `compoundVariants`.
4. `className`, or a slot's `classNames`, passed with the selection.

The recipe applies the defaults before it checks the compound variants,
so a compound variant can match a default option.

## Composed recipes

A recipe that composes others merges their configs with its own when you
create it, theirs first. It then prepares the result as one config, so it
costs what that one config costs, with or without the cache. See
[Composing recipes](/recipe/class-recipe/composing/).

## The join function

A **join function** turns the class strings of a selection into its class
name. The default join, `cx`, concatenates them and keeps every class. A
join passed to [`createRecipes`](/recipe/class-recipe/create-recipes/),
such as `twMerge`, can resolve conflicts between them instead.

A recipe calls the join:

- Once for each declared selection, whose class name it then caches.
- Again for each call that passes `className` or `classNames`, which it
  adds to the cached class name.
- On each call with an option that its variant does not declare, which is
  never cached.

So an expensive join, such as `twMerge`, costs little: a call without an
override returns the cached class name.

## Overrides

`className`, for a recipe, and `classNames`, for a slot recipe, add
classes after every class of the recipe. With the default join they are
added, not substituted: a class that sets the same CSS property as a class
of the recipe leaves both in the class name, and the one defined later in
the stylesheet wins. Design recipes that need no override (see
[Writing conflict-free recipes](/recipe/class-recipe/conflict-free-recipes/)),
or use a join that resolves conflicts (see
[Merging classes](/recipe/class-recipe/tailwind-merge/)).

## Stable results

A slot recipe returns a frozen object with the class name of every slot,
and the same object for the same variants, which keeps props stable for
memoized components. Passing `classNames` with at least one class returns
a new frozen object, and leaves the cached one unchanged. A recipe returns
a string, which is the same value for the same variants.

## Without the cache

`createRecipes({ cache: false })` returns recipes that build their class
names on every call. They return the same class names, but a slot recipe
returns a new object on every call. `cache: false` in the config of a
recipe turns the cache off for that recipe only. See
[createRecipes](/recipe/class-recipe/create-recipes/#turning-off-the-cache).

## On a server

A recipe is pure: the same variants always give the same class name. The
cache holds only the class names of declared selections, keyed by their
options. It never holds `className`, `classNames`, or any other prop. So
one recipe, created at the top level of a module, can serve every request
of a server, and two requests never see each other's data. See
[Frameworks and SSR](/recipe/class-recipe/frameworks/).

## Variants from untrusted input

A recipe's cache keeps every class name it builds for as long as the
recipe exists, up to one for each combination of declared options. On a
server, a recipe whose variants come from requests lets clients choose
those combinations. A recipe that declares many of them grows its cache
with each new one. Pass `cache: false` in the config of such a recipe,
and keep the cache for the others:

```ts
const badge = cva({
  cache: false,
  base: "rounded-full px-2 text-xs",
  variants: { tone: { neutral: "bg-gray-100", danger: "bg-red-100" } },
});
```

A recipe with few combinations, or whose variants the program chooses
itself, needs no change. An option that the config does not declare is
never cached, so it cannot grow the cache.

:::note[Under the hood]
class-recipe is built on the engine `@lynstack/recipe`, which numbers the
options, caches the results, and infers the types. Its
[How it works](/recipe/recipe/how-it-works/) page draws each step. You do
not need it to use class-recipe.
:::

## Next steps

- [Variants](/recipe/class-recipe/variants/) explains how a recipe reads
  its props.
- [Merging classes](/recipe/class-recipe/tailwind-merge/) sets up a join
  that resolves conflicts.
- [Benchmarks](/recipe/class-recipe/performance/) measure the cache.
