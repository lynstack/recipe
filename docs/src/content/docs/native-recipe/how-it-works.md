---
title: How native-recipe works
description: "How native-recipe builds and caches React Native styles: compiled once, the order of styles, composed recipes, frozen styles that keep the style prop stable, a recipe per theme."
sidebar:
  badge: Updated
  label: How it works
---

`createStyleRecipe` and `createSlotStyleRecipe` create recipes and slot
recipes of a style kind on [`@lynstack/recipe`](/recipe/recipe/), the
engine that selects, caches, and types them. This page covers what React
Native styles add; see the engine's
[How it works](/recipe/recipe/how-it-works/) for the rest.

## Compiled once, a lookup after that

A recipe compiles its config when it is created: it numbers the options of
each variant, so a selection becomes one integer. The first call for a
selection merges its style and caches it under that integer; every later
call with the same variants reads the option of each variant and returns
the cached style. Create each recipe once, at the top level of a module,
so that its cache lasts. The cache grows with the selections the recipe is
called with, up to one entry per combination of declared options. A recipe
whose config sets `cache: false` builds a new style on every call, which
changes the `style` prop on every render, so leave the cache on.

## The order of styles

A style merges, from the least to the most specific:

1. `base`.
2. The style of each variant's selected option, in the order of
   `variants`.
3. The style of each matching compound variant, in the order of
   `compoundVariants`.

A later style overrides the properties of an earlier one, as in
`StyleSheet.flatten`, and a property set to `undefined` is copied too.
Defaults apply before compound variants match, so a compound variant can
match a default option. A slot recipe merges the style of each slot in the
same order.

## Composed recipes

A recipe that composes others merges their configs with its own when it is
created, theirs first: their base styles come before its own, their style
for an option before its own for that option, and their compound variants
before its own (see
[Composing recipes](/recipe/native-recipe/create-style-recipe/#composing-recipes)).
It merges the styles that several recipes give one option into one style,
and compiles the result as one config, so it costs what that one config
costs, with or without the cache. The recipes it composes keep their own
configs and caches.

## Stable styles

What makes a style cheap for React Native is its identity. When a
component renders again and its `style` prop is the same object as
before, React skips comparing it, and a memoized child that receives it
skips rendering. A style built during the render, such as
`{ ...base, ...sizes[size] }`, or an array of styles, is a new value on
every render, which React compares property by property, and flattens
when it is an array.

A recipe returns the same frozen object for the same variants, so the
`style` prop keeps its identity as long as the variants do, as a style of
`StyleSheet.create` declared outside the component does. A slot recipe
returns the same frozen object, holding the same frozen style for each
slot. Freezing keeps a component from changing a style that every other
call with the same variants shares.

## One recipe for each theme

A recipe of [`createThemedRecipes`](/recipe/native-recipe/create-themed-recipes/)
takes a theme and a selection. The first call with a theme object builds
the config for that theme and compiles a recipe from it, which it keeps
for that object; every later call with the same object uses that recipe
and its cache. So:

- The styles of each theme are cached apart, and switching back to a
  theme returns its cached styles.
- A theme object must keep its identity: a new object, even with the same
  tokens, compiles a new recipe with an empty cache. Create each theme
  once, or memoize a theme built at runtime (see
  [Themes and design tokens](/recipe/native-recipe/themes/#keep-each-theme-stable)).
- A theme that is no longer referenced is released with its recipe.

## Undeclared options

The types accept only the options the config declares. A value from
untyped data can still bypass them: an option that its variant does not
declare adds no style, and its style is built on every call instead of
being cached. Properties of the selection that are not variants are
ignored, and calling a recipe without a selection is the same as calling
it with an empty one.
