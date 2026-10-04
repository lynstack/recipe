---
title: class-recipe with TypeScript
description: "Type the props of a component from its recipe or slot recipe with VariantsOf, and learn which prop names class-recipe reserves for overrides."
sidebar:
  label: TypeScript
---

Use `VariantsOf` to type the props of a component from its recipe or slot
recipe.

```tsx
import { cva, type VariantsOf } from "@lynstack/class-recipe";
import type { ComponentProps } from "react";

const button = cva({
  base: "inline-flex rounded-md",
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});

type ButtonProps = ComponentProps<"button"> & VariantsOf<typeof button>;
// VariantsOf<typeof button> is
// { readonly tone: "neutral" | "danger"; readonly size?: "sm" | "md" | undefined }

export function Button({ tone, size, className, ...props }: ButtonProps) {
  return <button className={button({ tone, size, className })} {...props} />;
}
```

The names `className` and `classNames` are reserved and cannot be used as
variant names. The package also exports the types of every config, props
object, and recipe, such as `RecipeConfig` and `SlotRecipeProps`, for
code that builds on them.
