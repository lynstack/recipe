---
title: recipe exports
description: "Every function and type that @lynstack/recipe exports: createRecipeKind, createSlotRecipeKind, and the types of kinds, recipes, slot recipes, configs, and composition."
sidebar:
  label: Exports
---

| Export                     | Description                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `createRecipeKind`         | Creates a kind of recipe and returns the function that creates recipes of that kind.                                |
| `createSlotRecipeKind`     | Creates a kind of slot recipe from a recipe kind and returns the function that creates slot recipes of that kind.   |
| `RecipeKind`               | How a kind of recipe turns the values of a selection into its result.                                               |
| `CreateKindRecipe`         | The function that `createRecipeKind` returns, which creates recipes of one kind.                                    |
| `KindRecipeConfig`         | The configuration of a recipe of a kind.                                                                            |
| `KindRecipe`               | A recipe of a kind, with its variants, options, and defaults in `variantKeys`, `variantOptions`, `defaultVariants`. |
| `KindVariants`             | The variants of a recipe's config: for each variant name, the value of each of its options.                         |
| `CreateKindSlotRecipe`     | The function that `createSlotRecipeKind` returns, which creates slot recipes of one kind.                           |
| `KindSlotRecipeConfig`     | The configuration of a slot recipe of a kind.                                                                       |
| `KindSlotVariants`         | The variants of a slot recipe's config: for each variant name, the values of each slot for each of its options.     |
| `KindSlotCompoundVariant`  | Values added to some slots when several variants have particular options at the same time.                          |
| `SlotValues`               | Values for some of a slot recipe's slots, keyed by slot name.                                                       |
| `KindCompoundVariant`      | A value added when several variants have particular options at the same time.                                       |
| `VariantsOf`               | The variants a recipe accepts, to type the props of a component built on it.                                        |
| `VariantKey`               | The name of each variant in a selection, as a string, as `variantKeys` lists it.                                    |
| `VariantSelection`         | The variants a selection names, with the optional ones marked optional.                                             |
| `VariantOption`            | The values accepted for one variant.                                                                                |
| `DefaultVariants`          | The option each defaulted variant uses when a selection leaves it out.                                              |
| `CompoundCondition`        | The condition of a compound variant: the options it matches for each variant it names.                              |
| `RecipeFunction`           | A function that takes a selection, whose argument is optional when every variant is.                                |
| `RecipeComposition`        | What a recipe passes on, in its type only, to the recipes that compose it.                                          |
| `Composable`               | Marks the type of a recipe that other recipes can compose, with its `RecipeComposition`.                            |
| `ComposableKindRecipe`     | A recipe that a recipe whose values are of a given type can compose.                                                |
| `ComposableKindSlotRecipe` | A slot recipe that a slot recipe whose values are of a given type can compose.                                      |
| `ComposedVariants`         | The variants of a recipe that composes others: theirs and its own, with the options of each.                        |
| `ComposedDefaultedName`    | The names of the variants with a default in a recipe that composes others.                                          |
| `ComposedSlot`             | The slots of a slot recipe that composes others.                                                                    |

See [API](/recipe/recipe/api/) for the parameters of the two functions,
and [TypeScript](/recipe/recipe/typescript/#types-for-library-authors) for
how a library uses the types. Every export is documented with TSDoc, so
your editor shows the full reference.
