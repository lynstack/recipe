---
title: recipe with TypeScript
description: "How recipes infer their selection from a config, which variants are required, how to type component props with VariantsOf, and the types that @lynstack/recipe exports."
sidebar:
  label: TypeScript
---

A recipe infers its selection from its config: an unknown option is a type
error, and a variant without a default is required. The package exports
the types of a kind, `RecipeKind`, of a recipe's config and of a recipe,
`KindRecipeConfig` and `KindRecipe`, and the types they are built from,
such as `VariantSelection` and `CompoundCondition`, for code that builds
on them.

## Typing component props

`VariantsOf` returns the variants a recipe accepts. Use it to type the
props of a component built on a recipe:

```ts
import { createRecipeKind, type VariantsOf } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base?: Style): Style => ({ ...base }),
  reduce: (style, value: Style): Style => ({ ...style, ...value }),
  finish: (style): Style => Object.freeze(style),
});

const box = styleRecipe({
  variants: { size: { sm: { padding: 4 }, md: { padding: 8 } } },
  defaultVariants: { size: "md" },
});

type BoxVariants = VariantsOf<typeof box>;
// => { readonly size?: "sm" | "md" | undefined }
```

A variant with a default, or a boolean variant, is optional; any other
variant is required. `VariantKey` names the variants of a selection as
strings, as a recipe's `variantKeys` lists them:
`VariantKey<BoxVariants>` is `"size"`.

A library that builds a kind of recipe can define its own `VariantsOf` on
this one, for example to leave out props that its recipes take besides
their variants, as `@lynstack/class-recipe` leaves out `className`.
