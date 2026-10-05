---
title: recipe
description: "A typed engine for values driven by variants: define a kind once by how it combines values, and get recipes and slot recipes that select, cache, and type them."
---

`@lynstack/recipe` is an engine for values driven by variants. It maps a
component's variants to a result of any type: class names, style objects,
or anything else that can be built from parts.
[`@lynstack/class-recipe`](/recipe/class-recipe/) is built on it.

## The engine and the kind

A recipe does two kinds of work. Most of it does not depend on what the
values are, and the engine does it once for every kind of value:

- It compiles a config of variants, compound variants, and default
  variants.
- It resolves a selection: default variants, boolean variants, option
  names that are numbers, and props that are not variants.
- It applies the values of a selection in a fixed order of precedence.
- It caches the result of each selection.
- It infers the types of the selection from the config.
- It does all of this for each element of a component made of several,
  with slot recipes.

The rest is how values combine into a result, and that is what you give
it: a **kind**, three small functions.

```ts
type Style = Readonly<Record<string, string | number>>;
type MutableStyle = Record<string, string | number>;

const styleKind = {
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style) => Object.assign(style, value),
  finish: (style: MutableStyle): Style => Object.freeze(style),
};
```

## From a kind to a result

A kind goes through three steps:

1. `createRecipeKind(kind)` returns the function that creates recipes of
   that kind, and `createSlotRecipeKind(kind)` the one that creates slot
   recipes.
2. That function takes a config and returns a recipe.
3. The recipe takes a selection of variants and returns its result.

```ts
import { createRecipeKind } from "@lynstack/recipe";

const styleRecipe = createRecipeKind(styleKind);

const text = styleRecipe({
  base: { color: "black" },
  variants: {
    size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
    muted: { true: { opacity: 0.6 } },
  },
  compoundVariants: [
    { variants: { size: "lg", muted: true }, value: { fontWeight: 300 } },
  ],
  defaultVariants: { size: "sm" },
});

text(); // => { color: "black", fontSize: 12 }

text({ size: "lg", muted: true });
// => { color: "black", fontSize: 24, opacity: 0.6, fontWeight: 300 }

text.variantKeys; // => ["size", "muted"]
```

## When to use it

- To style components with class names, use
  [`@lynstack/class-recipe`](/recipe/class-recipe/), which is this engine
  with a class name kind, plus `cx` and joins such as `twMerge`.
- To create recipes for other values, such as the style objects of React
  Native or the tokens of a design system, use this package.
- To build a styling library, define its kinds with this package and keep
  its own API around them; see
  [Building a library](/recipe/recipe/building-a-library/).

The package has no dependencies and ships as an ES module only. A cached
call costs one lookup per variant and one for the cache, and allocates
nothing.

## Next steps

- [Quick start](/recipe/recipe/quick-start/) builds a kind, a recipe, and
  a slot recipe step by step.
- [How it works](/recipe/recipe/how-it-works/) follows a call from the
  selection to the result.
- [Designing a kind](/recipe/recipe/designing-a-kind/) shows the patterns
  for writing kinds that stay fast and correct.
