---
title: TypeScript
description: Types that recipes infer, and the types the package exports.
---

A recipe infers its selection from its config: an unknown option is a type
error, and a variant without a default is required. The package exports
the types of a kind, `RecipeKind`, of a recipe's config and of a recipe,
`KindRecipeConfig` and `KindRecipe`, and the types they are built from,
such as `VariantSelection` and `CompoundCondition`, for code that builds
on them.
