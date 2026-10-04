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

A slot recipe follows the same rules as a recipe, with an object of
classes per slot wherever a recipe takes a string, and `classNames`
instead of `className`.

Every slot is present in the result, as `""` when it has no classes. The
result is frozen, and calling the recipe again with the same variants
returns the same object, which keeps props stable for memoized
components. Passing `classNames` with at least one class returns a new
object.
