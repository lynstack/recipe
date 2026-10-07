---
title: native-recipe glossary
description: "Plain definitions of the terms in the native-recipe docs: recipe, slot recipe, themed recipe, variant, option, selection, compound variant, slot, theme, token, stable style, cache."
sidebar:
  label: Glossary
---

## Recipe

A function made from your style config with `createStyleRecipe`. You call
it with variants, and it returns the style of one element. See
[createStyleRecipe](/recipe/native-recipe/create-style-recipe/).

## Slot recipe

A recipe that returns one style for each element of a component, such as
a button's container and label. You create it with
`createSlotStyleRecipe`. See
[createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/).

## Themed recipe

A recipe whose config is a function of a theme. You call it with the
theme first, then the variants: `button(theme, { size: "sm" })`. See
[createThemedRecipes](/recipe/native-recipe/create-themed-recipes/).

## Variant

A prop that changes the style, such as `size` or `tone`. A config lists
its variants under `variants`. See
[Variants](/recipe/native-recipe/variants/).

## Option

One value of a variant, such as `"sm"` for `size`. Each option has its own
style. See [Variants](/recipe/native-recipe/variants/).

## Selection

The variants you pass in one call, such as `{ size: "sm", tone: "danger" }`.
The recipe returns the style of that selection.

## Default variant

The option a variant uses when a call leaves it out. You set it in
`defaultVariants`. See
[Variants](/recipe/native-recipe/variants/#required-and-default-variants).

## Required variant

A variant without a default. Every call must choose it, or TypeScript
reports an error. See
[Variants](/recipe/native-recipe/variants/#required-and-default-variants).

## Boolean variant

A variant with an option named `true` or `false`. It accepts the booleans
`true` and `false`. If it has no other options, it is optional and `false`
by default. See [Variants](/recipe/native-recipe/variants/#boolean-variants).

## Compound variant

A style added when several variants have particular options at the same
time, such as a border when `tone` is `danger` and `outlined` is `true`.
See [Variants](/recipe/native-recipe/variants/#compound-variants).

## Slot

One element of a component that a slot recipe styles, such as `root`,
`label`, or `title`. You choose the slot names. See
[createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/).

## Composing

Reusing the config of one recipe in another, with `composes`. See
[Composing recipes](/recipe/native-recipe/composing/).

## Theme

An object of tokens for one look of your app, such as a light theme and a
dark theme. Every theme has the same type. See
[Theming with design tokens](/recipe/native-recipe/themes/).

## Token

One value in a theme, such as `theme.colors.primary` or `theme.space.md`.
Name tokens by their role, not their value, so that each theme can give
them its own value.

## Frozen style

A style object that cannot be changed. A recipe returns frozen styles,
because every call with the same variants shares them.

## Stable style

A style that is the same object on every render. React skips comparing a
`style` prop that has not changed, and a memoized child that receives it
skips rendering. A recipe returns a stable style for the same variants.
See [How it works](/recipe/native-recipe/how-it-works/#stable-styles).

## Cache

Where a recipe keeps the style of each selection after the first call.
Later calls with the same variants return the cached style. Create each
recipe once, at the top level of a module, so that its cache lasts. See
[How it works](/recipe/native-recipe/how-it-works/).
