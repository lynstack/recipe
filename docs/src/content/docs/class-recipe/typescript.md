---
title: class-recipe with TypeScript
description: "How recipes infer their props from a config, which variants are required, how to type component props with VariantsOf, and which prop names class-recipe reserves."
sidebar:
  label: TypeScript
---

A recipe infers the props it accepts from its config:

- An option that a variant does not declare is a type error.
- A variant without a default is required; a variant with a default, or a
  boolean variant, is optional.
- A boolean variant accepts `true`, `false`, `"true"`, and `"false"`, and
  an option whose name is a number accepts the number and the string.
- A compound variant or a default that names an undeclared variant or
  option is a type error, and so is a slot that `slots` does not name.

```ts
import { cva } from "@lynstack/class-recipe";

const button = cva({
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});

button({ tone: "danger" });

// @ts-expect-error: tone has no default, so it is required.
button({ size: "sm" });
```

A config written inline is inferred as it is. Declare a config before the
call `as const`, so that the options named in its compound and default
variants stay literal types.

## Typing component props

`VariantsOf` returns the variants a recipe or slot recipe accepts, without
`className` or `classNames`:

```ts
import type { VariantsOf } from "@lynstack/class-recipe";

type ButtonVariants = VariantsOf<typeof button>;
// => { readonly tone: "neutral" | "danger";
//      readonly size?: "sm" | "md" | undefined }
```

See [Building components](/recipe/class-recipe/building-components/) for
using it in a component.

## Reserved names

`className` and `classNames` are the names of the overrides, so they
cannot be variant names: a config that declares either is a type error.

## Other types

The package exports the types of every config, props object, and recipe,
such as `RecipeConfig` and `SlotRecipeProps`, for code that builds on
them; see [Exports](/recipe/class-recipe/exports/). For a library of
recipes of other values, build on the types of
[`@lynstack/recipe`](/recipe/recipe/typescript/).
