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
functions from there:

```ts
// src/lib/recipe.ts
import { createRecipes } from "@lynstack/class-recipe";
import { twMerge } from "tailwind-merge";

export const { cx, cva, sva } = createRecipes({ join: twMerge });
```

## Options

| Option  | Description                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| `join`  | Optional. Combines the class strings of a selection into its class name, such as `twMerge`. Defaults to `cx`. |
| `cache` | Optional. Whether recipes cache the class names of each declared selection. Defaults to `true`.               |

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
