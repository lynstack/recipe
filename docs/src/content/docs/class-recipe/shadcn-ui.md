---
title: Using class-recipe with shadcn/ui
description: "Use class-recipe in a shadcn/ui project: keep cn in lib/utils.ts, create cva and sva with tailwind-merge, and convert a generated button.tsx from class-variance-authority."
sidebar:
  label: Using with shadcn/ui
---

[shadcn/ui](https://ui.shadcn.com) copies components into your project.
They style their variants with class-variance-authority and merge classes
with a `cn` helper. class-recipe replaces both, and the components keep
their imports and their API.

## Keep `cn` in `lib/utils.ts`

shadcn/ui components import `cn` from `@/lib/utils`. Create `cn`, `cva`,
and `sva` there, with `twMerge` as the join, so that a `className` passed
to a component replaces the classes it conflicts with, as before:

```ts
// src/lib/utils.ts
import { createRecipes } from "@lynstack/class-recipe";
import { twMerge } from "tailwind-merge";

export const { cx: cn, cva, sva } = createRecipes({ join: twMerge });
```

The `cx` that `createRecipes` returns joins its inputs as `clsx` does,
then merges them, as the `cn` of shadcn/ui does. So every component that
imports `cn` keeps working, and you can remove `clsx` from your
dependencies once nothing else imports it.

With the [cn](https://github.com/shadcn-ui/cn) package, pass it as the
join under another name, since this module exports its own `cn`:

```ts
// src/lib/utils.ts
import { createRecipes } from "@lynstack/class-recipe";
import { cn as merge } from "cn";

export const { cx: cn, cva, sva } = createRecipes({ join: merge });
```

See [Merging classes](/recipe/class-recipe/tailwind-merge/) for which one
fits your version of Tailwind CSS.

## Convert a component

`npx shadcn add` generates components that import `cva` and
`VariantProps` from `class-variance-authority`. For each component:

1. Import `cva` from `@/lib/utils` instead.
2. Turn `cva(base, config)` into `cva({ base, ...config })`.
3. Replace `VariantProps` with `VariantsOf`, from `@lynstack/class-recipe`.
4. Pass `className` to the recipe, and drop the `cn` call around it. The
   recipe adds `className` last, and merges it with its join.

Here is a `button.tsx` before the change. The exact classes depend on
your version of shadcn/ui:

```tsx
// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

And after:

```tsx
// src/components/ui/button.tsx
import * as React from "react";
import type { VariantsOf } from "@lynstack/class-recipe";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "@/lib/utils";

const buttonVariants = cva({
  base: "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
      outline:
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantsOf<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

The component keeps its API: `variant`, `size`, `asChild` with `Slot`
from `@radix-ui/react-slot`, and the `buttonVariants` export, which other
components and links call, such as
`<a className={buttonVariants({ variant: "ghost" })}>`. Newer versions of
shadcn/ui import `Slot` from `radix-ui` instead; keep the import that your
component has.

Every variant of the button has a default, so its props stay optional. In
a component whose variant has no default, `VariantsOf` makes that variant
required, where `VariantProps` left it optional. Give it a default, or
pass it at every call (see
[Migrating from class-variance-authority](/recipe/class-recipe/migrating-from-cva/#a-variant-without-a-default-becomes-required)).

## Components with several elements

shadcn/ui marks each element of a component with a `data-slot` attribute,
such as `data-slot="card-header"`. A component whose elements share
variants can use one slot recipe for all of them, with `sva` from
`@/lib/utils`. Name its slots after those elements, and keep the
`data-slot` attributes, which your CSS and tests may select (see
[sva](/recipe/class-recipe/sva/)).

## When you add more components

`npx shadcn add` keeps generating imports from `class-variance-authority`.
Convert each new component as above. Until you do, it keeps working with
class-variance-authority, since the two libraries can live side by side.

## Next steps

- [Migrating from class-variance-authority](/recipe/class-recipe/migrating-from-cva/)
  lists the behaviors that change, and a test that checks a migrated
  recipe.
- [Building components](/recipe/class-recipe/building-components/) shows
  more component patterns.
- [Merging classes](/recipe/class-recipe/tailwind-merge/) explains what
  the join costs.
