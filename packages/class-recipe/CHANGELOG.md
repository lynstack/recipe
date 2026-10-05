# Changelog

All notable changes to `@lynstack/class-recipe`. Each version is published
on npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `class-recipe@<version>`.

## 1.2.0 — 2026-10-06

- `cva` and `sva` take `cache` in their config, which overrides the
  `cache` option of `createRecipes`. A recipe whose variants come from
  untrusted input, such as the requests of a server, can turn its cache
  off while the other recipes keep theirs, since a cache keeps up to one
  class name for each combination of declared options.
- `sva` keeps a slot or a variant named `__proto__`. It lost them before.
- A slot recipe whose variants are typed as `SlotRecipeVariants`, such as
  variants from a CMS, accepts literal slots and `classNames`. Its props
  take an option name or classes by slot for any property, since
  TypeScript cannot leave `classNames` out of an index signature.
- Depends on `@lynstack/recipe` through the range `^1.2.0` instead of an
  exact version, so an app that installs several of the packages shares
  one copy of it.

## 1.1.4 — 2026-10-05

- `sva` freezes the object it returns when `classNames` adds classes to a
  slot, as the docs promise. It returned a mutable object before.
- `sva` called with `classNames` is about 9% faster when `classNames` adds
  no classes, and about 10% faster when it adds classes to one or two
  slots.

## 1.1.3 — 2026-10-05

The public API and behavior are unchanged.

- `package.json` declares `main` as well as `exports`, for bundlers that
  read only `main`, such as the one of Expo Snack.
- Depends on `@lynstack/recipe` 1.1.2.

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
