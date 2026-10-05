---
title: TypeScript
description: "How native-recipe checks React Native styles as StyleSheet.create does, infers the style a recipe returns, types themed recipes, and types component props with VariantsOf."
---

The types are inferred from the config: write the config inline, or
declare it with `as const`, and pass it to the recipe creator.

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

## Any style

`NativeStyle` is the style of any React Native element: a view, a text, or
an image. Use it to type a style that can come from any recipe.
