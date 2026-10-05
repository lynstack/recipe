---
title: Slot recipes
description: "Create slot recipes of a kind with createSlotRecipeKind, which map a selection of variants to the result of each element of a component, such as a card's root and title."
---

A component often has several elements, its slots, each with its own
result, such as a button's root and label. `createSlotRecipeKind` takes the
same kind as `createRecipeKind` and returns the function that creates slot
recipes of that kind:

```ts
import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  initial: (base?: Style): Record<string, string | number> => ({ ...base }),
  reduce: (style: Record<string, string | number>, value: Style) =>
    Object.assign(style, value),
  finish: (style: Record<string, string | number>): Style =>
    Object.freeze(style),
};

const styleRecipe = createRecipeKind(styleKind);
const slotStyleRecipe = createSlotRecipeKind(styleKind);

const card = slotStyleRecipe({
  slots: ["root", "title"],
  base: { root: { padding: 16 }, title: { fontSize: 18 } },
  variants: {
    tone: {
      light: { root: { backgroundColor: "white" } },
      dark: { root: { backgroundColor: "black" }, title: { color: "white" } },
    },
  },
  compoundVariants: [
    { variants: { tone: "dark" }, value: { title: { fontWeight: 600 } } },
  ],
  defaultVariants: { tone: "light" },
});

card();
// => { root: { padding: 16, backgroundColor: "white" }, title: { fontSize: 18 } }

card({ tone: "dark" });
// => {
//   root: { padding: 16, backgroundColor: "black" },
//   title: { fontSize: 18, color: "white", fontWeight: 600 },
// }

card.variantKeys; // => ["tone"]
```

A slot recipe takes the config of a [recipe](/recipe/recipe/recipes/), with
`slots`, the names of its slots, and, for `base`, each option, and each
compound variant, an object of values keyed by slot name. Variants, default
variants, boolean variants, compound conditions, and the cache behave as in
a recipe.

## Each slot

Each slot reduces its own values as a recipe of the same kind would:
`initial` returns its accumulator for its base value, `reduce` adds its
value of each variant's selected option, then of each matching compound
variant, and `finish` turns the accumulator into its result. A slot that
an option or compound variant gives no value is left as it is.

A slot without any value gets the result of `initial` for an `undefined`
base, so every slot is in the result: an empty style here, an empty string
for class names.

`initial` is called for each slot of each result a slot recipe builds, so
`reduce` can change the accumulator it returns in place, as `Object.assign`
does above. Building a result then copies each style once instead of once
per value.

## Result

The result is a frozen object of each slot's result, keyed by slot name in
the order of `slots`. With the cache, a slot recipe builds it once for each
declared selection, and calling it again with the same variants returns
the same object, holding the same result for each slot.

## Types

A slot recipe infers its slot names from `slots`: a value for a slot that
`slots` does not name is a type error, and the result is typed with the
slot names. Its values are checked against the kind's values, as in a
recipe.

```ts
card({ tone: "dark" }).title; // Style
```
