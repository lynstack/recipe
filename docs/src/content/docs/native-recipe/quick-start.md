---
title: Quick start with native-recipe
description: "Style a badge with createStyleRecipe and a button with createSlotStyleRecipe, use them in React Native components, and type their props with VariantsOf."
sidebar:
  label: Quick start
---

This page styles a badge and a button. Install the package first (see
[Installation](/recipe/native-recipe/installation/)).

## 1. Create a recipe

`createStyleRecipe` takes the styles of an element: the style it always
has, in `base`, and the style of each option of each variant. Create it
once, at the top level of a module, as you would call `StyleSheet.create`:

```ts
import { createStyleRecipe } from "@lynstack/native-recipe";

export const badge = createStyleRecipe({
  base: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      success: { backgroundColor: "#dcfce7" },
      danger: { backgroundColor: "#fee2e2" },
    },
    size: {
      sm: { height: 20 },
      md: { height: 24 },
    },
    outlined: {
      true: { borderColor: "#d1d5db", borderWidth: 1 },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "danger", outlined: true },
      style: { borderColor: "#dc2626" },
    },
  ],
  defaultVariants: { tone: "neutral", size: "md" },
});
```

## 2. Call it

A recipe takes a selection of variants and returns the style:

```ts
badge();
// => { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8, backgroundColor: "#f3f4f6", height: 24 }

badge({ tone: "success", size: "sm" });
// => { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8, backgroundColor: "#dcfce7", height: 20 }

badge({ tone: "danger", outlined: true });
// => { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8, backgroundColor: "#fee2e2", height: 24, borderColor: "#dc2626", borderWidth: 1 }
```

- `tone` and `size` have defaults, so a selection may leave them out.
- `outlined` declares only `true`, so it is a boolean variant: optional,
  and `false` by default.
- The compound variant adds its style when `tone` is `danger` and
  `outlined` is `true`, after the styles of the variants, so its border
  color wins.

Calling it again with the same variants returns the same frozen object:

```ts
badge({ tone: "success" }) === badge({ tone: "success" }); // => true
```

## 3. Use it in a component

`VariantsOf` types a component's props from its recipe. Pass the style to
the `style` prop:

```tsx
import type { ReactNode } from "react";
import type { VariantsOf } from "@lynstack/native-recipe";
import { View } from "react-native";

type BadgeProps = VariantsOf<typeof badge> & { children: ReactNode };

export function Badge({ children, ...variants }: BadgeProps) {
  return <View style={badge(variants)}>{children}</View>;
}
```

A recipe reads only its variants, so it can take every prop of the
component at once. See
[Building components](/recipe/native-recipe/building-components/) for
style overrides and memoized components.

## 4. Style several elements with a slot recipe

React Native styles do not cascade, so a component of several elements,
such as a button and its label, needs a style for each. A slot recipe
returns the style of every element, its slots:

```ts
import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: {
    root: { alignItems: "center", borderRadius: 8, justifyContent: "center" },
    label: { fontWeight: "600" },
  },
  variants: {
    tone: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        label: { color: "#ffffff" },
      },
      ghost: {
        root: { backgroundColor: "transparent" },
        label: { color: "#2563eb" },
      },
    },
    size: {
      sm: {
        root: { height: 32, paddingHorizontal: 12 },
        label: { fontSize: 14 },
      },
      md: {
        root: { height: 40, paddingHorizontal: 16 },
        label: { fontSize: 16 },
      },
    },
  },
  defaultVariants: { tone: "primary", size: "md" },
});

const styles = button({ size: "sm" });
styles.root;
// => { alignItems: "center", borderRadius: 8, justifyContent: "center", backgroundColor: "#2563eb", height: 32, paddingHorizontal: 12 }
styles.label; // => { fontWeight: "600", color: "#ffffff", fontSize: 14 }
```

```tsx
import type { VariantsOf } from "@lynstack/native-recipe";
import { Pressable, Text } from "react-native";

type ButtonProps = VariantsOf<typeof button> & {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress, ...variants }: ButtonProps) {
  const styles = button(variants);
  return (
    <Pressable style={styles.root} onPress={onPress}>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}
```

See [createSlotStyleRecipe](/recipe/native-recipe/create-slot-style-recipe/).

## 5. Build styles from a theme

The colors above are written in each recipe. A design system keeps them
in a theme instead, with one theme for light and one for dark.
`createThemedRecipes` returns recipe creators whose config is built from
a theme, and its recipes take the theme first:

```ts
import { createThemedRecipes } from "@lynstack/native-recipe";

interface Theme {
  readonly colors: { readonly primary: string; readonly onPrimary: string };
  readonly radius: { readonly md: number };
}

const { createSlotStyleRecipe } = createThemedRecipes<Theme>();

export const themedButton = createSlotStyleRecipe((theme) => ({
  slots: ["root", "label"],
  base: {
    root: {
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
    },
    label: { color: theme.colors.onPrimary },
  },
  variants: {},
}));

const light: Theme = {
  colors: { primary: "#2563eb", onPrimary: "#ffffff" },
  radius: { md: 8 },
};

themedButton(light).root; // => { borderRadius: 8, backgroundColor: "#2563eb" }
```

[Themes and design tokens](/recipe/native-recipe/themes/) builds a light
and a dark theme, provides them with a theme provider, and switches with
the color scheme.
