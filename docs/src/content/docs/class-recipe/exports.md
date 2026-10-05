---
title: class-recipe exports
description: "Every function and type that @lynstack/class-recipe exports: cx, cva, sva, createRecipes, and the types of recipes, slot recipes, and their configs."
sidebar:
  label: Exports
---

## Functions

| Export             | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `cx`               | Joins class names, skipping falsy values. Compatible with `clsx`.         |
| `cva`              | Creates a recipe that returns the class name of one element.              |
| `sva`              | Creates a slot recipe that returns the class names of several elements.   |
| `createRecipe`     | The same function as `cva`, under a longer name.                          |
| `createSlotRecipe` | The same function as `sva`, under a longer name.                          |
| `createRecipes`    | Returns `cx` and the recipe creators with a custom join or cache setting. |

## Types

| Export                | Description                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `VariantsOf`          | The variants a recipe accepts, without `className` or `classNames`.                                                                  |
| `Recipe`              | A function that returns the class name for a selection of variants, with the names of those variants in `variantKeys`.               |
| `RecipeConfig`        | The configuration of a recipe made by `cva`.                                                                                         |
| `RecipeProps`         | The properties a recipe accepts: its variants and a `className` override.                                                            |
| `RecipeVariants`      | The variants of a recipe's config: for each variant name, the classes of each of its options.                                        |
| `CompoundVariant`     | Classes added when several variants have particular options at the same time.                                                        |
| `CreateRecipe`        | The type of `cva` and `createRecipe`.                                                                                                |
| `SlotRecipe`          | A function that returns the class name of every slot for a selection of variants, with the names of those variants in `variantKeys`. |
| `SlotRecipeConfig`    | The configuration of a slot recipe made by `sva`.                                                                                    |
| `SlotRecipeProps`     | The properties a slot recipe accepts: its variants and a `classNames` override for each slot.                                        |
| `SlotRecipeVariants`  | The variants of a slot recipe's config: for each variant name, the classes of each slot for each of its options.                     |
| `SlotCompoundVariant` | Classes added to some slots when several variants have particular options at the same time.                                          |
| `SlotClasses`         | Classes for some of a slot recipe's slots, keyed by slot name.                                                                       |
| `SlotClassNames`      | The class name of every slot, keyed by slot name, as returned by a slot recipe.                                                      |
| `CreateSlotRecipe`    | The type of `sva` and `createSlotRecipe`.                                                                                            |
| `Recipes`             | The functions that `createRecipes` returns, all sharing one join and cache setting.                                                  |
| `RecipesOptions`      | The options of `createRecipes`.                                                                                                      |
| `ClassValue`          | A value that `cx` turns into class names.                                                                                            |
| `ClassArray`          | A list of class values, which may be nested.                                                                                         |
| `ClassDictionary`     | An object whose keys are class names, each included when its value is truthy.                                                        |
| `ClassJoin`           | Combines class strings into the final class name, such as `cx` or `twMerge`.                                                         |
| `VariantSelection`    | The variants a selection names, with the optional ones marked optional.                                                              |
| `VariantOption`       | The values accepted for one variant.                                                                                                 |
| `DefaultVariants`     | The option each defaulted variant uses when a selection leaves it out.                                                               |
| `CompoundCondition`   | The condition of a compound variant: the options it matches for each variant it names.                                               |
| `RecipeFunction`      | A function that takes a selection, whose argument is optional when every variant is.                                                 |

The functions are described in [cx](/recipe/class-recipe/cx/),
[cva](/recipe/class-recipe/cva/), [sva](/recipe/class-recipe/sva/), and
[createRecipes](/recipe/class-recipe/create-recipes/). Every export is
documented with TSDoc, so your editor shows the full reference, including
the types of each config and its props.

The recipes are recipes of a class name kind, built on
[`@lynstack/recipe`](/recipe/recipe/). Use
it to create recipes for values other than class names, such as style
objects.
