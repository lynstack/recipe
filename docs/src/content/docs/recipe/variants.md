---
title: Variants
description: "How a recipe's config resolves a selection: required and default variants, boolean variants, numeric option names, compound variants, and variantKeys."
---

A recipe's config declares its variants and the values they add. The
examples on this page use `styleRecipe` from the
[Quick start](/recipe/recipe/quick-start/).

## The config

| Property           | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `base`             | Optional. The value every selection starts from, passed to the kind's `initial`.                              |
| `variants`         | For each variant name, the value of each of its options.                                                      |
| `compoundVariants` | Optional. Values that apply when several variants have particular options at the same time, applied in order. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                                        |

## Required and default variants

A variant without a default is required: leaving it out of a selection is
a type error, and at runtime it adds no value. A variant with a default may
be left out or passed as `undefined`, and uses its default:

```ts
const text = styleRecipe({
  variants: {
    size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
    tone: { neutral: { color: "gray" }, danger: { color: "red" } },
  },
  defaultVariants: { size: "sm" },
});

text({ tone: "danger" }); // => { fontSize: 12, color: "red" }
text({ tone: "danger", size: undefined }); // => { fontSize: 12, color: "red" }
```

## Boolean variants

A variant whose only options are `"true"` and `"false"` is a boolean
variant. It is optional and defaults to `false`. A variant that declares
one of the two also declares the other, without a value, and accepts
`true` and `false` as well as the strings:

```ts
const field = styleRecipe({
  variants: {
    invalid: { true: { borderColor: "red" } },
  },
});

field(); // => {}
field({ invalid: true }); // => { borderColor: "red" }
field({ invalid: "true" }); // => { borderColor: "red" }
```

## Option names that are numbers

An option whose name is a number accepts that number as well as the
string:

```ts
const heading = styleRecipe({
  variants: { level: { 1: { fontSize: 32 }, 2: { fontSize: 24 } } },
});

heading({ level: 1 }); // => { fontSize: 32 }
heading({ level: "2" }); // => { fontSize: 24 }
```

## Compound variants

A compound variant adds its `value` when every variant it names has one of
the options it lists. A variant it leaves out matches any option, and a
list matches any of its options:

```ts
const button = styleRecipe({
  variants: {
    tone: {
      primary: { color: "white" },
      neutral: { color: "black" },
      ghost: { color: "gray" },
    },
    size: { sm: { height: 32 }, lg: { height: 48 } },
  },
  compoundVariants: [
    {
      variants: { tone: ["primary", "neutral"], size: "lg" },
      value: { fontWeight: 600 },
    },
  ],
  defaultVariants: { size: "sm" },
});

button({ tone: "neutral", size: "lg" });
// => { color: "black", height: 48, fontWeight: 600 }
button({ tone: "ghost", size: "lg" }); // => { color: "gray", height: 48 }
```

A compound condition matches against the selected options after defaults
are applied, so it can match a default variant, including the `false` of a
boolean variant. A compound variant that names an undeclared variant or
option never matches; its config is a type error.

Compound variants apply after the values of the options, in the order of
`compoundVariants`, so the kind can let them override the options.

## Undeclared options and other props

- An option that its variant does not declare adds no value. The selection
  is a type error, and its result is built on every call instead of being
  cached.
- Properties of the selection that are not variants are ignored, so a
  component can pass a recipe all of its props.
- Calling a recipe without a selection, or with `undefined` or `null`, is
  the same as calling it with an empty one.

## `variantKeys`

A recipe lists the names of its variants, in the order of `variants`, in
its `variantKeys` property. Use it to split a component's props into the
recipe's variants and the rest:

```ts
button.variantKeys; // => ["tone", "size"]
```
