---
title: createRecipes
description: "Create cx, cva, and sva with a join function such as twMerge, or with the cache turned off, once in a module of your own."
head:
  - tag: title
    content: "createRecipes: recipes with tailwind-merge | lynstack recipe"
---

`createRecipes` returns `cx`, `cva`, and `sva` that combine their classes
with a join function of your choice, or whose recipes do not cache their
class names. Call it once, in a module of your own, and import the
functions from there.

```ts
createRecipes(options?: RecipesOptions): Recipes
```

The most common use is to merge Tailwind CSS classes with `twMerge`.
[Merging classes](/recipe/class-recipe/tailwind-merge/) shows that setup.

## Options

| Option  | Description                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `join`  | Optional. Combines the class strings of a selection into its class name, such as `twMerge` from tailwind-merge or [cn](/recipe/class-recipe/tailwind-merge/#using-cn). Defaults to `cx`. |
| `cache` | Optional. Whether recipes cache the class names of each declared selection. Defaults to `true`.                                                                                          |

## What it returns

| Function           | Description                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `cx`               | Joins class names like the default `cx`, then passes the result to `join`, unless it is empty. |
| `cva`              | Creates recipes with the `join` and `cache` options.                                           |
| `sva`              | Creates slot recipes with the `join` and `cache` options.                                      |
| `createRecipe`     | The same function as `cva`.                                                                    |
| `createSlotRecipe` | The same function as `sva`.                                                                    |

Without options, it returns the functions the package exports.

## The join function

A join function receives the class strings in order of precedence, lowest
first, and returns the class name: any
`(...classNames: readonly string[]) => string` works. It always receives at
least one class string, and never an empty one. A recipe calls it once for
each declared selection and caches the result, then again for each call
that passes `className` or `classNames`, or an undeclared option (see
[How it works](/recipe/class-recipe/how-it-works/#the-join-function)).

A class string may hold several classes, separated by spaces, and the join
must return the same class name however the classes are split into class
strings, as `cx` and `twMerge` do: a recipe passes the class name it cached
as one class string, and a recipe that composes others passes the classes
that several recipes give one option as one class string.

## Turning off the cache

Pass `cache: false` to build the class names on every call instead, alone
or together with `join`:

```ts
export const { cx, cva, sva } = createRecipes({ cache: false });
```

Without the cache, a slot recipe returns a new object on every call, even
for the same variants. Keep the cache unless you have measured that a
recipe is called with so many different selections, each only once, that
storing them costs more than building them.

To turn the cache off for one recipe only, pass `cache: false` in its
config instead (see [cva](/recipe/class-recipe/cva/)). The `cache` of a
recipe's config overrides the option of `createRecipes`, so a recipe whose
config sets `cache: true` caches its class names even when the option
turns the cache off.

## Variants from untrusted input

This section moved to
[How it works](/recipe/class-recipe/how-it-works/#variants-from-untrusted-input).
