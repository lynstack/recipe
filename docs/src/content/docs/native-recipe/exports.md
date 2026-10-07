---
title: native-recipe exports
description: "Every function and type that @lynstack/native-recipe exports: createStyleRecipe, createSlotStyleRecipe, createThemedRecipes, and the types of their configs."
sidebar:
  label: Exports
---

## Functions

| Export                  | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `createStyleRecipe`     | Creates a style recipe that returns the style of one element.                |
| `createSlotStyleRecipe` | Creates a slot style recipe that returns the styles of several slots.        |
| `createThemedRecipes`   | Returns the recipe creators for recipes whose styles are built from a theme. |

## Types

| Export                     | Description                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VariantsOf`               | The variants a recipe accepts, a themed recipe included.                                                                                                   |
| `NativeStyle`              | The style of a React Native element: a view, a text, or an image.                                                                                          |
| `StyleRecipe`              | A function that returns the style of one element for a selection of variants, with its variants in `variantKeys`, `variantOptions`, and `defaultVariants`. |
| `StyleRecipeConfig`        | The configuration of a recipe made by `createStyleRecipe`.                                                                                                 |
| `StyleRecipeVariants`      | The variants of a style recipe's config: for each variant name, the style of each of its options.                                                          |
| `StyleCompoundVariant`     | A style added when several variants have particular options at the same time.                                                                              |
| `SlotStyleRecipe`          | A function that returns the style of every slot for a selection of variants, with its variants listed as a `StyleRecipe` lists them.                       |
| `SlotStyleRecipeConfig`    | The configuration of a slot recipe made by `createSlotStyleRecipe`.                                                                                        |
| `SlotStyleRecipeVariants`  | The variants of a slot style recipe's config: for each variant name, the styles of each slot for each of its options.                                      |
| `SlotStyleCompoundVariant` | Styles added to some slots when several variants have particular options at the same time.                                                                 |
| `SlotStyles`               | Styles for some of a slot recipe's slots, keyed by slot name.                                                                                              |
| `ThemedRecipe`             | A recipe whose styles are built from a theme, which takes the theme and a selection, with `withTheme`.                                                     |
| `ThemedRecipeCreators`     | The functions that `createThemedRecipes` returns.                                                                                                          |
| `VariantSelection`         | The variants a selection names, with the optional ones marked optional.                                                                                    |
| `VariantOption`            | The values accepted for one variant.                                                                                                                       |
| `DefaultVariants`          | The option each defaulted variant uses when a selection leaves it out.                                                                                     |
| `CompoundCondition`        | The condition of a compound variant: the options it matches for each variant it names.                                                                     |
| `RecipeFunction`           | A function that takes a selection, whose argument is optional when every variant is.                                                                       |

The functions are described in
[createStyleRecipe](/recipe/native-recipe/create-style-recipe/),
[createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/),
and [createThemedRecipes](/recipe/native-recipe/create-themed-recipes/).
Every export is documented with TSDoc, so your editor shows the full
reference, including the types of each config.

The recipes are built on [`@lynstack/recipe`](/recipe/recipe/), which
creates recipes for values of any type.
