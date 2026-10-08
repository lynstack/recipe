---
title: Resolving conflicts with tailwind-merge
description: "Resolve conflicting Tailwind classes with a join function such as twMerge, which class-recipe runs once per selection rather than on every call."
sidebar:
  label: Merging classes
---

Do you need tailwind-merge? No, if your recipes are conflict-free (see
[Writing conflict-free recipes](/recipe/class-recipe/conflict-free-recipes/)).
Yes, if a `className` that a caller passes must replace the recipe's
classes.

With the default join, every class is kept: when two classes set the same
CSS property, such as `px-4` and `px-2`, the one defined later in the
stylesheet wins, whatever their order in the class name. A join function
such as `twMerge` resolves such conflicts instead: it keeps the last class
of each property.

## Set it up

Install `tailwind-merge`, then create the functions with
[`createRecipes`](/recipe/class-recipe/create-recipes/) once, in a module
of your own:

```ts
// src/lib/recipe.ts
import { createRecipes } from "@lynstack/class-recipe";
import { twMerge } from "tailwind-merge";

export const { cx, cva, sva } = createRecipes({ join: twMerge });
```

Import `cva`, `sva`, and `cx` from this module instead of from
`@lynstack/class-recipe`:

```ts
import { cva, cx } from "./lib/recipe";

const button = cva({
  base: "rounded-md px-4 py-2",
  variants: { size: { sm: "px-2 py-1", md: "" } },
});

button({ size: "sm", className: "px-3" });
cx("p-2", isLarge && "p-4");
```

Now `className`, `classNames`, and compound variants replace the classes
they conflict with. In the call above, `px-3` replaces the `px-2` of the
`sm` option, which itself replaces the `px-4` of `base`. When `isLarge` is
true, the `cx` call keeps only the last padding class.

With a project that keeps a `cn` helper in `src/lib/utils.ts`, as shadcn/ui
does, export the functions from there instead (see
[Using with shadcn/ui](/recipe/class-recipe/shadcn-ui/)).

## Using cn

[cn](https://github.com/shadcn-ui/cn), from the authors of shadcn/ui,
replaces `clsx` and `tailwind-merge` with a faster engine that merges
classes the same way. Pass `cn` itself as the join:

```ts
// src/lib/recipe.ts
import { createRecipes } from "@lynstack/class-recipe";
import { cn } from "cn";

export const { cx, cva, sva } = createRecipes({ join: cn });
```

The `cx` it returns replaces `cn` itself: it joins its inputs as `clsx`
does, then merges them.

Which merge library to use depends on your version of Tailwind CSS:

- **Tailwind CSS v4:** use `cn`, or tailwind-merge v3.
- **Tailwind CSS v3:** use tailwind-merge v2. `cn` and tailwind-merge v3
  support only Tailwind CSS v4.

For a custom theme with `cn`, pass the function that `createCn` from
`cn/config` returns.

## Custom theme or class groups

tailwind-merge knows the class groups and the theme of Tailwind CSS. When
your project adds its own, such as an `elevation-low` utility or a theme
key, tell tailwind-merge about them with `extendTailwindMerge`, and pass
the function it returns as the join:

```ts
// src/lib/recipe.ts
import { createRecipes } from "@lynstack/class-recipe";
import { extendTailwindMerge } from "tailwind-merge";

export const { cx, cva, sva } = createRecipes({
  join: extendTailwindMerge<"elevation">({
    extend: {
      classGroups: { elevation: ["elevation-low", "elevation-high"] },
    },
  }),
});
```

Give the names of the class groups that you add, and that tailwind-merge
does not define, as the first type argument, as `elevation` above. Give
the names of the theme keys that you add as the second. A group or a key
that tailwind-merge defines, such as `shadow` or `spacing`, needs none.
See the
[tailwind-merge docs](https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md)
for every setting.

## What it costs

`twMerge` is slow next to concatenating strings, but a recipe calls it
once for each declared selection and caches the result. Only a call that
passes `className` or `classNames`, or an undeclared option, calls it
again (see [How it works](/recipe/class-recipe/how-it-works/#the-join-function)).
The configured `cx` calls it on every call, after joining its inputs like
the default `cx`.

Since a recipe already caches its class names, a faster join, such as `cn`,
mostly speeds up the configured `cx` and the calls that pass `className`
or `classNames`.

## Next steps

- [Using with shadcn/ui](/recipe/class-recipe/shadcn-ui/) sets up the join
  in a shadcn/ui project.
- [Writing conflict-free recipes](/recipe/class-recipe/conflict-free-recipes/)
  avoids conflicts without a merge.
- [createRecipes](/recipe/class-recipe/create-recipes/) lists every
  option.
