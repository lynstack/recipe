# Changelog

All notable changes to `@lynstack/native-recipe`. Each version is
published on npm and as a
[GitHub release](https://github.com/lynstack/recipe/releases) tagged
`native-recipe@<version>`.

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
