# @lynstack/native-recipe

[![npm](https://img.shields.io/npm/v/@lynstack/native-recipe)](https://www.npmjs.com/package/@lynstack/native-recipe)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@lynstack/native-recipe)](https://bundlephobia.com/package/@lynstack/native-recipe)
[![CI](https://github.com/lynstack/recipe/actions/workflows/ci-native-recipe.yml/badge.svg)](https://github.com/lynstack/recipe/actions/workflows/ci-native-recipe.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Fast, type-safe style recipes for React Native, with variants, compound
variants, slots, and theme tokens. A recipe returns the same frozen style
for the same variants, so the `style` prop keeps its identity between
renders.

**[Read the documentation](https://lynstack.github.io/recipe/native-recipe/)**

## Installation

```sh
npm install @lynstack/native-recipe
```

React Native 0.80 or later is a peer dependency.

## Usage

```ts
import { createSlotStyleRecipe } from "@lynstack/native-recipe";

const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: { root: { borderRadius: 8 }, label: { fontWeight: "600" } },
  variants: {
    tone: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        label: { color: "#ffffff" },
      },
      ghost: { label: { color: "#2563eb" } },
    },
    size: { sm: { root: { height: 32 } }, md: { root: { height: 40 } } },
  },
  defaultVariants: { tone: "primary", size: "md" },
});

const styles = button({ size: "sm" });
styles.root; // => { borderRadius: 8, backgroundColor: "#2563eb", height: 32 }
styles.label; // => { fontWeight: "600", color: "#ffffff" }

button({ size: "sm" }) === styles; // => true
```

Pass each style to the `style` prop of its element. See the
[Quick start](https://lynstack.github.io/recipe/native-recipe/quick-start/),
and [Themes and design tokens](https://lynstack.github.io/recipe/native-recipe/themes/)
to build styles from a light and a dark theme with `createThemedRecipes`.

## Agent skill

The package ships an agent skill that teaches coding agents to keep
styles stable and to build them from theme tokens. Install it with the
[skills](https://skills.sh) CLI:

```sh
npx skills add lynstack/recipe --skill native-recipe
```

See [Building components](https://lynstack.github.io/recipe/native-recipe/building-components/#agent-skill)
for other ways to use it.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
