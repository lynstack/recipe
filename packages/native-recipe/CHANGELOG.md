# Changelog

All notable changes to `@lynstack/native-recipe`. Each version is
published on npm and as a
[GitHub release](https://github.com/lynstack/recipe/releases) tagged
`native-recipe@<version>`.

## Unreleased

### Changed

- Declarations of recipes name `StyleRecipe`, `SlotStyleRecipe`, and
  `ThemedRecipe`, and are smaller, also for a function that returns a
  recipe without a return type.

## 1.8.0 — 2026-10-09

### Added

- `themeToken`, returned by `createThemedRecipes`: a config function reads
  the theme from it and takes no parameter, as in
  `createStyleRecipe(() => ({ base: { gap: themeToken.gap } }))`, and
  editors complete the config even while it has an error. Reading it
  outside a config function throws a `TypeError`.

### Changed

- Requires `@lynstack/recipe` `^1.9.0`.

### Fixed

- Themed recipes reject a style value that the property does not take,
  such as `fontWeight: 650` or `textAlign: "middle"`, in `base` and in
  options, as plain recipes do.
- A config declared `as const` rejects a wrong text or image value in an
  option, such as `textAlign: "middle"`.
- A base style that mixes view and text properties is checked as a text
  style.
- Editors complete the variant names and slots of compound variants in
  themed recipes.
- An unknown style property or slot in a compound variant is reported at
  the property, not on `compoundVariants`.

## 1.7.1 — 2026-10-09

### Fixed

- Editors complete compound variants, `defaultVariants`, and the slots and
  style properties of a slot style recipe's `base` and options.
- Themed recipes reject a wrong style value in a compound variant, such as
  `flexDirection: "sideways"`.
- Editors, errors, and declarations show the values a variant accepts by
  name, such as `"sm" | "md"`, instead of `VariantOption<…>`.
- A slot that `base` or an option names without declaring it is reported
  as `UnknownSlot<"lable", "label" | "root">`, not as "not assignable to
  type 'never'".

## 1.7.0 — 2026-10-08

### Added

- The recipe creators warn once, with `console.warn`, about a default, a
  compound variant, or a style that names something the config does not
  declare, which TypeScript misses in a config declared before the call or
  returned by a themed recipe's function.

### Fixed

- A slot style recipe accepts styles whose slot names are not known at
  compile time, such as `SlotStyles<string>`, in `base` and in compound
  variants.
- A function generic over the slot recipe it composes can name its own
  slots.
- A function generic over the recipe a themed recipe composes compiles on
  TypeScript 5.4 to 5.8.
- The declaration of a themed slot recipe annotated with
  `ThemedSlotStyleRecipeOf` grows linearly with each level of composition.

### Changed

- Requires `@lynstack/recipe` `^1.8.0`.

## 1.6.0 — 2026-10-08

### Added

- `StyleRecipeOf`, `SlotStyleRecipeOf`, `ThemedStyleRecipeOf`, and
  `ThemedSlotStyleRecipeOf`, the types of the recipe of a config declared
  `as const`, to annotate exported recipes under `isolatedDeclarations`.
- `ComposableKindRecipe`, `ComposableKindSlotRecipe`, and
  `ComposedVariants`, to type a function whose configs compose recipes.

### Fixed

- A module that exports a recipe emits declarations under pnpm: it failed
  with TS2883 (TS2742 before TypeScript 7) since 1.2.0.
  `RecipeComposition`, `ComposedSlot`, and `KindRecipe` are now exported.
- A function generic over a config can return its recipe again, which
  failed since 1.2.0.
- The declaration of a composed slot recipe grows linearly with each level
  of composition.

### Changed

- Requires `@lynstack/recipe` `^1.7.0`.

## 1.5.0 — 2026-10-07

### Changed

- Requires React Native 0.76 or newer (Expo SDK 52), instead of 0.80.

### Fixed

- The types reject an array of styles, or a number, as a style, with
  every React Native version.

## 1.4.0 — 2026-10-07

### Added

- Creating a recipe checks the styles of its config and throws a
  `TypeError` that names the part to fix, such as a style that is not an
  object, or a compound variant without `style` or `styles`.

### Changed

- An option that is a number or a string, which never gave a style, now
  throws that `TypeError`.
- Requires `@lynstack/recipe` `^1.6.0`.

## 1.3.0 — 2026-10-07

### Added

- `variantOptions` and `defaultVariants` on every recipe: the options of
  each variant and the default each uses, as frozen, typed lists of names.

### Changed

- Requires `@lynstack/recipe` `^1.5.0`.

## 1.2.0 — 2026-10-07

### Added

- `composes`: a recipe builds on other recipes of the package, as if
  their configs and its own were one, and returns the properties of each.
  A themed recipe composes `recipe.withTheme(theme)`. A composed recipe is
  as fast as one config.
- `StyleRecipe`, `SlotStyleRecipe`, and `ThemedRecipe` take an optional
  type parameter, what the recipe passes on to the recipes that compose
  it.

### Changed

- Requires `@lynstack/recipe` `^1.4.0`.

## 1.1.0 — 2026-10-06

### Added

- `cache` in a recipe's config, also through `createThemedRecipes`, to
  turn off the cache of a recipe whose variants come from untrusted input.

### Fixed

- A slot style recipe whose variants are typed `SlotStyleRecipeVariants`
  accepts literal slots.
- A slot style recipe keeps a slot named `__proto__`.

### Changed

- Requires `@lynstack/recipe` through the range `^1.2.0`, so that an app
  shares one copy of it between the packages.

## 1.0.2 — 2026-10-05

### Fixed

- `package.json` declares `main`, for bundlers that ignore `exports`, such
  as the one of Expo Snack.

## 1.0.1 — 2026-10-05

### Fixed

- Installs: 1.0.0 was published with the dependency `workspace:*`.

## 1.0.0 — 2026-10-05

Deprecated: it cannot be installed. Use 1.0.1.

### Added

- `createStyleRecipe`, which maps variants to the style of one element.
- `createSlotStyleRecipe`, which maps variants to the styles of several
  elements.
- `createThemedRecipes`, which returns both for recipes built from the
  tokens of a theme.
- The same frozen style for the same variants, so that the `style` prop
  keeps its identity between renders.
- Styles checked against React Native's `ViewStyle`, `TextStyle`, and
  `ImageStyle`.
- An agent skill that teaches coding agents to keep styles stable and to
  build them from theme tokens.
