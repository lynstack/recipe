# Changelog

All notable changes to `@lynstack/native-recipe`. Each version is
published on npm and as a
[GitHub release](https://github.com/lynstack/recipe/releases) tagged
`native-recipe@<version>`.

## Unreleased

- The recipe creators warn, once, with `console.warn`, about a default, a
  compound variant, or a style that names a variant, an option, or a slot
  that the config does not declare, such as a misspelled name in a config
  declared before the call or returned by a themed recipe's function,
  which TypeScript does not always report. Such a name still adds no
  style.

## 1.6.0 — 2026-10-08

A library of components can export and wrap its recipes: their
declarations compile under pnpm and with `isolatedDeclarations`, stay
small when slot recipes compose each other, and a function generic over a
config returns its recipe again.

- `StyleRecipeOf<Config, Composed>`, `SlotStyleRecipeOf`,
  `ThemedStyleRecipeOf`, and `ThemedSlotStyleRecipeOf` are the types that
  `createStyleRecipe`, `createSlotStyleRecipe`, and their themed forms
  return for a config declared `as const`, which annotate an exported
  recipe where `isolatedDeclarations` cannot infer the type of a call. A
  recipe that composes others lists their types as the second parameter.
- `RecipeComposition`, `ComposedSlot`, and `KindRecipe`, which
  `withTheme` returns, are exported. Since 1.2.0, the type of a recipe
  names them, and a module that exported a recipe and emitted
  declarations failed with TS2883 (TS2742 before TypeScript 7) in an app
  installed with pnpm, which cannot import `@lynstack/recipe`.
- `ComposableKindRecipe`, `ComposableKindSlotRecipe`, and
  `ComposedVariants` are exported, to type a function that takes a config
  that composes recipes.
- A function generic over a config returns the recipe of its config
  again, as a `StyleRecipe` or a `SlotStyleRecipe`, which failed with
  TS2322, and TS2590 for a slot recipe, since 1.2.0. One whose configs
  compose recipes returns the type of `createStyleRecipe` for its type
  parameters.
- The declaration of a slot recipe that composes others lists the names
  of its slots, instead of the types of the slot recipes it composes, so
  that it grows linearly with the level of composition. Before, it grew
  faster than linearly.
- Depends on `@lynstack/recipe` through the range `^1.7.0`.

## 1.5.0 — 2026-10-07

Runs with React Native 0.76 and later, and its types reject more configs
that never give a style.

- The peer dependency on React Native starts at 0.76, as in Expo SDK 52,
  instead of 0.80.
- The types reject an array of styles, or a number, as a style in a
  config, with every React Native version. Before, they passed the types
  with React Native 0.79 and earlier, and the number with every version,
  and threw only when the recipe was created.

## 1.4.0 — 2026-10-07

A config with the wrong shape fails with a message that names what is
wrong.

- Creating a style recipe or a slot style recipe, or the recipe of a
  theme, checks the styles of its config, which the types already check,
  so that a config from untyped code throws a `TypeError` that names the
  part to fix: a style that is not an object, something else than the
  style of each slot in a slot style recipe, or a compound variant
  without `style` or `styles`. Before, such a config gave wrong styles,
  ignored them, or threw an unrelated error.
- An option of a style recipe that is a number or a string, which the
  types accept but which never gave a style, now throws the same
  `TypeError`.
- Depends on `@lynstack/recipe` through the range `^1.6.0`.

## 1.3.0 — 2026-10-07

A recipe lists the options and defaults of its variants, so that a
library or a story can list every selection of a recipe without reading
its config.

- Style recipes, slot style recipes, and the recipe of each theme have
  `variantOptions`, the names of the options of each variant, as strings,
  in the order the recipe numbers them: integer names first, in ascending
  order, then `"false"` and `"true"`, which a variant that declares either
  one has, then the others in the order of the config.
- They have `defaultVariants`, the option each variant uses when the
  recipe is called without it, as a string: its default, or `"false"` for
  a variant whose only options are `"true"` and `"false"`. A variant
  without a default is not in it.
- Both are frozen and typed with the names of the options of each
  variant. A recipe that composes others lists the variants of the one
  config it stands for. They hold names only, never styles.
- Depends on `@lynstack/recipe` through the range `^1.5.0`, which adds
  them.

## 1.2.0 — 2026-10-07

A recipe can build on other recipes with `composes`.

- `createStyleRecipe` and `createSlotStyleRecipe` take `composes`, a list
  of recipes of the package whose configs they add to their own, as if
  written in one config: their base styles first, the style of each
  option in the order of the recipes, their compound variants first, and
  the last default given for each variant. The recipe accepts the
  variants of every recipe it composes, and its styles override theirs
  where they set the same property. A recipe composed several times
  counts once.
- A slot style recipe has the slots of the slot style recipes it
  composes, theirs first, and gives styles to any of them.
- A themed recipe composes the recipe of its theme: list
  `recipe.withTheme(theme)` in `composes`, with the theme its config
  function receives.
- A composed recipe merges the styles that several recipes give one
  option into one style when it is created, and builds its styles as fast
  as the one config it stands for, with or without the cache.
- The style a composed recipe returns has the properties of every recipe
  it composes, with their types. `StyleRecipe`, `SlotStyleRecipe`, and
  `ThemedRecipe` take what they pass on to the recipes that compose them
  as an optional type parameter.
- The agent skill teaches to compose a shared recipe rather than copy its
  config.
- Depends on `@lynstack/recipe` through the range `^1.4.0`.

## 1.1.0 — 2026-10-06

- `createStyleRecipe` and `createSlotStyleRecipe` take `cache` in their
  config, also through `createThemedRecipes`. Without the cache, a recipe
  returns a new style on every call, which changes the `style` prop on
  every render, so leave it on unless a recipe's variants come from
  untrusted input.
- A slot style recipe whose variants are typed as
  `SlotStyleRecipeVariants`, such as variants from a CMS, accepts literal
  slots.
- A slot style recipe keeps a slot named `__proto__` in its result.
- The README states the requirements: React Native 0.80 or newer (Expo
  SDK 54 or newer), and TypeScript 5.4 or newer for the types.
- Depends on `@lynstack/recipe` through the range `^1.2.0` instead of an
  exact version, so an app that installs several of the packages shares
  one copy of it.

## 1.0.2 — 2026-10-05

The public API and behavior are unchanged.

- `package.json` declares `main` as well as `exports`, for bundlers that
  read only `main`, such as the one of Expo Snack, which can now install
  it.
- Depends on `@lynstack/recipe` 1.1.2.

## 1.0.1 — 2026-10-05

- Depends on `@lynstack/recipe` 1.1.0. Version 1.0.0 was published with
  the dependency `workspace:*`, so no package manager could install it.
  The code is unchanged.

## 1.0.0 — 2026-10-05

Deprecated: it cannot be installed. Use 1.0.1.

The first release of `@lynstack/native-recipe`, which maps a component's
variants to its React Native styles.

- `createStyleRecipe` maps variants to the style of one element.
- `createSlotStyleRecipe` maps variants to the styles of several elements.
- `createThemedRecipes` returns both, for recipes whose styles are built
  from the tokens of a theme, such as a light and a dark theme.
- A recipe returns the same frozen style for the same variants, so that
  the `style` prop keeps its identity between renders.
- Styles are checked against the `ViewStyle`, `TextStyle`, and
  `ImageStyle` types of React Native, a peer dependency for its types
  only.
- An agent skill ships in the package and teaches coding agents to keep
  styles stable and to build them from theme tokens.
