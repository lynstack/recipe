---
title: How class-recipe works
description: "How class-recipe builds and caches class names: compiled once, the order of the classes, composed recipes, when the join function runs, overrides, and stable slot results."
sidebar:
  badge: Updated
  label: How it works
---

`cva` and `sva` create recipes and slot recipes of a class name kind on
[`@lynstack/recipe`](/recipe/recipe/), the engine that selects, caches,
and types them. This page covers what class names add; see the engine's
[How it works](/recipe/recipe/how-it-works/) for the rest.

## Compiled once, a lookup after that

A recipe compiles its config when it is created: it numbers the options of
each variant, so a selection becomes one integer. The first call for a
selection builds its class name and caches it under that integer; every
later call with the same variants reads the option of each variant and
returns the cached class name. Create each recipe once, at the top level
of a module, so that its cache lasts. The cache grows with the selections
the recipe is called with, up to one entry per combination of declared
options.

## The order of the classes

A class name lists its classes from the least to the most specific:

1. `base`.
2. The classes of each variant's selected option, in the order of
   `variants`.
3. The classes of each matching compound variant, in the order of
   `compoundVariants`.
4. `className`, or a slot's `classNames`, passed with the selection.

Defaults apply before compound variants match, so a compound variant can
match a default option.

## Composed recipes

A recipe that composes others merges their configs with its own when it is
created, theirs first: their base classes come before its own, their
classes for an option before its own for that option, and their compound
variants before its own (see
[Composing recipes](/recipe/class-recipe/cva/#composing-recipes)). It joins
the classes that several recipes give one option into one string, and
compiles the result as one config, so it costs what that one config costs,
with or without the cache.

## The join function

A join function turns the class strings of a selection into its class
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
[Resolving conflicts with tailwind-merge](/recipe/class-recipe/tailwind-merge/)).

## Stable results

A slot recipe returns a frozen object with the class name of every slot,
and the same object for the same variants, which keeps props stable for
memoized components. Passing `classNames` with at least one class returns
a new frozen object, and leaves the cached one unchanged. A recipe returns a
string, which is the same value for the same variants.

## Without the cache

`createRecipes({ cache: false })` returns recipes that build their class
names on every call. They return the same class names, but a slot recipe
returns a new object on every call. `cache: false` in the config of a
recipe turns the cache off for that recipe only. See
[createRecipes](/recipe/class-recipe/create-recipes/#turning-off-the-cache).
