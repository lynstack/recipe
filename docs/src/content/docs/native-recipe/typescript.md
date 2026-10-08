---
title: native-recipe with TypeScript
description: "How native-recipe checks React Native styles like StyleSheet.create, infers the style a recipe returns, types themed recipes, and types props with VariantsOf."
sidebar:
  label: TypeScript
---

The types are inferred from the config: write the config inline, or
declare it with `as const`, and pass it to the recipe creator. This holds
for the `slots` of a slot recipe too: a list declared before the call
without `as const` is a `string[]`, so the slot recipe takes any slot
name, and a misspelled slot in `base`, in the variants, or in the result
is not an error.

## Checked styles

Every style in a config is checked against the styles of React Native, as
in `StyleSheet.create`: a property that no style has, or a value of the
wrong type, is an error.

```ts
createStyleRecipe({
  variants: {
    size: {
      // Error: fontSise is not a style property.
      sm: { fontSize: 12, fontSise: 12 },
      // Error: fontSize is a number.
      md: { fontSize: "14px" },
    },
  },
});
```

A slot recipe also rejects a style for a slot that `slots` does not
declare.

## The style a recipe returns

The style a recipe returns has every property that the config declares,
each optional, with the values the config gives it. A recipe keeps these
types, as the styles of `StyleSheet.create` do, so TypeScript checks that
each element can take the style it receives.

```ts
const label = createStyleRecipe({
  base: { color: "#111827" },
  variants: { size: { sm: { fontSize: 14 }, md: { fontSize: 16 } } },
});

label({ size: "sm" });
// Type: { readonly color?: "#111827"; readonly fontSize?: 14 | 16 }
```

`label` returns text properties only, so passing its style to a `Text`
compiles, and passing it to a `View` is an error. In the same way, a style
with `overflow: "scroll"` can go to a `View` but not to an `Image`.

Each slot of a slot recipe has its own style type, so `styles.label` of a
button can go to a `Text` while `styles.root` goes to a `Pressable`.

A recipe that composes others also returns the properties of each, with
the values they give them, and a slot recipe the slots of each.

## Typing component props

`VariantsOf` returns the variants a recipe accepts. Use it to type the
props of a component built on a recipe:

```ts
import { createStyleRecipe, type VariantsOf } from "@lynstack/native-recipe";

const badge = createStyleRecipe({
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#fee2e2" },
    },
    size: { sm: { height: 20 }, md: { height: 24 } },
  },
  defaultVariants: { size: "md" },
});

type BadgeVariants = VariantsOf<typeof badge>;
// => { readonly tone: "neutral" | "danger"; readonly size?: "sm" | "md" | undefined }
```

A variant with a default, or a boolean variant, is optional; any other
variant is required. See
[Building components](/recipe/native-recipe/building-components/).

## Themed recipes

The config function of a themed recipe is checked as a config written
without a theme: its styles against React Native's, its default variants
and compound variants against its variants, and its slots against
`slots`. A token that the theme type does not have is an error too:

```ts
const { createStyleRecipe } = createThemedRecipes<Theme>();

createStyleRecipe((theme) => ({
  variants: {
    // Error: Theme has no spacing.
    size: { sm: { padding: theme.spacing } },
  },
}));
```

The style a themed recipe returns has the types of the tokens it uses:
`backgroundColor: theme.colors.primary` gives a `string`, where a literal
color in a recipe without a theme gives its literal type. `VariantsOf`
returns the variants of a themed recipe, and a themed recipe takes only
the theme type that `createThemedRecipes` was given.

## Variants from a CMS or an API

When the styles of a recipe come from outside the code, such as a CMS or
a theme file, type the data with the names of its variants, options, and
slots, so that the recipe checks every call. Write the type with `type`,
not `interface`, since an interface does not satisfy the type of
`variants`:

```ts
import type { ViewStyle } from "react-native";
import { createSlotStyleRecipe } from "@lynstack/native-recipe";

type CardStyles = { readonly root?: ViewStyle; readonly title?: ViewStyle };

type CardTheme = {
  readonly size: Readonly<Record<"sm" | "md", CardStyles>>;
};

const theme: CardTheme = await fetchCardTheme();

const card = createSlotStyleRecipe({
  slots: ["root", "title"],
  variants: theme,
  defaultVariants: { size: "md" },
});

card({ size: "sm" });

// @ts-expect-error: "lg" is not a size.
card({ size: "lg" });
```

