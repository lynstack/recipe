---
title: recipe exports
description: "Every function and type that @lynstack/recipe exports: createRecipeKind and the types of recipe kinds, recipes, configs, and selections."
sidebar:
  label: Exports
---

| Export                | Description                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `createRecipeKind`    | Creates a kind of recipe and returns the function that creates recipes of that kind.        |
| `RecipeKind`          | How a kind of recipe turns the values of a selection into its result.                       |
| `CreateKindRecipe`    | The function that `createRecipeKind` returns, which creates recipes of one kind.            |
| `KindRecipeConfig`    | The configuration of a recipe of a kind.                                                    |
| `KindRecipe`          | A recipe of a kind, with the names of its variants in `variantKeys`.                        |
| `KindVariants`        | The variants of a recipe's config: for each variant name, the value of each of its options. |
| `KindCompoundVariant` | A value added when several variants have particular options at the same time.               |
| `VariantSelection`    | The variants a selection names, with the optional ones marked optional.                     |
| `VariantOption`       | The values accepted for one variant.                                                        |
| `DefaultVariants`     | The option each defaulted variant uses when a selection leaves it out.                      |
| `CompoundCondition`   | The condition of a compound variant: the options it matches for each variant it names.      |
| `RecipeFunction`      | A function that takes a selection, whose argument is optional when every variant is.        |

Every export is documented with TSDoc, so your editor shows the full
reference.
