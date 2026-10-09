# Changelog

All notable changes to `@lynstack/recipe`. Each version is published on
npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `recipe@<version>`.

## Unreleased

### Added

- `InheritedSlot` and `InheritedDefaultedName`: the slots and the
  defaulted variants that a recipe inherits from the recipes it composes,
  for libraries that wrap composable recipes.
- `UnknownSlot`, the type that errors show for a slot a recipe does not
  declare.

## 1.8.1 — 2026-10-09

### Fixed

- Editors complete the variant names in `defaultVariants`, and the slot
  names in the options of a slot recipe.
- Editors, errors, and declarations show the values a variant accepts by
  name, such as `"sm" | "md"`, instead of `VariantOption<…>`.
- A slot that an option names without declaring it is reported as
  `UnknownSlot<"lable", "label" | "root">`, not as "not assignable to type
  'never'" on every slot of the option.

## 1.8.0 — 2026-10-08

### Added

- Creating a recipe warns once, with `console.warn`, about a default, a
  compound variant, or a slot that names something no config declares,
  which TypeScript misses in a config declared before the call.

### Fixed

- A function generic over the slot recipe it composes can name its own
  slots, and declarations print the slots of `base` and of compound
  variants by name.

## 1.7.0 — 2026-10-08

### Added

- `KindRecipeOf` and `KindSlotRecipeOf`, the types of the recipe of a
  config declared `as const`, to annotate exported recipes under
  `isolatedDeclarations`.
- `KindSelection`, so that a function generic over a config can return
  `KindRecipe<KindSelection<Variants, DefaultedName>, Result>`.

### Fixed

- A function generic over a config can return its recipe again, which
  failed since 1.3.0 while the names of its defaults were generic.
- The declaration of a composed slot recipe grows linearly with each level
  of composition, not about 2.4 times.

## 1.6.0 — 2026-10-07

### Added

- Creating a recipe checks the shape of its config and throws a
  `TypeError` that names the part to fix, such as a missing `variants` or
  a compound variant without `variants`.
- `NoUnknownSlots`, so that a library's slot recipe configs reject a slot
  that `slots` does not name.

### Fixed

- A compound variant without `variants` no longer matches every
  selection; it throws.

## 1.5.0 — 2026-10-07

### Added

- `variantOptions` and `defaultVariants` on every recipe: the options of
  each variant and the default each uses, as frozen, typed lists of names.

### Changed

- `KindRecipe` has these two properties, so a type that implements it by
  hand needs them too.

## 1.4.0 — 2026-10-07

### Added

- `combine(first, second)` on a recipe kind, optional: a recipe that
  composes others merges the values of its configs into one when it is
  created, so that it builds its results as fast as one config.
  `combine` must not change its arguments, and must give what reducing
  `first` then `second` gives.

### Changed

- A composed recipe without overlapping values compiles as one config,
  with or without `combine`.

## 1.3.0 — 2026-10-07

### Added

- `composes`: a recipe or slot recipe builds on other recipes of any kind
  whose values have its type, as if their configs and its own were one.
- Types for libraries built on the engine: `RecipeComposition`,
  `Composable`, `ComposableKindRecipe`, `ComposableKindSlotRecipe`,
  `ComposedVariants`, `ComposedDefaultedName`, and `ComposedSlot`.

### Changed

- `KindRecipe` takes an optional third type parameter, what the recipe
  passes on to the recipes that compose it.

## 1.2.0 — 2026-10-06

### Added

- `cache` in a recipe's config, which overrides the kind's, to turn off
  the cache of a recipe whose variants come from untrusted input.

### Fixed

- A slot recipe keeps a slot named `__proto__` in its result.

## 1.1.2 — 2026-10-05

### Fixed

- `package.json` declares `main`, for bundlers that ignore `exports`, such
  as the one of Expo Snack.

## 1.1.1 — 2026-10-05

### Fixed

- A recipe whose kind returns `undefined` caches that result.

## 1.1.0 — 2026-10-05

### Added

- `createSlotRecipeKind`, which creates slot recipes: a selection maps to
  the result of each of several slots.
- Types for slot recipes: `CreateKindSlotRecipe`, `KindSlotRecipeConfig`,
  `KindSlotVariants`, `KindSlotCompoundVariant`, and `SlotValues`.
- `VariantsOf`, the variants a recipe accepts, and `VariantKey`.

## 1.0.0 — 2026-10-04

First release.

### Added

- `createRecipeKind`, which defines a kind of recipe by how it reduces
  values, such as class names or style objects.
- Variants, compound variants, default variants, boolean variants,
  `variantKeys`, and a cache for each declared selection.
