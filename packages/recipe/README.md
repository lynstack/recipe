# @lynstack/recipe

[![npm](https://img.shields.io/npm/v/@lynstack/recipe)](https://www.npmjs.com/package/@lynstack/recipe)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@lynstack/recipe)](https://bundlephobia.com/package/@lynstack/recipe)
[![CI](https://github.com/lynstack/recipe/actions/workflows/ci-recipe.yml/badge.svg)](https://github.com/lynstack/recipe/actions/workflows/ci-recipe.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Fast, type-safe recipes for values of any type. Define a kind of recipe by
how it combines values, such as class names or style objects, then create
recipes of that kind: functions that map a component's variants to its
result.

**[Read the documentation](https://lynstack.github.io/recipe/recipe/)**

[`@lynstack/class-recipe`](https://www.npmjs.com/package/@lynstack/class-recipe)
and
[`@lynstack/native-recipe`](https://www.npmjs.com/package/@lynstack/native-recipe)
are built on it. Use `@lynstack/class-recipe` to style components with class
names, `@lynstack/native-recipe` to style React Native components, and this
package to create recipes for other values.

## Installation

```sh
npm install @lynstack/recipe
```

Requires TypeScript 5.4 or newer for its types, and Node.js 16.9, Bun 1.0,
Deno 2.0, or another ES2022 runtime. It ships as an ES module only.

## Usage

```ts
import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base?: Style): Style => ({ ...base }),
  reduce: (style, value: Style): Style => ({ ...style, ...value }),
  finish: (style): Style => Object.freeze(style),
});

const text = styleRecipe({
  base: { color: "black" },
  variants: {
    size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
    muted: { true: { opacity: 0.6 } },
  },
  compoundVariants: [
    { variants: { size: "lg", muted: true }, value: { fontWeight: 300 } },
  ],
  defaultVariants: { size: "sm" },
});

text(); // => { color: "black", fontSize: 12 }

text({ size: "lg", muted: true });
// => { color: "black", fontSize: 24, opacity: 0.6, fontWeight: 300 }
```

Pass the same kind to `createSlotRecipeKind` to create slot recipes, which
map variants to the results of several elements, such as a card's root and
title.

See [Recipe kinds](https://lynstack.github.io/recipe/recipe/recipe-kinds/)
for what each function of a kind does,
[Slot recipes](https://lynstack.github.io/recipe/recipe/slot-recipes/) for
slot recipes, and
the [Checklist](https://lynstack.github.io/recipe/recipe/practices/) for
how to write kinds, recipes, and libraries that stay fast and correct.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
