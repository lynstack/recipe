# Changelog

All notable changes to `@lynstack/recipe`. Each version is published on
npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `recipe@<version>`.

## 1.1.0 — 2026-10-05

`@lynstack/recipe` now creates slot recipes, which map a selection of
variants to the result of each of several slots, such as the class names
or the styles of the elements of a component.

- `createSlotRecipeKind` takes the same kind as `createRecipeKind` and
  returns the function that creates slot recipes of that kind. Each slot
  reduces its own values, and the result is a frozen object of each
  slot's result, cached for each declared selection.
- New types for slot recipes: `CreateKindSlotRecipe`,
  `KindSlotRecipeConfig`, `KindSlotVariants`, `KindSlotCompoundVariant`,
  and `SlotValues`.
- `VariantsOf` returns the variants a recipe accepts, to type the props of
  a component built on it, and `VariantKey` names the variants of a
  selection.

## 1.0.0 — 2026-10-04

The first release of `@lynstack/recipe`, which creates recipes for values
of any type.

- `createRecipeKind` defines a kind of recipe by how it reduces values,
  such as class names or style objects, and returns the function that
  creates recipes of that kind.
- Recipes support variants, compound variants, default variants, and
  boolean variants, list their variants in `variantKeys`, and cache the
  result of each declared selection.
- No dependencies; ES modules only.
