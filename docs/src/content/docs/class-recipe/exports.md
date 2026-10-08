---
title: class-recipe exports
description: "Every function and type that @lynstack/class-recipe exports: cx, cva, sva, createRecipes, and the types of recipes, slot recipes, and their configs, with their signatures and type parameters."
sidebar:
  label: Exports
---

Every export is documented with TSDoc, so your editor shows the full
reference, including the types of each config and its props.

## Functions

| Export             | Signature                                  | Description                                                          | See                                                   |
| ------------------ | ------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `cx`               | `(...inputs: ClassArray) => string`        | Joins class names, skipping falsy values. Compatible with `clsx`.    | [cx](/recipe/class-recipe/cx/)                        |
| `cva`              | `(config: RecipeConfig) => Recipe`         | Creates a recipe that returns the class name of one element.         | [cva](/recipe/class-recipe/cva/)                      |
| `sva`              | `(config: SlotRecipeConfig) => SlotRecipe` | Creates a slot recipe that returns the class names of several slots. | [sva](/recipe/class-recipe/sva/)                      |
| `createRecipe`     | Same as `cva`                              | The same function as `cva`, under a longer name.                     | [cva](/recipe/class-recipe/cva/)                      |
| `createSlotRecipe` | Same as `sva`                              | The same function as `sva`, under a longer name.                     | [sva](/recipe/class-recipe/sva/)                      |
| `createRecipes`    | `(options?: RecipesOptions) => Recipes`    | Returns `cx` and the recipe creators with a custom join or cache.    | [createRecipes](/recipe/class-recipe/create-recipes/) |

`cva` and `sva` are generic: they infer the type parameters of the config
and of the recipe from the config you pass.

## Types for components

