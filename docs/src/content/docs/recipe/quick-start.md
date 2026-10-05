---
title: Quick start
description: "Build a kind of style recipe step by step: define the kind, create a recipe and a slot recipe of it, call them, and type a component's props."
---

This page builds recipes of style objects, as a component library for
React Native or inline styles would. The same steps apply to any type of
value.

## 1. Define the kind

A kind says how the values of a selection become a result:

```ts
type Style = Readonly<Record<string, string | number>>;
type MutableStyle = Record<string, string | number>;

const styleKind = {
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style) => Object.assign(style, value),
  finish: (style: MutableStyle): Style => Object.freeze(style),
};
```

- `initial` starts each result from a copy of the recipe's base.
- `reduce` adds one value to that copy. It changes the copy in place, which
  is safe because `initial` returns a new one for every result.
- `finish` freezes the result, because the recipe caches it and returns it
  to every call with the same variants.

The annotation of `value` sets the type of every value of the kind: a
`Style`.

## 2. Create a recipe

`createRecipeKind` returns the function that creates recipes of the kind.
Create it once, then create each recipe once, at the top level of a module:

```ts
import { createRecipeKind } from "@lynstack/recipe";

const styleRecipe = createRecipeKind(styleKind);

const button = styleRecipe({
  base: { borderRadius: 6, paddingInline: 16 },
  variants: {
    tone: {
      primary: { backgroundColor: "#2563eb", color: "#fff" },
      neutral: { backgroundColor: "#f3f4f6", color: "#111827" },
    },
    size: {
      sm: { height: 32 },
      md: { height: 40 },
    },
    disabled: {
      true: { opacity: 0.5 },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "primary", disabled: true },
      value: { backgroundColor: "#93c5fd" },
    },
  ],
  defaultVariants: { tone: "primary", size: "md" },
});
```

The config has four parts, described in [Variants](/recipe/recipe/variants/):

- `base`, the value every selection starts from.
- `variants`, the value of each option of each variant.
- `compoundVariants`, values that apply when several variants have
  particular options at the same time.
- `defaultVariants`, the option each variant uses when the selection leaves
  it out.

## 3. Call it

A recipe takes a selection of variants and returns its result:

```ts
button();
// => { borderRadius: 6, paddingInline: 16,
//      backgroundColor: "#2563eb", color: "#fff", height: 40 }

button({ tone: "neutral", size: "sm" });
// => { borderRadius: 6, paddingInline: 16,
//      backgroundColor: "#f3f4f6", color: "#111827", height: 32 }

button({ disabled: true });
// => { borderRadius: 6, paddingInline: 16,
//      backgroundColor: "#93c5fd", color: "#fff", height: 40, opacity: 0.5 }

button() === button({ tone: "primary" }); // => true
```

`disabled` declares only `true`, so it is a boolean variant: it is
optional and defaults to `false`. The last line shows the cache: the
recipe builds the result of a selection once and returns the same object
for the same variants (see [Caching](/recipe/recipe/caching/)).

## 4. Create a slot recipe

A component with several elements, such as a button with an icon and a
label, needs a result for each. Pass the same kind to
`createSlotRecipeKind`:

```ts
import { createSlotRecipeKind } from "@lynstack/recipe";

const slotStyleRecipe = createSlotRecipeKind(styleKind);

const iconButton = slotStyleRecipe({
  slots: ["root", "icon"],
  base: { root: { flexDirection: "row", gap: 8 }, icon: { width: 20 } },
  variants: {
    size: {
      sm: { root: { height: 32 }, icon: { width: 16 } },
      md: { root: { height: 40 } },
    },
  },
  defaultVariants: { size: "md" },
});

iconButton({ size: "sm" });
// => { root: { flexDirection: "row", gap: 8, height: 32 },
//      icon: { width: 16 } }
```

See [Slot recipes](/recipe/recipe/slot-recipes/).

## 5. Type a component's props

`VariantsOf` returns the variants a recipe accepts:

```ts
import type { VariantsOf } from "@lynstack/recipe";

type ButtonVariants = VariantsOf<typeof button>;
// => { readonly tone?: "primary" | "neutral" | undefined;
//      readonly size?: "sm" | "md" | undefined;
//      readonly disabled?: "true" | "false" | boolean | undefined }
```

Every variant here is optional, since each has a default or is boolean.
See [TypeScript](/recipe/recipe/typescript/).
