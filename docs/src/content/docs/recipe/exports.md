---
title: recipe exports
description: "Every function and type that @lynstack/recipe exports: createRecipeKind, createSlotRecipeKind, and the types of kinds, recipes, slot recipes, and configs."
sidebar:
  label: Exports
---

| Export                    | Description                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `createRecipeKind`        | Creates a kind of recipe and returns the function that creates recipes of that kind.                              |
| `createSlotRecipeKind`    | Creates a kind of slot recipe from a recipe kind and returns the function that creates slot recipes of that kind. |
| `RecipeKind`              | How a kind of recipe turns the values of a selection into its result.                                             |
| `CreateKindRecipe`        | The function that `createRecipeKind` returns, which creates recipes of one kind.                                  |
| `KindRecipeConfig`        | The configuration of a recipe of a kind.                                                                          |
| `KindRecipe`              | A recipe of a kind, with the names of its variants in `variantKeys`.                                              |
| `KindVariants`            | The variants of a recipe's config: for each variant name, the value of each of its options.                       |
| `CreateKindSlotRecipe`    | The function that `createSlotRecipeKind` returns, which creates slot recipes of one kind.                         |
| `KindSlotRecipeConfig`    | The configuration of a slot recipe of a kind.                                                                     |
| `KindSlotVariants`        | The variants of a slot recipe's config: for each variant name, the values of each slot for each of its options.   |
| `KindSlotCompoundVariant` | Values added to some slots when several variants have particular options at the same time.                        |
| `SlotValues`              | Values for some of a slot recipe's slots, keyed by slot name.                                                     |
| `KindCompoundVariant`     | A value added when several variants have particular options at the same time.                                     |
| `VariantsOf`              | The variants a recipe accepts, to type the props of a component built on it.                                      |
| `VariantKey`              | The name of each variant in a selection, as a string, as `variantKeys` lists it.                                  |
| `VariantSelection`        | The variants a selection names, with the optional ones marked optional.                                           |
| `VariantOption`           | The values accepted for one variant.                                                                              |
| `DefaultVariants`         | The option each defaulted variant uses when a selection leaves it out.                                            |
| `CompoundCondition`       | The condition of a compound variant: the options it matches for each variant it names.                            |
| `RecipeFunction`          | A function that takes a selection, whose argument is optional when every variant is.                              |

See [API](/recipe/recipe/api/) for the parameters of the two functions,
and [TypeScript](/recipe/recipe/typescript/#types-for-library-authors) for
how a library uses the types. Every export is documented with TSDoc, so
your editor shows the full reference.
