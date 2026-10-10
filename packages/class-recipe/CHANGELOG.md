# Changelog

All notable changes to `@lynstack/class-recipe`. Each version is published
on npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `class-recipe@<version>`.

## 1.7.3 — 2026-10-10

### Fixed

- A function that returns a recipe of `cva` or `sva` without a return type,
  such as a library's helper, emits declarations that compile without
  `skipLibCheck`; declarations name `Recipe` and `SlotRecipe`, and are
  smaller.

## 1.7.2 — 2026-10-09

### Changed

- Requires `@lynstack/recipe` `^1.9.0`.

## 1.7.1 — 2026-10-09

### Fixed

- Editors complete the variant names in `defaultVariants` of `cva` and
  `sva`, and the slot names in the options of an `sva` recipe.
- Editors, errors, and declarations show the values a variant accepts by
  name, such as `"sm" | "md"`, instead of `VariantOption<…>`.
- A slot that an option names without declaring it is reported as
  `UnknownSlot<"lable", "label" | "root">`, not as "not assignable to type
  'never'".

## 1.7.0 — 2026-10-08

### Added

- `cva` and `sva` warn once, with `console.warn`, about a default, a
  compound variant, or classes that name something the config does not
  declare, which TypeScript misses in a config declared before the call.

### Fixed

- A function generic over the slot recipe it composes can name its own
  slots, and declarations print the classes of each slot as
  `SlotClasses<…>`.

### Changed

- Requires `@lynstack/recipe` `^1.8.0`.

## 1.6.0 — 2026-10-08

### Added

- `RecipeOf` and `SlotRecipeOf`, the types that `cva` and `sva` return for
  a config declared `as const`, to annotate exported recipes under
  `isolatedDeclarations`.
- `ComposableKindRecipe`, `ComposableKindSlotRecipe`, and
  `ComposedVariants`, to type a function whose configs compose recipes.

### Fixed

- A module that exports a recipe emits declarations under pnpm: it failed
  with TS2883 (TS2742 before TypeScript 7) since 1.3.0. `RecipeComposition`
  and `ComposedSlot` are now exported.
- A function generic over a config can return its recipe again, which
  failed since 1.3.0.
- The declaration of a composed slot recipe grows linearly with each level
  of composition, not about 3.3 times.

### Changed

- Requires `@lynstack/recipe` `^1.7.0`.

## 1.5.0 — 2026-10-07

### Added

- Creating a recipe checks the classes of its config and throws a
  `TypeError` that names the part to fix, such as classes in an array, a
  string where `sva` takes classes by slot, a compound variant without
  `variants` or `className`, or `class` instead of `className`.
- `PropsOf<typeof recipe>`, the props a recipe accepts: its variants and
  its `className` or `classNames`.

### Changed

- Requires `@lynstack/recipe` `^1.6.0`.

## 1.4.0 — 2026-10-07

### Added

- `variantOptions` and `defaultVariants` on `cva` and `sva` recipes: the
  options of each variant and the default each uses, as frozen, typed
  lists of names.

### Changed

- `Recipe` and `SlotRecipe` have these two properties, so a type that
  implements them by hand needs them too.
- Requires `@lynstack/recipe` `^1.5.0`.

## 1.3.0 — 2026-10-07

### Added

- `composes`: `cva` and `sva` build on other recipes of the package, as if
  their configs and its own were one. A composed recipe is as fast as one
  config.
- `Recipe` and `SlotRecipe` take an optional type parameter, what the
  recipe passes on to the recipes that compose it.

### Changed

- A join passed to `createRecipes` must return the same class name however
  the classes are split into strings, as `cx` and `twMerge` do.
- Requires `@lynstack/recipe` `^1.4.0`.

## 1.2.0 — 2026-10-06

### Added

- `cache` in the config of `cva` and `sva`, which overrides that of
  `createRecipes`, to turn off the cache of a recipe whose variants come
  from untrusted input.

### Fixed

- `sva` keeps a slot or a variant named `__proto__`.
- A slot recipe whose variants are typed `SlotRecipeVariants` accepts
  literal slots and `classNames`.

### Changed

- Requires `@lynstack/recipe` through the range `^1.2.0`, so that an app
  shares one copy of it between the packages.

## 1.1.4 — 2026-10-05

### Fixed

- `sva` freezes the object it returns when `classNames` adds classes.
- `sva` with `classNames` is about 9–10% faster.

## 1.1.3 — 2026-10-05

### Fixed

- `package.json` declares `main`, for bundlers that ignore `exports`, such
  as the one of Expo Snack.

## 1.1.2 — 2026-10-05

### Changed

- `sva` builds on the slot recipes of `@lynstack/recipe` 1.1.0. An
  uncached slot recipe is about 4% faster.

## 1.1.1 — 2026-10-04

### Changed

- Recipes are built on `@lynstack/recipe`, the package's one dependency.
  The API and behavior are unchanged.

## 1.1.0 — 2026-10-03

### Added

- `variantKeys` on recipes and slot recipes: the names of their variants,
  to split a component's props.

## 1.0.0 — 2026-10-02

First release.

### Added

- `cx`, which joins class names.
- `cva` (also `createRecipe`), which maps variants to the class name of
  one element.
- `sva` (also `createSlotRecipe`), which maps variants to the class names
  of several elements.
- `createRecipes`, which binds the recipe creators to a join function,
  such as `twMerge`, or turns off the cache.
