---
title: createSlotStyleRecipe
description: "Create a slot style recipe that maps variants to the styles of several React Native elements of a component, such as a card's container, title, and body."
head:
  - tag: title
    content: "createSlotStyleRecipe: React Native slot styles | lynstack recipe"
---

`createSlotStyleRecipe` creates a slot style recipe, which returns the
style of each element of a component, its slots, for a selection of
variants. React Native styles do not cascade, so a component of several
elements, such as a button with a label, needs a style for each.

```ts
import { createSlotStyleRecipe } from "@lynstack/native-recipe";

const card = createSlotStyleRecipe({
  slots: ["root", "title", "body"],
  base: {
    root: { borderRadius: 12, padding: 16 },
    title: { fontSize: 18, fontWeight: "600" },
    body: { fontSize: 14 },
  },
  variants: {
    tone: {
      plain: {
        root: { backgroundColor: "#ffffff" },
        title: { color: "#111827" },
        body: { color: "#4b5563" },
      },
      inverted: {
        root: { backgroundColor: "#111827" },
        title: { color: "#ffffff" },
        body: { color: "#d1d5db" },
      },
    },
    compact: {
      true: { root: { padding: 8 }, title: { fontSize: 16 } },
    },
  },
  defaultVariants: { tone: "plain" },
});

const styles = card({ tone: "inverted", compact: true });
styles.root; // => { borderRadius: 12, padding: 8, backgroundColor: "#111827" }
styles.title; // => { fontSize: 16, fontWeight: "600", color: "#ffffff" }
styles.body; // => { fontSize: 14, color: "#d1d5db" }
```

```tsx
<View style={styles.root}>
  <Text style={styles.title}>{title}</Text>
  <Text style={styles.body}>{children}</Text>
</View>
```

## The config

A slot recipe takes the config of a
[style recipe](/recipe/native-recipe/create-style-recipe/), with `slots`,
and with an object of styles keyed by slot name wherever a style recipe
takes a style:

| Property           | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `slots`            | The names of the slots, in the order of the result.                                |
| `base`             | Optional. The style each slot always has.                                          |
| `variants`         | For each variant name, the style of each slot for each of its options.             |
| `compoundVariants` | Optional. Styles added to some slots, under `styles`, when several variants match. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.             |

An option or compound variant gives styles only to the slots it names.
Each slot's style is merged in the order of a style recipe: its base
style, then its style for each variant's option, then for each matching
compound variant. Variants, default variants, boolean variants, compound
conditions, undeclared options, and `variantKeys` behave as in a style
recipe.

## The same styles for the same variants

A slot recipe builds the styles of each selection once, and returns the
same frozen object for it, holding the same frozen style for each slot.

```ts
card({ tone: "inverted", compact: true }) === styles; // => true
```

## Slots without styles

Every slot is present in the result. A slot that the selection gives no
style is an empty style, so its element can always receive it.

```ts
const iconButton = createSlotStyleRecipe({
  slots: ["root", "icon"],
  variants: { size: { md: { root: { height: 40 } } } },
});

iconButton({ size: "md" }); // => { root: { height: 40 }, icon: {} }
```

A style for a slot that `slots` does not declare is a type error.

## Compound variants

A compound variant gives the style to add to each slot it names, under
`styles`.

```ts
const field = createSlotStyleRecipe({
  slots: ["label", "input"],
  base: {
    label: { fontSize: 14 },
    input: { borderRadius: 6, borderWidth: 1 },
  },
  variants: {
    invalid: {
      true: { label: { color: "#b91c1c" }, input: { borderColor: "#dc2626" } },
    },
    disabled: { true: { input: { opacity: 0.5 } } },
  },
  compoundVariants: [
    {
      variants: { invalid: true, disabled: true },
      styles: { label: { opacity: 0.5 } },
    },
  ],
});

const fieldStyles = field({ invalid: true, disabled: true });
fieldStyles.label; // => { fontSize: 14, color: "#b91c1c", opacity: 0.5 }
fieldStyles.input;
// => { borderRadius: 6, borderWidth: 1, borderColor: "#dc2626", opacity: 0.5 }
```
