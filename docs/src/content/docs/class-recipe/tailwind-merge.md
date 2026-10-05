---
title: Resolving conflicts with tailwind-merge
description: "Resolve conflicting Tailwind classes with a join function such as twMerge, which class-recipe runs once per selection rather than on every call."
---

With the default join, every class is kept: when two classes set the same
CSS property, such as `px-4` and `px-2`, the one defined later in the
stylesheet wins, whatever their order in the class name. You can avoid
such conflicts by design (see
[Writing conflict-free recipes](/recipe/class-recipe/conflict-free-recipes/)),
or resolve them with a join function such as `twMerge`, which keeps the
last class of each property.

Create the functions with it once, in a module of your own, with
[`createRecipes`](/recipe/class-recipe/create-recipes/):

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

Now `className`, `classNames`, and compound variants can replace the
classes they conflict with.

## What it costs

`twMerge` is slow next to concatenating strings, but a recipe calls it
once for each declared selection and caches the result. Only a call that
passes `className` or `classNames`, or an undeclared option, calls it
again (see [How it works](/recipe/class-recipe/how-it-works/#the-join-function)).
The configured `cx` calls it on every call, after joining its inputs like
the default `cx`.
