---
title: createStyleRecipe
description: "Create a style recipe that maps variants, compound variants, and default variants to the style of one React Native element, with types inferred from its config."
head:
  - tag: title
    content: "createStyleRecipe: React Native style recipes | lynstack recipe"
---

`createStyleRecipe` creates a style recipe, which returns the style of one
element for a selection of variants.

```ts
import { createStyleRecipe } from "@lynstack/native-recipe";

const badge = createStyleRecipe({
  // Applied whatever the variants.
  base: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8 },
  // For each variant, the style of each option.
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      success: { backgroundColor: "#dcfce7" },
      danger: { backgroundColor: "#fee2e2" },
    },
    outlined: {
      true: { borderColor: "#d1d5db", borderWidth: 1 },
    },
  },
});

badge({ tone: "success" });
// => { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8, backgroundColor: "#dcfce7" }

badge({ tone: "danger", outlined: true });
// => { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8, backgroundColor: "#fee2e2", borderColor: "#d1d5db", borderWidth: 1 }
```

Pass the result to the `style` prop of the element: `<View
style={badge({ tone })} />`.

## The config

| Property           | Description                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `base`             | Optional. The style the element always has.                                                      |
| `variants`         | For each variant name, the style of each of its options.                                         |
| `compoundVariants` | Optional. Styles added when several variants have particular options at the same time, in order. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                           |

Every style is checked against the styles of React Native, as in
`StyleSheet.create` (see [TypeScript](/recipe/native-recipe/typescript/)).

## The order of styles

A recipe merges `base`, then the style of each variant's option in the
order the config declares the variants, then the matching compound
variants. A later style overrides the properties of an earlier one, as
`StyleSheet.flatten` does.

```ts
const text = createStyleRecipe({
  base: { color: "#111827", fontSize: 16 },
  variants: {
    size: { sm: { fontSize: 14 }, lg: { fontSize: 20 } },
    muted: { true: { color: "#6b7280" } },
  },
});

text({ size: "sm", muted: true }); // => { color: "#6b7280", fontSize: 14 }
```

A property set to `undefined` is copied too, as in `StyleSheet.flatten`,
so it overrides an earlier value.

## The same style for the same variants

A recipe builds the style of each selection once, freezes it, and returns
that object whenever it is called with the same variants, including
variants left to their defaults.

```ts
badge({ tone: "success" }) === badge({ tone: "success" }); // => true
Object.isFrozen(badge({ tone: "success" })); // => true
```

The `style` prop of a component therefore keeps its identity between
renders. Create each recipe once, at the top level of a module, not inside
a component, so that its cache lasts (see
[How it works](/recipe/native-recipe/how-it-works/#stable-styles)).

## Required and default variants

A variant listed in `defaultVariants` may be omitted, and then uses its
default. A variant without a default is required, so a component cannot
forget to choose it. When every variant has a default, the argument itself
is optional.

```ts
const stack = createStyleRecipe({
  variants: {
    gap: { sm: { gap: 8 }, md: { gap: 16 } },
    direction: {
      row: { flexDirection: "row" },
      column: { flexDirection: "column" },
    },
  },
  defaultVariants: { gap: "md", direction: "column" },
});

stack(); // => { gap: 16, flexDirection: "column" }
stack({ direction: "row" }); // => { gap: 16, flexDirection: "row" }
stack({ gap: undefined }); // => { gap: 16, flexDirection: "column" }
```

## Boolean variants

A variant with an option named `"true"` or `"false"` also accepts the
booleans `true` and `false`, and declares the missing one of those two
options without a style. A variant whose only options are `"true"` and
`"false"` is optional and defaults to `false`.

```ts
const input = createStyleRecipe({
  base: { borderRadius: 6, borderWidth: 1 },
  variants: {
    invalid: {
      true: { borderColor: "#dc2626" },
      false: { borderColor: "#d1d5db" },
    },
    disabled: { true: { opacity: 0.5 } },
  },
});

input(); // => { borderRadius: 6, borderWidth: 1, borderColor: "#d1d5db" }
input({ invalid: true, disabled: true });
// => { borderRadius: 6, borderWidth: 1, borderColor: "#dc2626", opacity: 0.5 }
```

## Option names that are numbers

An option whose name is a number accepts that number as well as the
string:

```ts
const heading = createStyleRecipe({
  variants: { level: { 1: { fontSize: 32 }, 2: { fontSize: 24 } } },
});

heading({ level: 1 }); // => { fontSize: 32 }
heading({ level: "2" }); // => { fontSize: 24 }
```

## Compound variants

A compound variant adds its `style` when several variants have particular
options at the same time. For each variant it names, it gives one option
or a list of options; a variant it leaves out matches any option.

```ts
const button = createStyleRecipe({
  base: { borderRadius: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#dc2626" },
    },
    size: { sm: { height: 32 }, md: { height: 40 } },
    outlined: { true: { borderWidth: 1 } },
  },
  compoundVariants: [
    // When tone is danger and size is md.
    {
      variants: { tone: "danger", size: "md" },
      style: { paddingHorizontal: 20 },
    },
    // When tone is neutral and outlined is true, whatever the size.
    {
      variants: { tone: "neutral", outlined: true },
      style: { borderColor: "#d1d5db" },
    },
  ],
  defaultVariants: { size: "md" },
});

button({ tone: "danger" });
// => { borderRadius: 8, backgroundColor: "#dc2626", height: 40, paddingHorizontal: 20 }

button({ tone: "neutral", size: "sm", outlined: true });
// => { borderRadius: 8, backgroundColor: "#f3f4f6", height: 32, borderWidth: 1, borderColor: "#d1d5db" }
```

Conditions are checked after defaults are applied, which is why the first
call matches `size: "md"` without passing it. Matching compound variants
are applied in the order they are declared. A compound variant that names
an undeclared variant, or lists no declared option for one, never matches.

## Overriding styles

A recipe takes no style to add. Pass an override next to the recipe's
style, in a style array, only when there is one (see
[Building components](/recipe/native-recipe/building-components/#overriding-styles)).

## Undeclared options and other props

- The types accept only the options the config declares. A value from
  untyped data can still bypass them: an option that its variant does not
  declare adds no style, and its style is built on every call instead of
  being cached.
- Properties of the selection that are not variants are ignored, so a
  component can pass a recipe all of its props.
- Calling a recipe without a selection, or with `undefined` or `null`, is
  the same as calling it with an empty one.

## `variantKeys`

A recipe lists the names of its variants, in the order of `variants`, in
`variantKeys`, a frozen array typed with those names:

```ts
button.variantKeys; // => ["tone", "size", "outlined"]
```

Use it to split a component's props into the recipe's variants and the
rest (see [Building components](/recipe/native-recipe/building-components/)).
