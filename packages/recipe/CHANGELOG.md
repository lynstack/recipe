# Changelog

All notable changes to `@lynstack/recipe`. Each version is published on
npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `recipe@<version>`.

## Unreleased

- An editor completes the variant names of `defaultVariants`, and the
  slot names of the options of a slot recipe's variants. It completed
  neither before.

## 1.8.0 — 2026-10-08

A recipe warns about the names its config gives without declaring them,
which TypeScript lets through in a config declared before the call, and
a library's function generic over the slot recipe it composes can name
its own slots.

- A slot recipe's config types the slots of the slot recipes it composes
  apart from its own, so that a function generic over the slot recipe it
  composes can name its own slots, and declarations print the slots of
  `base` and of compound variants by name. Making library recipes
  composable advises the same for a library's types.
- Creating a recipe or a slot recipe warns, once, with `console.warn`,
  about a default or a compound variant that names a variant or an option
  that no config of the recipe declares, and, in a slot recipe, about a
  value for a slot that no config lists in `slots`. The recipe ignores
  such names, as before; TypeScript does not report every one in a config
  declared before the call, as `isolatedDeclarations` requires.

## 1.7.0 — 2026-10-08

A library can type its own functions and exported recipes: a function
generic over a config returns the recipe of its config, an exported
recipe has a type to annotate it with for `isolatedDeclarations`, and
the declarations of composed slot recipes stay small.

- `KindRecipeOf<Value, Result, Config, Composed>` and `KindSlotRecipeOf`
  are the types of the recipe and the slot recipe of a config declared
  `as const`, which annotate an exported recipe where
  `isolatedDeclarations` cannot infer the type of a call. A recipe that
  composes others lists their types as the last parameter.
- `KindSelection` is exported: a function generic over a config, such as
  a library's own helper, returns
  `KindRecipe<KindSelection<Variants, DefaultedName>, Result>`. Since
  1.3.0, the type of a recipe could not be assigned to such a type while
  the names of its defaults were a type parameter.
- The declaration of a slot recipe that composes others lists the names
  of its slots, instead of the types of the slot recipes it composes, so
  that it grows linearly with the level of composition. Before, it grew
  about 2.4 times with each level.

## 1.6.0 — 2026-10-07

A config with the wrong shape fails with a message that names what is
wrong, and a library that wraps slot recipes can reject unknown slots.

- Creating a recipe or a slot recipe checks the shape of its config,
  which the types already check, so that a config from untyped code
  throws a `TypeError` that names the part to fix: no `variants`, a
  variant whose options are not an object, a `compoundVariants` that is
  not an array, or a compound variant without `variants`. In a slot
  recipe, it also checks that `slots` is an array and that `base`, each
  option, and the `value` of each compound variant are an object of the
  value of each slot. Before, such a config threw an unrelated error, or a
  compound variant without `variants` matched every selection. The check
  runs once, when the recipe is created.
- `NoUnknownSlots` is exported: a library intersects the variants of its
  slot recipes' configs with it, as the engine's own config does, so that
  a value for a slot that `slots` does not name is a type error.

## 1.5.0 — 2026-10-07

A recipe lists the options and defaults of its variants, so that a
library can list every selection of a recipe, as a story or a table of
every option does, without reading its config.

- Every recipe and slot recipe has `variantOptions`, the names of the
  options of each variant, as strings, in the order the recipe numbers
  them: integer names first, in ascending order, then `"false"` and
  `"true"`, which a variant that declares either one has, then the others
  in the order of the config.
- Every recipe and slot recipe has `defaultVariants`, the option each
  variant uses when a selection leaves it out, as a string: its default,
  or `"false"` for a variant whose only options are `"true"` and
  `"false"`. A variant without a default is not in it.
- Both are frozen, keyed in the order of `variantKeys`, and typed with
  the names of the options of each variant. A recipe that composes others
  lists the variants, options, and defaults of the one config it stands
  for.
- `KindRecipe` has the two properties, so a type that implements it by
  hand needs them too.

## 1.4.0 — 2026-10-07

A recipe kind can combine two values into one, so that a recipe that
composes others builds its results as fast as the one config it stands
for.

- `RecipeKind` takes `combine(first, second)`, optional, which returns
  one value that adds what `first` then `second` add. A recipe that
  composes others calls it when it is created, never on a call, to
  combine its bases and the values that several configs give one option.
  A slot recipe combines the values of each slot in the same way.
- A kind with `combine` must not change `first` or `second`, and follows
  two rules, in which two accumulators must give the same results from
  `finish`, now and after the same values are reduced into each: reducing
  `first` then `second` gives what reducing `combine(first, second)`
  gives, and `initial(base)` gives what reducing `base` into
  `initial(undefined)` gives.
- Without `combine`, a composed recipe returns what it returned before.
  When no option or compound variant has values from several configs, it
  now compiles as one config too, and builds its results as fast.
- 1.3.0 said that a composed recipe is as fast as its one config. That
  holds for cached calls; a result built without the cache cost more when
  several configs gave values to one option or had a base. With
  `combine`, it costs what the one config costs.

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
