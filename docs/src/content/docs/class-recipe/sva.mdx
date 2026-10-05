---
title: sva
description: "Create a slot recipe with sva that maps variants to the class names of several elements, such as the root, header, and body of a card."
---

`sva` creates a slot recipe, which styles a component made of several
elements, its slots, and returns an object with the class name of every
slot. It is also exported as `createSlotRecipe`.

```ts
import { sva } from "@lynstack/class-recipe";

const card = sva({
  slots: ["root", "header", "body"],
  base: {
    root: "rounded-lg border",
    header: "font-semibold",
    body: "text-gray-600",
  },
  variants: {
    size: {
      sm: { root: "p-3", header: "text-sm" },
      md: { root: "p-5", header: "text-base" },
    },
    elevated: {
      true: { root: "shadow-md" },
    },
  },
  compoundVariants: [
    {
      variants: { size: "md", elevated: true },
      classNames: { header: "border-b" },
    },
  ],
  defaultVariants: { size: "md" },
});

const elevated = card({ elevated: true });
elevated.root; // => "rounded-lg border p-5 shadow-md"
elevated.header; // => "font-semibold text-base border-b"
elevated.body; // => "text-gray-600"

const small = card({ size: "sm", classNames: { body: "italic" } });
small.root; // => "rounded-lg border p-3"
small.header; // => "font-semibold text-sm"
small.body; // => "text-gray-600 italic"

card.variantKeys; // => ["size", "elevated"]
```

## The config

A slot recipe takes the config of a [recipe](/recipe/class-recipe/cva/),
with `slots`, and with an object of classes keyed by slot name wherever a
recipe takes a string:

| Property           | Description                                                                             |
| ------------------ | --------------------------------------------------------------------------------------- |
| `slots`            | The names of the slots, in the order of the result.                                     |
| `base`             | Optional. The classes each slot always has.                                             |
| `variants`         | For each variant name, the classes of each slot for each of its options.                |
| `compoundVariants` | Optional. Classes added to some slots, under `classNames`, when several variants match. |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                  |

An option or compound variant gives classes only to the slots it names.
Variants, default variants, boolean variants, compound conditions, and
undeclared options behave as in a recipe. A slot that `slots` does not
name is a type error, and its classes are ignored.

## The result

Every slot is in the result, as `""` when it has no classes. The result is
frozen, and calling the recipe again with the same variants returns the
same object, which keeps props stable for memoized components.

## Overriding classes

Pass `classNames`, an object of classes keyed by slot name, to add classes
after every class of those slots. Passing it with at least one class
returns a new object and leaves the cached one unchanged. As with
`className`, the default join adds the classes rather than substituting
them (see [How it works](/recipe/class-recipe/how-it-works/#overrides)).
