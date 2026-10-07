---
title: recipe with TypeScript
description: "How recipes infer their selection and result from a kind and a config, which variants are required, typing props with VariantsOf, and types for library authors."
sidebar:
  label: TypeScript
---

A recipe's types come from two places: the kind sets the type of its
values and its result, and the config sets the variants a selection
accepts.

## Types from the kind

`createRecipeKind` infers a kind's `Value` from the `value` parameter of
`reduce` or the `base` parameter of `initial`, and its result from
`finish`, or from `initial` without it (see
[Recipe kinds](/recipe/recipe/recipe-kinds/#types)). Every config of the
kind is checked against `Value`:

```ts
const text = styleRecipe({
  variants: {
    // @ts-expect-error: a style is an object, not a string.
    size: { sm: "small" },
  },
});
```

## Types from the config

A recipe infers its selection from its config:

- An option that a variant does not declare is a type error.
- A variant without a default is required; a variant with a default, or a
  boolean variant, is optional.
- A boolean variant accepts `true`, `false`, `"true"`, and `"false"`, and
  an option whose name is a number accepts the number and the string.
- A compound variant or a default that names an undeclared variant or
  option is a type error.

```ts
const button = styleRecipe({
  variants: {
    tone: { primary: { color: "white" }, neutral: { color: "black" } },
    size: { sm: { height: 32 }, lg: { height: 48 } },
  },
  defaultVariants: { size: "sm" },
});

button({ tone: "primary" });

// @ts-expect-error: tone has no default, so it is required.
button({ size: "lg" });
```

A config written inline is inferred as it is. Declare a config before the
call `as const`, so that the options named in its compound and default
variants stay literal types.

## Composed recipes

A recipe that composes others infers its selection from every config, and
its compound and default variants can name the variants of the recipes it
composes. Composing a recipe whose values have another type, or a slot
recipe in a recipe, is a type error (see
[Composing recipes](/recipe/recipe/composing/#types)).

## Typing component props

`VariantsOf` returns the variants a recipe accepts. Use it to type the
props of a component built on a recipe:

```ts
import type { VariantsOf } from "@lynstack/recipe";

type ButtonVariants = VariantsOf<typeof button>;
// => { readonly tone: "primary" | "neutral";
//      readonly size?: "sm" | "lg" | undefined }
```

`VariantKey` names the variants of a selection as strings, as a recipe's
`variantKeys` lists them: `VariantKey<ButtonVariants>` is
`"tone" | "size"`.

## Variant names not known in advance

When the variant names of a config are not known at compile time, as in a
function that passes on a config it received, a recipe accepts any
selection, compound condition, and default variants:

```ts
import type { KindVariants } from "@lynstack/recipe";

function createBox(variants: KindVariants<Style>) {
  return styleRecipe({ variants });
}

createBox({ size: { sm: { padding: 4 } } })({ size: "sm", other: 1 });
// => { padding: 4 }
```

## Types for library authors

A library with its own config shape builds its types on the engine's, as
[Building a library](/recipe/recipe/building-a-library/#type-the-librarys-config)
shows:

| Type                | Use it for                                                                           |
| ------------------- | ------------------------------------------------------------------------------------ |
| `KindVariants`      | The `variants` of a config, to constrain the variants a function infers.             |
| `VariantSelection`  | The selection a recipe accepts, from the variants and the names that have a default. |
| `DefaultVariants`   | The `defaultVariants` of a config.                                                   |
| `CompoundCondition` | The `variants` of a compound variant.                                                |
| `VariantOption`     | The values one variant accepts.                                                      |
| `RecipeFunction`    | A function whose argument is optional when every variant is.                         |
| `VariantKey`        | The names in `variantKeys`.                                                          |
| `VariantsOf`        | The variants a recipe accepts, which a library can define its own version of.        |
| `ComposedVariants`  | The variants of a config together with those of the recipes it composes.             |
| `Composable`        | The type of a library's recipe, marked so that other recipes can compose it.         |

A library can define its own `VariantsOf` to leave out the props its
recipes take besides their variants, as `@lynstack/class-recipe` leaves
out `className`. Slot recipes have their own config types,
`KindSlotRecipeConfig` and `KindSlotVariants`; see
[Exports](/recipe/recipe/exports/) for the full list.
