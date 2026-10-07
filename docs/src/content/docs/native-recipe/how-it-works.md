---
title: How native-recipe works
description: "How native-recipe builds and caches React Native styles: prepared once, the order of styles, composed recipes, frozen styles that keep the style prop stable, a recipe per theme."
sidebar:
  label: How it works
---

A recipe is a function that you create once and call on every render.
This page explains what happens in each step, and why the `style` prop
stays the same object between renders.

## Prepared once, a lookup after that

When you create a recipe, it reads its config once, and gives each option
of each variant a number. A selection then becomes one integer.

- The first call with a selection merges its style, freezes it, and
  saves it in the recipe's cache under that integer.
- Every later call with the same variants reads the option of each
  variant, finds the integer, and returns the saved style.

The cache belongs to the recipe. Create each recipe once, at the top level
of a module, so that its cache lasts. A recipe created inside a component
is a new recipe on every render, with an empty cache.

The cache grows with the selections that you call the recipe with. It
holds at most one style for each combination of declared options. A
config with `cache: false` turns it off: the recipe then builds a new
style on every call, and the `style` prop changes on every render. Leave
the cache on.

## The order of styles

A style merges, from the least to the most specific:

1. `base`.
2. The style of each variant's selected option, in the order of
   `variants`.
3. The style of each matching compound variant, in the order of
   `compoundVariants`.

A later style overrides the properties of an earlier one, as in
`StyleSheet.flatten`. A property set to `undefined` is copied too.
Defaults apply before compound variants are checked, so a compound
variant can match a default option. A slot recipe merges the style of
each slot in the same order.

## Composed recipes

A recipe that composes others merges their configs with its own when you
create it, theirs first (see
[Composing recipes](/recipe/native-recipe/composing/)). After that, it is
one recipe with one config. So a call costs the same as a call of a recipe
written without `composes`, with or without the cache. The recipes it
composes keep their own configs and caches.

## Stable styles

For React Native, the cost of a style is in its identity. When a component
renders again and its `style` prop is the same object as before, React
skips comparing it, and a memoized child that receives it skips
rendering.

A style built during the render is a new object on every render. This
includes `{ ...base, ...sizes[size] }` and an array of styles. React
compares a new object property by property, and flattens an array first.

A recipe returns the same frozen object for the same variants. So the
`style` prop keeps its identity as long as the variants stay the same,
like a style of `StyleSheet.create` declared outside the component. A
slot recipe returns the same frozen object too, with the same frozen
style for each slot. Freezing stops a component from changing a style
that every other call with the same variants shares.

## One recipe for each theme

A [themed recipe](/recipe/native-recipe/create-themed-recipes/) takes a
theme and a selection. The first call with a theme object builds the
config for that theme and creates a recipe from it. The themed recipe
keeps that recipe for that object. Every later call with the same object
uses that recipe and its cache. So:

- Each theme has its own cache. Switching back to a theme returns its
  cached styles.
- A theme object must keep its identity. A new object, even with the same
  tokens, creates a new recipe with an empty cache (see
  [Theme identity](/recipe/native-recipe/create-themed-recipes/#theme-identity)).
- A theme that nothing references anymore is released, with its recipe.

:::note[Under the hood]
native-recipe is built on [`@lynstack/recipe`](/recipe/recipe/), an engine
for recipes of any value. You do not need it to use native-recipe. Its
[How it works](/recipe/recipe/how-it-works/) page shows how it numbers
options and keys the cache.
:::

## Next steps

- [Building components](/recipe/native-recipe/building-components/) keeps
  styles stable in real components.
- [Benchmarks](/recipe/native-recipe/performance/) measure the cache.
- [FAQ](/recipe/native-recipe/faq/) answers common questions.
