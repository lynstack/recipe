---
title: native-recipe exports
description: "Every function and type that @lynstack/native-recipe exports: createStyleRecipe, createSlotStyleRecipe, createThemedRecipes, and the types of their configs."
sidebar:
  label: Exports
---

Everything below is exported from `@lynstack/native-recipe`. Every export
is documented with TSDoc, so your editor shows the full reference.

## Functions

| Export                  | Signature (simplified)                                    | Explained in                                                             |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `createStyleRecipe`     | `(config: StyleRecipeConfig) => StyleRecipe`              | [createStyleRecipe](/recipe/native-recipe/create-style-recipe/)          |
| `createSlotStyleRecipe` | `(config: SlotStyleRecipeConfig) => SlotStyleRecipe`      | [createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/) |
| `createThemedRecipes`   | `<Theme extends object>() => ThemedRecipeCreators<Theme>` | [createThemedRecipes](/recipe/native-recipe/create-themed-recipes/)      |

TypeScript infers the type parameters of `createStyleRecipe` and
`createSlotStyleRecipe` from the config. Write only the `Theme` of
`createThemedRecipes`.

## Types for components

You use these types in your own code.

| Export                    | Type parameters                | Description                                                                                  | Explained in                                                                      |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `VariantsOf`              | `Recipe`: the type of a recipe | The variants a recipe accepts, a themed recipe included. Use it to type a component's props. | [Typing recipes](/recipe/native-recipe/typescript/#typing-component-props)        |
| `NativeStyle`             | None                           | The style of a React Native element: a view, a text, or an image.                            | [Typing recipes](/recipe/native-recipe/typescript/#any-style)                     |
| `StyleRecipeVariants`     | None                           | The variants of a style recipe's config, for variant names not known at compile time.        | [Typing recipes](/recipe/native-recipe/typescript/#variants-from-a-cms-or-an-api) |
| `SlotStyleRecipeVariants` | None                           | The variants of a slot style recipe's config, for variant names not known at compile time.   | [Typing recipes](/recipe/native-recipe/typescript/#variants-from-a-cms-or-an-api) |

## Types of recipes and configs

TypeScript infers these types. You rarely write them, but your editor
shows them.

| Export                     | Type parameters                                                      | Description                                                                                                                    | Explained in                                                                                |
| -------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `StyleRecipe`              | `Props`, `Style`, `Composition`                                      | A function that returns the style of one element for a selection, with `variantKeys`, `variantOptions`, and `defaultVariants`. | [createStyleRecipe](/recipe/native-recipe/create-style-recipe/#the-result)                  |
| `StyleRecipeConfig`        | `Variants`, `Base`, `Compounds`, `DefaultedName`, `Composed`         | The config of `createStyleRecipe`.                                                                                             | [createStyleRecipe](/recipe/native-recipe/create-style-recipe/#the-config)                  |
| `StyleCompoundVariant`     | `Variants`, `Style`                                                  | A compound variant of a style recipe: `variants` and `style`.                                                                  | [createStyleRecipe](/recipe/native-recipe/create-style-recipe/#compound-variants)           |
| `SlotStyleRecipe`          | `Props`, `Styles`, `Composition`                                     | A function that returns the style of every slot for a selection, with its variants listed as a `StyleRecipe` lists them.       | [createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/#the-result)         |
| `SlotStyleRecipeConfig`    | `Slot`, `Variants`, `Base`, `Compounds`, `DefaultedName`, `Composed` | The config of `createSlotStyleRecipe`.                                                                                         | [createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/#the-config)         |
| `SlotStyleCompoundVariant` | `Variants`, `Styles`                                                 | A compound variant of a slot style recipe: `variants` and `styles`.                                                            | [createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/#compound-variants)  |
| `SlotStyles`               | `Slot`                                                               | Styles for some of a slot recipe's slots, keyed by slot name.                                                                  | [createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/#the-config)         |
| `ThemedRecipe`             | `Theme`, `Props`, `Result`, `Composition`                            | A recipe whose styles are built from a theme. It takes the theme and a selection, and has `withTheme`.                         | [createThemedRecipes](/recipe/native-recipe/create-themed-recipes/#calling-a-themed-recipe) |
| `ThemedRecipeCreators`     | `Theme`                                                              | The functions that `createThemedRecipes` returns.                                                                              | [createThemedRecipes](/recipe/native-recipe/create-themed-recipes/#signature)               |
| `VariantSelection`         | `Variants`, `DefaultedName`                                          | The variants a selection names, with the optional ones marked optional.                                                        | [Variants](/recipe/native-recipe/variants/#required-and-default-variants)                   |
| `VariantOption`            | `Options`                                                            | The values accepted for one variant: its option names, numbers for number names, and booleans for a boolean variant.           | [Variants](/recipe/native-recipe/variants/#boolean-variants)                                |
| `DefaultVariants`          | `Variants`, `DefaultedName`                                          | The option each variant with a default uses when a selection leaves it out.                                                    | [Variants](/recipe/native-recipe/variants/#required-and-default-variants)                   |
| `CompoundCondition`        | `Variants`                                                           | The condition of a compound variant: the options it matches for each variant it names.                                         | [Variants](/recipe/native-recipe/variants/#compound-variants)                               |
| `RecipeFunction`           | `Props`, `Result`                                                    | A function that takes a selection, whose argument is optional when every variant is.                                           | [createStyleRecipe](/recipe/native-recipe/create-style-recipe/#the-result)                  |
| `KindRecipe`               | `Props`, `Result`, `Composition`                                     | The recipe of `@lynstack/recipe` that `StyleRecipe` and `SlotStyleRecipe` are, and that `withTheme` returns.                   | [createThemedRecipes](/recipe/native-recipe/create-themed-recipes/)                         |
| `RecipeComposition`        | `Variants`, `DefaultedName`, `Value`, `Slots`                        | What a recipe passes on to the recipes that compose it, in its type only.                                                      | [Composing recipes](/recipe/native-recipe/composing/)                                       |
| `ComposedSlot`             | `Composed`, `Slot`                                                   | The slots of a slot recipe that composes others: theirs, then its own.                                                         | [Composing recipes](/recipe/native-recipe/composing/)                                       |

The `Composition` parameter carries what a recipe passes on to the
recipes that compose it. It exists in the types only. `KindRecipe`,
`RecipeComposition`, and `ComposedSlot` come from `@lynstack/recipe`:
they are part of the type of a recipe, so a module that exports a recipe
and emits declarations names them through native-recipe.
