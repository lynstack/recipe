# Changelog

All notable changes to `@lynstack/class-recipe`. Each version is published
on npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `class-recipe@<version>`.

## 1.1.2 — 2026-10-05

The public API and behavior are unchanged.

- `sva` now builds on slot recipes of `@lynstack/recipe` 1.1.0, which it
  depends on. An uncached slot recipe is about 4% faster, and about 7%
  with a join such as `twMerge`; a cached one is unchanged.
- The docs are restructured, with a quick start, a page on how recipes
  cache and join their classes, a page for `createRecipes`, and a guide to
  building components. The README links to them.

## 1.1.1 — 2026-10-04

The public API and behavior are unchanged.

- class-recipe now builds its recipes on `@lynstack/recipe`, its one
  dependency, which creates recipes for values of any type.
- The repository moved to
  [lynstack/recipe](https://github.com/lynstack/recipe), and the docs to
  [lynstack.github.io/recipe/class-recipe](https://lynstack.github.io/recipe/class-recipe/).

## 1.1.0 — 2026-10-03

- Recipes and slot recipes list the names of their variants in
  `variantKeys`, a frozen array typed with those names. Use it to split a
  component's props into the recipe's variants and the rest.

  ```ts
  const button = cva({
    variants: {
      tone: { neutral: "bg-gray-100", danger: "bg-red-600" },
      size: { sm: "h-8", md: "h-10" },
    },
  });

  button.variantKeys; // => ["tone", "size"]
  ```

- The docs follow the updated lynstack design system.

## 1.0.0 — 2026-10-02

The first release of `@lynstack/class-recipe`.

- `cx` joins class names, as a drop-in replacement for `clsx`.
- `cva`, also exported as `createRecipe`, maps variants to the class name
  of one element.
- `sva`, also exported as `createSlotRecipe`, maps variants to the class
  names of several elements.
- `createRecipes` returns `cx` and the recipe creators bound to a custom
  join function, such as `twMerge`, or with the cache turned off.