| Export            | Type parameters | Description                                                                               | See                                                                             |
| ----------------- | --------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `VariantsOf`      | `<Recipe>`      | The variants a recipe or slot recipe accepts, without `className` or `classNames`.        | [Typing recipes](/recipe/class-recipe/typescript/#typing-component-props)       |
| `PropsOf`         | `<Recipe>`      | The props a recipe or slot recipe accepts: its variants, and `className` or `classNames`. | [Typing recipes](/recipe/class-recipe/typescript/#props-that-include-classname) |
| `SlotClasses`     | `<Slot>`        | Classes for some of a slot recipe's slots, keyed by slot name. Types a `classNames` prop. | [Building components](/recipe/class-recipe/building-components/)                |
| `SlotClassNames`  | `<Slot>`        | The class name of every slot, keyed by slot name, as a slot recipe returns it.            | [sva](/recipe/class-recipe/sva/#the-result)                                     |
| `ClassValue`      | None            | A value that `cx` turns into class names.                                                 | [cx](/recipe/class-recipe/cx/)                                                  |
| `ClassArray`      | None            | A list of class values, which may be nested.                                              | [cx](/recipe/class-recipe/cx/)                                                  |
| `ClassDictionary` | None            | An object whose keys are class names, each included when its value is truthy.             | [cx](/recipe/class-recipe/cx/)                                                  |

## Types of recipes and configs

| Export                | Type parameters                             | Description                                                                                                              | See                                                                                        |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `Recipe`              | `<Props, Composition>`                      | A function that returns the class name for a selection, with `variantKeys`, `variantOptions`, and `defaultVariants`.     | [cva](/recipe/class-recipe/cva/#the-result)                                                |
| `RecipeConfig`        | `<Variants, DefaultedName, Composed>`       | The config of a recipe made by `cva`.                                                                                    | [cva](/recipe/class-recipe/cva/#the-config)                                                |
| `RecipeProps`         | `<Variants, DefaultedName>`                 | The props a recipe accepts: its variants and `className`. Takes the parts of a config, not a recipe.                     | [Typing recipes](/recipe/class-recipe/typescript/#recipeprops-takes-a-config-not-a-recipe) |
| `RecipeVariants`      | None                                        | The variants of a recipe's config, with any names: for each variant name, the classes of each option.                    | [Typing recipes](/recipe/class-recipe/typescript/#variant-names-not-known-in-advance)      |
| `CompoundVariant`     | `<Variants>`                                | A compound variant of a recipe: `{ variants, className }`.                                                               | [cva](/recipe/class-recipe/cva/#a-compound-variant)                                        |
| `CreateRecipe`        | None                                        | The type of `cva` and `createRecipe`.                                                                                    | [cva](/recipe/class-recipe/cva/#signature)                                                 |
| `SlotRecipe`          | `<Slot, Props, Composition>`                | A function that returns the class name of every slot for a selection, with its variants listed as a `Recipe` lists them. | [sva](/recipe/class-recipe/sva/#the-result)                                                |
| `SlotRecipeConfig`    | `<Slot, Variants, DefaultedName, Composed>` | The config of a slot recipe made by `sva`.                                                                               | [sva](/recipe/class-recipe/sva/#the-config)                                                |
| `SlotRecipeProps`     | `<Slot, Variants, DefaultedName>`           | The props a slot recipe accepts: its variants and `classNames`. Takes the parts of a config, not a recipe.               | [Typing recipes](/recipe/class-recipe/typescript/#recipeprops-takes-a-config-not-a-recipe) |
| `SlotRecipeVariants`  | None                                        | The variants of a slot recipe's config, with any names: for each variant name, the classes of each slot for each option. | [Typing recipes](/recipe/class-recipe/typescript/#variant-names-not-known-in-advance)      |
| `SlotCompoundVariant` | `<Slot, Variants>`                          | A compound variant of a slot recipe: `{ variants, classNames }`.                                                         | [sva](/recipe/class-recipe/sva/#a-compound-variant)                                        |
| `CreateSlotRecipe`    | None                                        | The type of `sva` and `createSlotRecipe`.                                                                                | [sva](/recipe/class-recipe/sva/#signature)                                                 |
| `Recipes`             | None                                        | The functions that `createRecipes` returns, all sharing one join and cache setting.                                      | [createRecipes](/recipe/class-recipe/create-recipes/#what-it-returns)                      |
| `RecipesOptions`      | None                                        | The options of `createRecipes`.                                                                                          | [createRecipes](/recipe/class-recipe/create-recipes/#options)                              |
| `ClassJoin`           | None                                        | `(...classNames: readonly string[]) => string`: combines class strings into the class name, such as `cx` or `twMerge`.   | [createRecipes](/recipe/class-recipe/create-recipes/#the-join-function)                    |

In these type parameters, `Variants` is the type of a config's
`variants`, `DefaultedName` the names of the variants that have a default,
`Slot` the names of the slots, `Props` the props a recipe accepts, and
`Composed` the types of the recipes in `composes`. `Composition` is what a
recipe passes on to the recipes that compose it; it exists in the types
only.

## Types shared with the engine

These types come from `@lynstack/recipe`, which class-recipe re-exports
so that you need not install it. `RecipeComposition` is part of the type
of a recipe: a module that exports a recipe and emits declarations names
it through class-recipe.

| Export              | Type parameters                           | Description                                                                              |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `VariantSelection`  | `<Variants, DefaultedName>`               | The variants a selection names, with the optional ones marked optional.                  |
| `VariantOption`     | `<Options>`                               | The values accepted for one variant: its option names, and numbers or booleans for them. |
| `DefaultVariants`   | `<Variants, DefaultedName>`               | The option each defaulted variant uses when a selection leaves it out.                   |
| `CompoundCondition` | `<Variants>`                              | The condition of a compound variant: the options it matches for each variant it names.   |
| `RecipeFunction`    | `<Props, Result>`                         | A function that takes a selection, whose argument is optional when every variant is.     |
| `RecipeComposition` | `<Variants, DefaultedName, Value, Slots>` | What a recipe passes on to the recipes that compose it, in its type only.                |
| `ComposedSlot`      | `<Composed, Slot>`                        | The slots of a slot recipe that composes others: theirs, then its own.                   |

The recipes of class-recipe are built on
[`@lynstack/recipe`](/recipe/recipe/). Use it to create recipes for values
other than class names, such as style objects.