When the names cannot be known, as in a function that passes on a config
it received, type the variants as `StyleRecipeVariants` or
`SlotStyleRecipeVariants`. A recipe then accepts any variant name, with
its option named by a string, and does not check the slots or style
properties of the variants' styles:

```ts
import { createSlotStyleRecipe } from "@lynstack/native-recipe";
import type { SlotStyleRecipeVariants } from "@lynstack/native-recipe";

function createCard(variants: SlotStyleRecipeVariants) {
  return createSlotStyleRecipe({ slots: ["root", "title"], variants });
}
```

## A function generic over a config

A library's own helper can take any config and return its recipe. Type
the variants and the names with a default as `const` type parameters,
and the recipe as a `StyleRecipe` of their `VariantSelection`:

```ts
import { createStyleRecipe } from "@lynstack/native-recipe";
import type {
  NativeStyle,
  StyleRecipe,
  StyleRecipeConfig,
  StyleRecipeVariants,
  VariantSelection,
} from "@lynstack/native-recipe";

function define<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: StyleRecipeConfig<Variants, NativeStyle, readonly [], DefaultedName>,
): StyleRecipe<VariantSelection<Variants, DefaultedName>, NativeStyle> {
  return createStyleRecipe(config);
}
```

A slot recipe's helper does the same with `SlotStyleRecipeConfig`, and
returns a `SlotStyleRecipe` of `SlotStyles<Slot>`.

`define` takes no `composes`: its `StyleRecipe` has the variants of its
own config only, and other recipes cannot compose it. A helper whose
configs compose recipes takes the recipes as a type parameter, and
returns the type of `createStyleRecipe` for its type parameters, which
has the variants and defaults of the recipes it composes. Leave `Base` as
`never`, as `createStyleRecipe` does, so that the style it returns has
the properties of the config:

```ts
import { createStyleRecipe } from "@lynstack/native-recipe";
import type {
  ComposableKindRecipe,
  ComposedVariants,
  NativeStyle,
  StyleRecipeConfig,
  StyleRecipeVariants,
} from "@lynstack/native-recipe";

function defineComposed<
  const Variants extends StyleRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<NativeStyle>[] =
    readonly [],
>(
  config: StyleRecipeConfig<
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >,
): ReturnType<
  typeof createStyleRecipe<
    Variants,
    never,
    readonly [],
    DefaultedName,
    Composed
  >
> {
  return createStyleRecipe(config);
}
```

## A function that takes any recipe

A function that takes any recipe, such as one that lists the options of
each variant for a story, cannot take it as a recipe of any selection:
that type can be called without variants, which a recipe with a required
variant cannot, so TypeScript rejects such a recipe. Type it as a function
of `never`, which the function does not call, with the properties it
reads:

```ts
import type {
  NativeStyle,
  StyleRecipe,
  StyleRecipeVariants,
  VariantSelection,
} from "@lynstack/native-recipe";

type AnyRecipe = ((props: never) => NativeStyle) &
  Pick<
    StyleRecipe<VariantSelection<StyleRecipeVariants, never>, NativeStyle>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;
```

For a slot recipe, use
`(props: never) => Readonly<Record<string, NativeStyle>>` with the same
properties of
`SlotStyleRecipe<VariantSelection<SlotStyleRecipeVariants, never>, SlotStyles<string>>`.
A function that calls the recipe is generic over it instead, so that it
keeps the recipe's own selection.

## Any style

`NativeStyle` is the style of any React Native element: a view, a text, or
an image. Use it to type a style that can come from any recipe.

## Next steps

- [Exporting recipes from a library](/recipe/native-recipe/exporting-recipes/)
  annotates exported recipes for `isolatedDeclarations`.
- [All exports](/recipe/native-recipe/exports/) lists every type, with
  its type parameters.
- [Building components](/recipe/native-recipe/building-components/) uses
  `VariantsOf` in real components.
- [FAQ](/recipe/native-recipe/faq/#why-do-i-get-type-errors-from-react-native-outside-expo)
  fixes tsconfig errors outside Expo.
