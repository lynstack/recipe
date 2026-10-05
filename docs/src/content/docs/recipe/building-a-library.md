---
title: Building a library on it
description: "Build a styling library on @lynstack/recipe: define its kinds once, type its own config with the engine's types, handle override props around the recipe, and split props with variantKeys."
sidebar:
  label: Building a library
---

A styling library built on the engine owns its API, and gives the engine
the work that does not depend on its values. This page builds `sv`, a small
library of style recipes, the way `@lynstack/class-recipe` builds `cva` and
`sva`.

## Define the kinds once

Put the kinds in one module, and create the function that creates recipes
of each kind there, once:

```ts
// kinds.ts
import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

export type Style = Readonly<Record<string, string | number>>;
type MutableStyle = Record<string, string | number>;

const styleKind = {
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style) => Object.assign(style, value),
  finish: (style: MutableStyle): Style => Object.freeze(style),
};

export const styleRecipe = createRecipeKind(styleKind);
export const slotStyleRecipe = createSlotRecipeKind(styleKind);
```

Every recipe of the library shares these kinds. Keep their functions at
the top level of the module, rather than creating them for each recipe.

## Type the library's config

The library's config does not have to match the engine's. Here, a compound
variant gives its style under `style` instead of `value`, and a recipe
takes a `style` prop that overrides its result. The engine exports the
types that infer the variants from a config, so the library's users get
the same checks as with the engine:

```ts
// sv.ts
import type {
  CompoundCondition,
  DefaultVariants,
  KindVariants,
  RecipeFunction,
  VariantKey,
  VariantSelection,
} from "@lynstack/recipe";

interface StyleVariantsConfig<
  Variants extends KindVariants<Style>,
  DefaultedName extends keyof Variants,
> {
  readonly base?: Style;
  readonly variants: Variants;
  readonly compoundVariants?: readonly {
    readonly variants: CompoundCondition<NoInfer<Variants>>;
    readonly style: Style;
  }[];
  readonly defaultVariants?: DefaultVariants<Variants, DefaultedName>;
}

type StyleVariants<Selection> = RecipeFunction<
  Selection & { readonly style?: Style },
  Style
> & {
  readonly variantKeys: readonly VariantKey<Selection>[];
};
```

The `const` type parameters of `sv` below infer the option names of each
variant as literals, as the engine's own functions do.

## Translate the config once

Translate the library's config into the engine's when a recipe is created,
never when it is called. The implementation works on configs whose
variant names are not known, which a recipe accepts with any selection:

```ts
interface LooseConfig {
  readonly base?: Style;
  readonly variants: KindVariants<Style>;
  readonly compoundVariants?: readonly {
    readonly variants: Readonly<Record<string, unknown>>;
    readonly style: Style;
  }[];
  readonly defaultVariants?: Readonly<Record<string, unknown>>;
}

type LooseProps = Readonly<Record<string, unknown>> & {
  readonly style?: Style;
};

export function sv<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: StyleVariantsConfig<Variants, DefaultedName>,
): StyleVariants<VariantSelection<Variants, DefaultedName>>;

export function sv(config: LooseConfig) {
  const recipe = styleRecipe({
    ...config,
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      variants: compound.variants,
      value: compound.style,
    })),
  });
  const styleVariants = (props: LooseProps = {}): Style =>
    props.style === undefined
      ? recipe(props)
      : Object.freeze({ ...recipe(props), ...props.style });
  return Object.assign(styleVariants, { variantKeys: recipe.variantKeys });
}
```

```ts
const box = sv({
  base: { padding: 8 },
  variants: { tone: { muted: { opacity: 0.6 } } },
  compoundVariants: [{ variants: { tone: "muted" }, style: { margin: 4 } }],
});

box({ tone: "muted" }); // => { padding: 8, opacity: 0.6, margin: 4 }
box({ tone: "muted", style: { padding: 0 } });
// => { padding: 0, opacity: 0.6, margin: 4 }
```

## Overrides

`sv` applies the `style` prop around the recipe, and only when it is
passed, so that a call without it stays a cache lookup that returns the
same object. Never change the recipe's result to apply an override: it is
shared by every call with the same variants. `@lynstack/class-recipe`
handles its `className` prop the same way.

## Split props with `variantKeys`

A component passes its variants to the recipe and the rest of its props to
the element it renders. A recipe ignores props that are not variants, so it
can take all of them, but the element should not get the variants.
`variantKeys` lists them:

```ts
function splitProps(
  props: Readonly<Record<string, unknown>>,
  variantKeys: readonly string[],
) {
  const variants: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (variantKeys.includes(key)) {
      variants[key] = value;
    } else {
      rest[key] = value;
    }
  }
  return { rest, variants };
}

splitProps({ tone: "muted", testID: "box" }, box.variantKeys);
// => { rest: { testID: "box" }, variants: { tone: "muted" } }
```

## Slot recipes

A component with several elements uses a slot recipe of the same kind,
`slotStyleRecipe`, typed and translated in the same way, with the slot
names inferred from `slots` (see [Slot recipes](/recipe/recipe/slot-recipes/)).
Apply an override prop to each slot it names: a new object for those
slots, and the cached result when it names none.

## Expose a switch for the cache

A library that lets its users turn the cache off creates its kinds for
each setting, once, as `createRecipes` of `@lynstack/class-recipe` does:

```ts
export function createStyleRecipes(options: { readonly cache?: boolean } = {}) {
  const kind = { ...styleKind, cache: options.cache ?? true };
  return {
    slotStyleRecipe: createSlotRecipeKind(kind),
    styleRecipe: createRecipeKind(kind),
  };
}
```

## Checklist

- The kinds follow the
  [rules of a kind](/recipe/recipe/recipe-kinds/#the-rules-of-a-kind), and
  are tested as [Designing a kind](/recipe/recipe/designing-a-kind/#test-a-kind)
  describes.
- Configs are translated once, when a recipe is created.
- Overrides build a new object, and only when they are passed.
- The library's functions infer the variants of each config with the
  engine's types, and keep `variantKeys`.
