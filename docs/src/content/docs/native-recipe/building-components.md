---
title: Building components with native-recipe
description: "Use style recipes in React Native components: type props with VariantsOf, split props with variantKeys, let users override styles, and keep styles stable."
sidebar:
  label: Building components
---

## Type the props from the recipe

`VariantsOf` returns the variants a recipe accepts, so a component's props
follow the recipe as it changes:

```tsx
import { createStyleRecipe, type VariantsOf } from "@lynstack/native-recipe";
import type { ViewProps } from "react-native";

const box = createStyleRecipe({
  base: { borderRadius: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#fee2e2" },
    },
    padding: { sm: { padding: 8 }, md: { padding: 16 } },
  },
  defaultVariants: { padding: "md" },
});

type BoxProps = Omit<ViewProps, "style"> & VariantsOf<typeof box>;
// VariantsOf<typeof box> is
// { readonly tone: "neutral" | "danger"; readonly padding?: "sm" | "md" | undefined }
```

A variant without a default is required in the props too, so every use of
`Box` must choose its tone. `VariantsOf` works the same way with a themed
recipe of [`createThemedRecipes`](/recipe/native-recipe/create-themed-recipes/).

## Split props with `variantKeys`

A recipe reads only its variants, so it can take every prop of the
component. The element it styles should not get the variants, though.
`variantKeys` lists them, so the component does not repeat their names:

```tsx
import { View } from "react-native";

export function Box(props: BoxProps) {
  const viewProps: Partial<BoxProps> = { ...props };
  for (const key of box.variantKeys) {
    delete viewProps[key];
  }
  return <View {...viewProps} style={box(props)} />;
}
```

A themed recipe has no `variantKeys` of its own, since it needs a theme
to build its config; read them from the recipe of the theme,
`recipe.withTheme(theme).variantKeys`.

## Overriding styles

You cannot pass extra styles into a recipe call. Merge them in the
`style` prop instead. To let a component's user override its style, pass
both in a style array, and only when there is an override, so
that the prop keeps the recipe's object otherwise:

```tsx
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

type CardProps = VariantsOf<typeof box> & {
  style?: StyleProp<ViewStyle>;
};

export function Card({ style, ...variants }: CardProps) {
  const boxStyle = box(variants);
  return <View style={style ? [boxStyle, style] : boxStyle} />;
}
```

React Native flattens the array, so the override wins over the recipe's
style. An array is a new value on every render, so use overrides for what
a recipe cannot know, such as a margin set by the parent or a value that
varies continuously, and keep every choice the component offers in a
variant.

A component with several elements can take one style for each slot in
the same way, such as `labelStyle` next to `style`.

## Keep static styles in `StyleSheet.create`

A recipe earns its place when a style depends on a variant or on the
theme. A style with neither, such as a separator of a fixed height, stays
in `StyleSheet.create` or a module-level constant, which is just as stable
and simpler to read:

```ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({ separator: { height: 12 } });
```

In an app with a theme, a static style that uses a token, such as
`theme.space.md`, does depend on the theme. Make it a themed recipe with
no variants. `variants: {}` is still required:

```tsx
import type { ReactNode } from "react";
import { View } from "react-native";
import { createStyleRecipe } from "../theme/recipes";
import { useTheme } from "../theme/provider";

const screen = createStyleRecipe((theme) => ({
  base: { backgroundColor: theme.colors.background, flex: 1 },
  variants: {},
}));

export function Screen({ children }: { children: ReactNode }) {
  return <View style={screen(useTheme())}>{children}</View>;
}
```

`screen(theme)` returns the same object for the same theme. Pass a
recipe's own style straight to the `style` prop; `StyleSheet.create` adds
nothing to it.

## Pass styles to memoized children

A recipe returns the same frozen object for the same variants, and a slot
recipe the same object with the same style for each slot. Passing one of
them to a memoized child keeps that child from rendering again while the
variants stay the same:

```tsx
import { memo } from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

const Label = memo(function Label({
  style,
  children,
}: {
  style: TextStyle;
  children: string;
}) {
  return <Text style={style}>{children}</Text>;
});
```

Create recipes at the top level of a module, never inside a component, so
that their cache lasts across renders, and do not copy or spread their
styles, which makes new objects.

## Agent skill

These practices, with those of
[Theming with design tokens](/recipe/native-recipe/themes/), ship with the
package as an [agent skill](/recipe/native-recipe/agent-skill/), which
teaches coding agents to keep styles stable and to build them from theme
tokens.

## Next steps

- [Cookbook](/recipe/native-recipe/cookbook/) has recipes for common
  components.
- [Typing recipes](/recipe/native-recipe/typescript/) covers the types of
  styles and props.
- [FAQ](/recipe/native-recipe/faq/) answers common questions.
