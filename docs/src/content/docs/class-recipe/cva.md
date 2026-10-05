---
title: cva
description: "Create a recipe with cva that maps variants, compound variants, and default variants to the class name of one element, with types inferred from its config."
---

`cva` creates a recipe, which returns the class name of one element for a
selection of variants. It is also exported as `createRecipe`.

```ts
import { cva } from "@lynstack/class-recipe";

const badge = cva({
  // Applied whatever the variants.
  base: "inline-flex rounded-full px-2 text-xs",
  // For each variant, the classes of each option.
  variants: {
    tone: {
      neutral: "bg-gray-100 text-gray-700",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
    },
    outlined: {
      true: "ring-1 ring-inset ring-current",
    },
  },
});

badge({ tone: "success" });
// => "inline-flex rounded-full px-2 text-xs bg-green-100 text-green-800"

badge({ tone: "danger", outlined: true, className: "uppercase" });
// => "inline-flex rounded-full px-2 text-xs bg-red-100 text-red-800 ring-1 ring-inset ring-current uppercase"
```

## The config

| Property           | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `base`             | Optional. The classes the element always has.                                                               |
| `variants`         | For each variant name, the classes of each of its options. `className` and `classNames` are reserved names. |
| `compoundVariants` | Optional. Classes added when several variants have particular options at the same time, in order.           |
| `defaultVariants`  | Optional. The option each variant uses when a selection leaves it out.                                      |

Classes are added in this order: `base`, then each variant in the order
the config declares it, then the matching compound variants, then
`className` (see [How it works](/recipe/class-recipe/how-it-works/)).

## Required and default variants

A variant listed in `defaultVariants` may be left out or passed as
`undefined`, and then uses its default. A variant without a default is
required, so a component cannot forget to choose, for example, its tone.
When every variant has a default, the argument itself is optional.

```ts
const stack = cva({
  variants: {
    gap: { sm: "gap-2", md: "gap-4" },
    direction: { row: "flex-row", column: "flex-col" },
  },
  defaultVariants: { gap: "md", direction: "column" },
});

stack(); // => "gap-4 flex-col"
stack({ direction: "row" }); // => "gap-4 flex-row"
stack({ gap: undefined }); // => "gap-4 flex-col"
```

## Boolean variants

A variant with an option named `"true"` or `"false"` also accepts the
booleans `true` and `false`, and declares the missing one of those two
options without classes. A variant whose only options are `"true"` and
`"false"` is optional and defaults to `false`.

```ts
const input = cva({
  base: "rounded-md border",
  variants: {
    invalid: { true: "border-red-600", false: "border-gray-300" },
    disabled: { true: "opacity-50" },
  },
});

input(); // => "rounded-md border border-gray-300"
input({ invalid: true, disabled: true });
// => "rounded-md border border-red-600 opacity-50"
```

## Option names that are numbers

An option whose name is a number accepts that number as well as the
string:

```ts
const heading = cva({
  variants: { level: { 1: "text-3xl", 2: "text-2xl" } },
});

heading({ level: 1 }); // => "text-3xl"
heading({ level: "2" }); // => "text-2xl"
```

## Compound variants

A compound variant adds its `className` when several variants have
particular options at the same time. For each variant it names, it gives
one option or a list of options; a variant it leaves out matches any
option.

```ts
const button = cva({
  base: "inline-flex rounded-md",
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
    outlined: { true: "ring-1 ring-inset" },
  },
  compoundVariants: [
    // When tone is danger and size is md.
    { variants: { tone: "danger", size: "md" }, className: "font-semibold" },
    // When tone is neutral and outlined is true, whatever the size.
    {
      variants: { tone: "neutral", outlined: true },
      className: "ring-gray-300",
    },
  ],
  defaultVariants: { size: "md" },
});

button({ tone: "danger" });
// => "inline-flex rounded-md bg-red-600 text-white h-10 px-4 font-semibold"

button({ tone: "neutral", size: "sm", outlined: true });
// => "inline-flex rounded-md bg-gray-100 h-8 px-3 ring-1 ring-inset ring-gray-300"
```

Conditions are checked after defaults are applied, which is why the first
call matches `size: "md"` without passing it, and a condition can match
the `false` of a boolean variant. Matching compound variants are added in
the order they are declared. A compound variant that names an undeclared
variant or option never matches; its config is a type error.

## Overriding classes

Pass `className` to add classes after every class of the recipe. With the
default join they are added, not substituted: one that sets the same CSS
property as a class of the recipe leaves both in the class name. Design
the recipe so that it needs no override (see
[Writing conflict-free recipes](/recipe/class-recipe/conflict-free-recipes/)),
or use a join function such as `twMerge` (see
[Resolving conflicts with tailwind-merge](/recipe/class-recipe/tailwind-merge/))
to let these classes replace conflicting ones.

## Undeclared options and other props

- The types accept only the options the config declares. A value from
  untyped data can still bypass them: an option that its variant does not
  declare adds no classes, and its class name is built on every call
  instead of being cached.
- Properties of the selection that are not variants, besides `className`,
  are ignored, so a component can pass a recipe all of its props.
- Calling a recipe without a selection, or with `undefined` or `null`, is
  the same as calling it with an empty one.

## `variantKeys`

A recipe lists the names of its variants, in the order of `variants`, in
`variantKeys`, a frozen array typed with those names:

```ts
button.variantKeys; // => ["tone", "size", "outlined"]
```

Use it to split a component's props into the recipe's variants and the
rest (see [Building components](/recipe/class-recipe/building-components/)).
