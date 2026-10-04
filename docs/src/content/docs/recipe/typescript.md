---
title: recipe with TypeScript
description: "How recipes infer their selection from a config, which variants are required, and the types that @lynstack/recipe exports to name them."
sidebar:
  label: TypeScript
---

A recipe infers its selection from its config: an unknown option is a type
error, and a variant without a default is required. The package exports
the types of a kind, `RecipeKind`, of a recipe's config and of a recipe,
`KindRecipeConfig` and `KindRecipe`, and the types they are built from,
such as `VariantSelection` and `CompoundCondition`, for code that builds
on them.
