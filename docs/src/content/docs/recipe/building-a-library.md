---
title: Building a library on it
description: "Build a styling library on @lynstack/recipe: define its kinds once, accept configs whose variant names are not known in advance, and handle overrides."
---

A library defines its kinds once and handles what its recipes add, such as
an override prop, around the recipe:

```ts
import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base?: Style): Style => ({ ...base }),
  reduce: (style, value: Style): Style => ({ ...style, ...value }),
  finish: (style): Style => Object.freeze(style),
});

interface StyleVariantConfig {
  readonly base?: Style;
  readonly variants: Readonly<Record<string, Readonly<Record<string, Style>>>>;
  readonly defaultVariants?: Readonly<Record<string, unknown>>;
}

function sv(config: StyleVariantConfig) {
  const recipe = styleRecipe(config);
  return (props: Readonly<Record<string, unknown>> & { style?: Style }) =>
    props.style === undefined
      ? recipe(props)
      : { ...recipe(props), ...props.style };
}
```

When the variant names are not known at compile time, as here, a recipe
accepts any selection, compound condition, and default variants. For slot
recipes, pass the same kind to `createSlotRecipeKind` (see [Slot
recipes](/recipe/recipe/slot-recipes/)).
