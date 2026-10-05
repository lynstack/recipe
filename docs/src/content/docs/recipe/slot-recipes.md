---
title: Slot recipes
description: "Create slot recipes with createSlotRecipeKind, which map variants to the result of each element of a component, such as a card's root and title."
---

A component often has several elements, its slots, each with its own
result, such as a card's root and title. `createSlotRecipeKind` takes the
same kind as `createRecipeKind` and returns the function that creates slot
recipes of that kind:

```ts
import { createSlotRecipeKind } from "@lynstack/recipe";

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
// => { root: { padding: 16, backgroundColor: "white" },
//      title: { fontSize: 18 } }

card({ tone: "dark" });
// => { root: { padding: 16, backgroundColor: "black" },
//      title: { fontSize: 18, color: "white", fontWeight: 600 } }

card.variantKeys; // => ["tone"]
```

`styleKind` is the kind of the [Quick start](/recipe/recipe/quick-start/).
`@lynstack/class-recipe` builds its `sva` on slot recipes of a class name
kind.

## The config

A slot recipe takes the config of a recipe, with `slots`, and with an
object of values keyed by slot name wherever a recipe takes one value:

| Property           | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| `slots`            | The names of the slots, in the order of the result.                                 |
| `base`             | Optional. The base value of each slot.                                              |
| `variants`         | For each variant name, the values of each slot for each of its options.             |
| `compoundVariants` | Optional. Values added to some slots when several variants have particular options. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.              |

An option or compound variant gives values only to the slots it names.
Variants, default variants, boolean variants, compound conditions, and
undeclared options behave as in a recipe (see
[Variants](/recipe/recipe/variants/)).

## How each slot is built

Each slot is built as a recipe of the same kind would build it, from that
slot's values only:

1. `initial` returns the slot's accumulator for its base value.
2. `reduce` adds the slot's value of each variant's selected option, in the
   order of `variants`, then of each matching compound variant, in the
   order of `compoundVariants`. A value that does not name the slot adds
   nothing to it.
3. `finish` turns the accumulator into the slot's result.

A slot without any value gets the result of `initial` for an `undefined`
base, so every slot is in the result: an empty style here, an empty string
for class names.

`initial` is called for each slot of each result, so `reduce` can change
the accumulator in place, as `Object.assign` does in `styleKind`.

## The result

The result is a frozen object of each slot's result, keyed by slot name in
the order of `slots`. Values of slots that `slots` does not name are
ignored. With the cache, a slot recipe builds the result once for each
declared selection, and returns the same object, with the same result for
each slot, to every call with the same variants (see
[Caching](/recipe/recipe/caching/)).

## Types

A slot recipe infers its slot names from `slots`. A value for a slot that
`slots` does not name is a type error, and the result is typed with the
slot names:

```ts
const { title } = card({ tone: "dark" }); // title: Style
```

Each value is checked against the kind's `Value`, as in a recipe.
