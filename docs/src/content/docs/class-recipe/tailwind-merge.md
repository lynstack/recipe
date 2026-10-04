---
title: Resolving conflicts with tailwind-merge
description: Resolve conflicting classes with a join function such as twMerge.
---

To resolve conflicting classes, such as `px-4` and `px-2`, rather than
avoid them, create the functions with a join function of your choice,
once, in a module of your own:

```ts
// src/lib/recipe.ts
import { createRecipes } from "@lynstack/class-recipe";
import { twMerge } from "tailwind-merge";

export const { cx, cva, sva } = createRecipes({ join: twMerge });
```

```ts
import { cva, cx } from "./lib/recipe";

const button = cva({
  base: "rounded-md px-4 py-2",
  variants: { size: { sm: "px-2 py-1", md: "" } },
});

button({ size: "sm", className: "px-3" }); // => "rounded-md py-1 px-3"
cx("p-2", isLarge && "p-4"); // => "p-4" when isLarge is true
```

A join function receives the class strings in order of precedence, lowest
first, and returns the final class name: any
`(...classNames: readonly string[]) => string` works. It always receives at
least one class string, and never an empty one. A recipe calls it once for
each declared selection of variants and caches the result, then again for
each call that passes `className` or `classNames`, or an undeclared option.
The configured `cx` first joins its inputs like the default `cx`, then
passes the result to the join function. `createRecipes` also returns
`createRecipe` and `createSlotRecipe`, the same functions as the `cva` and
`sva` it returns.

## Turning off the cache

Recipes cache the class names of each declared selection of variants (see
[Performance](/recipe/class-recipe/performance/)). Pass `cache: false` to build them on every
call instead, alone or together with `join`:

```ts
export const { cx, cva, sva } = createRecipes({ cache: false });
```

Without the cache, a slot recipe returns a new object on every call, even
for the same variants.
