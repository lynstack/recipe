# Changelog

All notable changes to `@lynstack/class-recipe`. Each version is published
on npm and as a [GitHub release](https://github.com/lynstack/recipe/releases)
tagged `class-recipe@<version>`.

## 1.6.0 — 2026-10-08

A library of components can export and wrap its recipes: their
declarations compile under pnpm and with `isolatedDeclarations`, stay
small when slot recipes compose each other, and a function generic over a
config returns its recipe again.

- `RecipeOf<Config, Composed>` and `SlotRecipeOf` are the types that
  `cva` and `sva` return for a config declared `as const`, which annotate
  an exported recipe where `isolatedDeclarations` cannot infer the type
  of a call. A recipe that composes others lists their types as the
  second parameter.
- `RecipeComposition` and `ComposedSlot` are exported. Since 1.3.0, the
  type of a recipe names them, and a module that exported a recipe and
  emitted declarations failed with TS2883 (TS2742 before TypeScript 7)
  in an app installed with pnpm, which cannot import `@lynstack/recipe`.
- `ComposableKindRecipe`, `ComposableKindSlotRecipe`, and
  `ComposedVariants` are exported, to type a function that takes a config
  that composes recipes.
- A function generic over a config returns the recipe of its config
  again, as a `Recipe<RecipeProps<Variants, DefaultedName>>` or a
  `SlotRecipe`, which failed with TS2322, and TS2590 for a slot recipe,
  since 1.3.0. One whose configs compose recipes returns
  `ReturnType<typeof cva<Variants, DefaultedName, Composed>>`, or that of
  `sva`.
- The declaration of a slot recipe that composes others lists the names
  of its slots, instead of the types of the slot recipes it composes, so
  that it grows linearly with the level of composition. Before, it grew
  about 3.3 times with each level: five levels of a small slot recipe
  took 1 MB.
- Depends on `@lynstack/recipe` through the range `^1.7.0`.

## 1.5.0 — 2026-10-07

A config with the wrong shape fails with a message that names what is
wrong, and `PropsOf` types the props a recipe accepts.

- Creating a recipe or a slot recipe checks the classes of its config,
  which the types already check, so that a config from untyped code, such
  as one written for class-variance-authority or tailwind-variants,
  throws a `TypeError` that names the part to fix: classes that are not a
  string, such as an array, `false`, or `null`; in `sva`, a string where
  it takes the classes of each slot; or a compound variant without
  `className` or `classNames`. A compound variant with `class` asks you to
  rename it. Before, such a config returned wrong class names, ignored
  the classes, or threw an unrelated error.
- `PropsOf<typeof recipe>` is the props a recipe or slot recipe accepts:
  its variants, and its `className` or `classNames` override.
- Depends on `@lynstack/recipe` through the range `^1.6.0`.

## 1.4.0 — 2026-10-07

A recipe lists the options and defaults of its variants, so that a
library or a story can list every selection of a recipe without reading
its config.

- `cva` and `sva` recipes have `variantOptions`, the names of the options
  of each variant, as strings, in the order the recipe numbers them:
  integer names first, in ascending order, then `"false"` and `"true"`,
  which a variant that declares either one has, then the others in the
  order of the config.
- They have `defaultVariants`, the option each variant uses when the
  recipe is called without it, as a string: its default, or `"false"` for
  a variant whose only options are `"true"` and `"false"`. A variant
  without a default is not in it.
- Both are frozen and typed with the names of the options of each
  variant, without `className` or `classNames`. A recipe that composes
  others lists the variants of the one config it stands for. They hold
  names only, never classes.
- `Recipe` and `SlotRecipe` have the two properties, so a type that
  implements them by hand needs them too.
- Depends on `@lynstack/recipe` through the range `^1.5.0`.

## 1.3.0 — 2026-10-07

A recipe can build on other recipes with `composes`.

- `cva` and `sva` take `composes`, a list of recipes of the package whose
  configs they add to their own, as if written in one config: their base
  classes first, the classes of each option in the order of the recipes,
  their compound variants first, and the last default given for each
  variant. The recipe accepts the variants of every recipe it composes. A
  recipe composed several times counts once.
- A slot recipe has the slots of the slot recipes it composes, theirs
  first, gives classes to any of them, and adds `classNames` to each.
- A recipe of `createRecipes` composes any recipe of the package and
  joins the classes with its own join.
- A composed recipe joins the classes that several recipes give one
  option into one string when it is created, and builds its class names
  as fast as the one config it stands for, with or without the cache.
- A join passed to `createRecipes` must return the same class name however
  the classes are split into class strings, as `cx` and `twMerge` do. A
  recipe already passed its cached class name to the join as one string
  with `className`; a composed recipe also passes the classes of an option
  that several recipes give as one string.
- `Recipe` and `SlotRecipe` take what they pass on to the recipes that
  compose them as an optional type parameter.
- The docs migrate `extend` of tailwind-variants to `composes`, and the
  agent skill teaches to compose a shared recipe rather than copy its
  config, and not to set again a property that it sets.
- Depends on `@lynstack/recipe` through the range `^1.4.0`.

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
