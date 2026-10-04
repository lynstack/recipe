# class-recipe

[![npm](https://img.shields.io/npm/v/@lynstack/class-recipe)](https://www.npmjs.com/package/@lynstack/class-recipe)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@lynstack/class-recipe)](https://bundlephobia.com/package/@lynstack/class-recipe)
[![CI](https://github.com/lynstack/recipe/actions/workflows/ci-class-recipe.yml/badge.svg)](https://github.com/lynstack/recipe/actions/workflows/ci-class-recipe.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Fast, type-safe class name recipes for any CSS approach, with variants,
compound variants, slots, and a pluggable join function such as
`tailwind-merge`. It also includes `cx`, a drop-in replacement for `clsx`.

**[Read the documentation](https://lynstack.github.io/recipe/class-recipe/)**

## Installation

```sh
npm install @lynstack/class-recipe
```

## Usage

```ts
import { cva } from "@lynstack/class-recipe";

const button = cva({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    tone: {
      neutral: "bg-gray-100 text-gray-900",
      danger: "bg-red-600 text-white",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
    },
  },
  defaultVariants: { size: "md" },
});

button({ tone: "danger" });
// => "inline-flex items-center rounded-md font-medium bg-red-600 text-white h-10 px-4"
```

- [`cx`](https://lynstack.github.io/recipe/class-recipe/cx/) joins class
  names, like `clsx`.
- [`cva`](https://lynstack.github.io/recipe/class-recipe/cva/) maps
  variants to the class name of one element.
- [`sva`](https://lynstack.github.io/recipe/class-recipe/sva/) maps
  variants to the class names of several elements.
- [`createRecipes`](https://lynstack.github.io/recipe/class-recipe/tailwind-merge/)
  binds them to a join function such as `twMerge`.

## Agent skill

The package ships an agent skill that teaches coding agents to write
recipes whose classes never conflict. Install it with the
[skills](https://skills.sh) CLI:

```sh
npx skills add lynstack/recipe --skill class-recipe
```

See [Writing conflict-free recipes](https://lynstack.github.io/recipe/class-recipe/conflict-free-recipes/)
for other ways to use it.

## License

[MIT](LICENSE)
