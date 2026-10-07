# Changelog

All notable changes to `@lynstack/recipe`. Each version is published on
npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `recipe@<version>`.

## 1.3.0 — 2026-10-07

A recipe can build on other recipes with `composes`.

- A recipe and a slot recipe take `composes`, a list of recipes whose
  configs they add to their own, as if written in one config: their bases
  first, every variant and option of each, with the values of an option in
  the order of the recipes, their compound variants first, and the last
  default given for each variant. A slot recipe has the slots of the slot
  recipes it composes, theirs first. A recipe composed several times
  counts once.
- A recipe composes recipes of any kind whose values have the type of its
  own. Composing anything else, or a slot recipe in a recipe, is a type
  error and throws a `TypeError` when the recipe is created.
- The configs are merged when the recipe is created: a composed recipe is
  as fast as the one config it stands for.
- A recipe's type carries what it passes on to the recipes that compose
  it, under a `~composition` property that exists in the type only.
  `KindRecipe` takes it as a third, optional type parameter.
- New types for libraries built on the engine: `RecipeComposition`,
  `Composable`, `ComposableKindRecipe`, `ComposableKindSlotRecipe`,
  `ComposedVariants`, `ComposedDefaultedName`, and `ComposedSlot`.

## 1.2.0 — 2026-10-06

- A recipe and a slot recipe take `cache` in their config, which
  overrides the `cache` of their kind. A recipe whose variants come from
  untrusted input, such as the requests of a server, can turn its cache
  off while the other recipes of its kind keep theirs, since a cache keeps
  up to one result for each combination of declared options.
- A slot recipe keeps a slot named `__proto__` in its result. It set the
  prototype of the result before, and the slot was missing.
- The README states the requirements: TypeScript 5.4 or newer for the
  types, and an ES2022 runtime.

## 1.1.2 — 2026-10-05

The public API and behavior are unchanged.

- `package.json` declares `main` as well as `exports`, for bundlers that
  read only `main`, such as the one of Expo Snack.

## 1.1.1 — 2026-10-05

- A recipe whose kind returns `undefined` caches that result, as it
  caches any other, instead of building it again on every call.

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
