# @lynstack/native-recipe

React Native style recipes on `@lynstack/recipe`. It exports
`createStyleRecipe`, which maps variants to the style of one element,
`createSlotStyleRecipe`, which maps variants to the styles of several
elements (slots), and `createThemedRecipes`, which returns both for
recipes whose styles are built from the tokens of a theme, such as a light
and a dark theme. A recipe returns the same frozen style for the same
variants, so that React Native's `style` prop keeps its identity between
renders.

The package imports only types from React Native, which is its peer
dependency and a development dependency for those types.

## Modules

- `style-recipe.ts`, `slot-style-recipe.ts`, `themed-recipes.ts`, and
  `types.ts` hold the public API and its types. `types.ts` checks styles
  against the `ViewStyle`, `TextStyle`, and `ImageStyle` types of React
  Native and re-exports the shared types of `@lynstack/recipe`.
- The other modules are internal, and use only the public API of
  `@lynstack/recipe`:
  - `compile-style-recipe.ts` and `compile-slot-style-recipe.ts` build the
    recipe functions with `createRecipeKind` and `createSlotRecipeKind`,
    on one kind that merges loose styles in place.
  - `compile-themed-recipe.ts` keeps the recipe of each theme object in a
    `WeakMap`, with the recipe of the last theme apart.

## Fixture

`fixtures/consumer` compiles with the settings of
`@react-native/typescript-config`, which React Native apps extend,
including `skipLibCheck`, since React Native's own declarations do not
compile without it.

## Skill

`skills/native-recipe/SKILL.md` is an agent skill that ships with the
package. It teaches agents to keep styles stable and to build styles from
theme tokens. It gives the same advice as the docs.
