---
title: native-recipe FAQ
description: "Answers to common questions about native-recipe: StyleSheet.create, re-renders and theme objects, Animated values, dark mode, tsconfig errors, the Snack, and extra styles."
sidebar:
  label: FAQ
---

## Should I still use `StyleSheet.create`?

Yes, for static styles: a style that depends on no prop and no theme. A
recipe adds nothing to it. Use a recipe when a style depends on a variant
or on theme tokens. Do not pass a recipe's style through
`StyleSheet.create`: it is already checked and stable. See
[Building components](/recipe/native-recipe/building-components/#keep-static-styles-in-stylesheetcreate).

## Why is `variants` required?

The config type requires it, so that every recipe declares its variants
in one place. A recipe without variants writes `variants: {}`. Without it,
TypeScript reports `Property 'variants' is missing` (TS2741). In
JavaScript, creating the recipe throws a `TypeError` that says so. See
[createStyleRecipe](/recipe/native-recipe/create-style-recipe/#the-config).

## Why does the console warn that a recipe's config names what it does not declare?

A default, a compound variant, or a slot's style names a variant, an
option, or a slot that the config does not declare, usually a typo in a
config declared before the call, or returned by a themed recipe's
function, where TypeScript does not catch every one. The recipe adds no
style for that name. The message lists each one; fix the name, or
declare it. See
[Names the config does not declare](/recipe/native-recipe/create-style-recipe/#names-the-config-does-not-declare).

## Can I pass extra styles into a recipe call?

No. A recipe takes only variants. Merge extra styles in the `style` prop,
and only when there is one, so the prop keeps the recipe's object
otherwise:

```tsx
const boxStyle = box(variants);
<View style={style ? [boxStyle, style] : boxStyle} />;
```

See [Building components](/recipe/native-recipe/building-components/#overriding-styles).

## Why does my component re-render when the theme object is rebuilt?

A themed recipe keeps one cache for each theme object. A new object, even
with the same tokens, starts a new cache, so every style is a new object,
and every memoized child renders again. This happens when a provider
spreads a theme during a render, such as `{ ...light }`. Create each
theme once, or memoize a theme built at runtime with `useMemo`. See
[Theme identity](/recipe/native-recipe/create-themed-recipes/#theme-identity).

## Why does a themed recipe take the theme first?

A themed recipe is called as `recipe(theme, variants)`. The theme is
always required, but the variants are optional when every variant is
optional, so the theme comes first: `button(theme)` is a valid call. To get a
recipe that takes only variants, call `button.withTheme(theme)`. See
[createThemedRecipes](/recipe/native-recipe/create-themed-recipes/#calling-a-themed-recipe).

## Dark mode: a variant or theme tokens?

- **A variant**, such as `scheme: { light: {...}, dark: {...} }`, for a
  few colors in a few components.
- **Theme tokens**, with `createThemedRecipes`, for a design system or
  more than a few colors. A new theme then changes no recipe.

See [Theming with design tokens](/recipe/native-recipe/themes/).

## Can I use Animated values in a recipe?

Keep them out of recipes. A recipe holds styles for a fixed set of
options, and the types reject an `Animated.Value` for many properties,
such as `opacity` and `width`. Pass the animated style next to the
recipe's style, on an `Animated.View`:

```tsx
<Animated.View style={[box(variants), { opacity }]} />
```

The array is a new value on every render, which is fine for a style that
changes anyway.

## Why do I get type errors from React Native outside Expo?

A tsconfig written by hand often includes the DOM types, and checks the
declaration files of React Native. Both cause errors in React Native's
own types, such as `Duplicate identifier 'FormData'`. Set
`skipLibCheck: true`, and use `lib: ["ES2022"]`. Expo's
`expo/tsconfig.base` and `@react-native/typescript-config` already set
`skipLibCheck`. See
[Installation](/recipe/native-recipe/installation/#typescript-setup).

## Why is the Snack in JavaScript?

The editor of Expo Snack checks TypeScript with a version too old to read
the types of the package. So the example runs as JavaScript. The code is
the same, without the types. In your app, with TypeScript 5.4 or newer,
the types work.

## I get a `TypeError` that says to install one copy of `@lynstack/recipe`

native-recipe is built on `@lynstack/recipe`. A recipe can compose only
recipes that the same copy of `@lynstack/recipe` created. When the app
installs two copies, a recipe from one copy cannot compose a recipe from
the other, and creating it throws a `TypeError`. Check the copies with
`npm ls @lynstack/recipe`, and remove the duplicate with `npm dedupe`, or
`pnpm dedupe`.

The same `TypeError` appears when `composes` lists something that is not
a recipe of the same type, such as a slot recipe in a style recipe.
TypeScript reports that one first.

## Next steps

- [Glossary](/recipe/native-recipe/glossary/) defines every term.
- [Cookbook](/recipe/native-recipe/cookbook/) has ready-made recipes.
