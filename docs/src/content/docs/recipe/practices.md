---
title: Checklist
description: "A checklist for code built on @lynstack/recipe: pure kinds, frozen results, recipes created once, overrides through the kind, and library types built on the engine's, each item linked to the page that explains it."
---

Each item is one rule. Its link leads to the page that explains it.

## Kinds

- Keep a kind pure: [the rules of a kind](/recipe/recipe/recipe-kinds/#the-rules-of-a-kind).
- Write its functions as plain functions, never as methods that read `this`: [how the engine calls a kind](/recipe/recipe/recipe-kinds/#how-the-engine-calls-a-kind).
- Never call a recipe from inside its own kind: [how the engine calls a kind](/recipe/recipe/recipe-kinds/#how-the-engine-calls-a-kind).
- Annotate the `value` of `reduce` or the `base` of `initial`: [types](/recipe/recipe/recipe-kinds/#types).
- Return a new accumulator from `initial`, and change only that: [change the accumulator in place](/recipe/recipe/designing-a-kind/#change-the-accumulator-in-place).
- Freeze an object result in `finish`: [shared results](/recipe/recipe/caching/#shared-results).
- Give a kind `combine` when two values can make one: [`combine`](/recipe/recipe/recipe-kinds/#combine).
- Do work that needs every value in `finish`: [collect, then finish](/recipe/recipe/designing-a-kind/#collect-then-finish).
- Test a kind as a cached recipe uses it: [test a kind](/recipe/recipe/designing-a-kind/#test-a-kind).

## Recipes

- Create kinds and recipes once, at the top level of a module: [Caching](/recipe/recipe/caching/).
- Put each value where it applies, in `base`, an option, or a compound variant: [Variants](/recipe/recipe/variants/).
- Give variants defaults: [required and default variants](/recipe/recipe/variants/#required-and-default-variants).
- Pass declared options only: [undeclared options](/recipe/recipe/variants/#undeclared-options-and-other-props).
- Keep the cache on, except for a kind that cannot be pure: [turning the cache off](/recipe/recipe/caching/#turning-the-cache-off).
- Turn the cache off for variants from untrusted input: [untrusted input](/recipe/recipe/caching/#variants-from-untrusted-input).
- Keep the product of each variant's options plus one within `Number.MAX_SAFE_INTEGER`: [the limit of the cache](/recipe/recipe/caching/#the-limit-of-the-cache).

## Libraries

- Translate configs when a recipe is created, never on each call: [translate the config once](/recipe/recipe/building-a-library/#translate-the-config-once).
- Apply an override through the kind, and only when it is passed: [Overrides](/recipe/recipe/building-a-library/#overrides).
- Type the library with the engine's types: [type the library's config](/recipe/recipe/building-a-library/#type-the-librarys-config).
- Keep `variantKeys`, `variantOptions`, and `defaultVariants` on each recipe: [Building a library](/recipe/recipe/building-a-library/#split-props-with-variantkeys).
- Re-export the types your users name: [API reference](/recipe/recipe/api/#types-for-library-authors).
- Pass `composes` on to the engine, and mark recipe types with `Composable`: [Making library recipes composable](/recipe/recipe/composable-libraries/).
