---
title: recipe
description: "Fast, type-safe recipes for values of any type: define how a kind of recipe combines values, such as class names or style objects, then create recipes of that kind."
---

Fast, type-safe recipes for values of any type. Define a kind of recipe by
how it combines values, such as class names or style objects, then create
recipes of that kind: functions that map a component's variants to its
result.

[`@lynstack/class-recipe`](/recipe/class-recipe/)
is built on it: its `cva` and `sva` create recipes of a class name kind.
Use `@lynstack/class-recipe` to style components with class names; use this
package to create recipes for other values.

```ts
import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base?: Style): Style => ({ ...base }),
  reduce: (style, value: Style): Style => ({ ...style, ...value }),
  finish: (style): Style => Object.freeze(style),
});

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
