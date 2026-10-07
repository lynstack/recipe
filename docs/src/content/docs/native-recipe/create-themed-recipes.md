---
title: createThemedRecipes
description: "Create style recipes and slot style recipes whose styles are built from the tokens of a theme, and get the same frozen styles for the same theme and variants."
sidebar:
  badge: Updated
head:
  - tag: title
    content: "createThemedRecipes: themed React Native styles | lynstack recipe"
---

`createThemedRecipes` returns `createStyleRecipe` and
`createSlotStyleRecipe` for a theme type. Each takes a function that
returns the config of the recipe for a theme, and returns a themed recipe,
which takes the theme first, then the selection.

```ts
import { createThemedRecipes } from "@lynstack/native-recipe";

interface Theme {
  readonly colors: { readonly primary: string; readonly surface: string };
  readonly radius: number;
}

const { createStyleRecipe } = createThemedRecipes<Theme>();

const button = createStyleRecipe((theme) => ({
  base: { borderRadius: theme.radius },
  variants: {
    tone: {
      primary: { backgroundColor: theme.colors.primary },
      surface: { backgroundColor: theme.colors.surface },
    },
  },
  defaultVariants: { tone: "primary" },
}));

const light: Theme = {
  colors: { primary: "#2563eb", surface: "#ffffff" },
  radius: 8,
};
const dark: Theme = {
  colors: { primary: "#60a5fa", surface: "#111827" },
  radius: 8,
};

button(light, { tone: "surface" });
// => { borderRadius: 8, backgroundColor: "#ffffff" }
button(dark, { tone: "surface" });
// => { borderRadius: 8, backgroundColor: "#111827" }
```

Call `createThemedRecipes` once, in a module of your own, and import its
recipe creators wherever you create recipes (see
[Themes and design tokens](/recipe/native-recipe/themes/)). It creates
nothing at runtime but the two functions; the type parameter is what it
adds.

## The config function

The function receives a theme and returns the config of a
[style recipe](/recipe/native-recipe/create-style-recipe/) or a
[slot style recipe](/recipe/native-recipe/create-slot-style-recipe/),
with the same properties and the same checks. Its variants, options, and
slots are inferred from what it returns, so a themed recipe has the same
types as a recipe written without a theme, with the values of tokens typed
as the theme types them.

The config of every theme must declare the same variants, options, and
slots; only the styles may depend on the theme. Branch on a token's value
inside a style, never around a variant.

## Calling a themed recipe

A themed recipe takes the theme, then the selection, which is optional
when every variant is:

```ts
button(light); // => { borderRadius: 8, backgroundColor: "#2563eb" }
button(light) === button(light, { tone: "primary" }); // => true
```

It returns the same frozen styles for the same theme and variants. The
first call with a theme object builds the config for that theme and
compiles a recipe from it; later calls with the same object reuse it, so
each theme has its own cache, kept when another theme is used:

```ts
const surface = button(light, { tone: "surface" });
button(dark, { tone: "surface" });
button(light, { tone: "surface" }) === surface; // => true
```

A theme object must keep its identity for its cache to last: a new
object, even with the same tokens, compiles a new recipe (see
[Keep each theme stable](/recipe/native-recipe/themes/#keep-each-theme-stable)).
A theme that is no longer referenced is released with its recipe.

## `withTheme`

`withTheme` returns the recipe of one theme: a plain recipe, the same one
for the same theme object, with the names of its variants in
`variantKeys`.

```ts
const lightButton = button.withTheme(light);

lightButton({ tone: "surface" }) === button(light, { tone: "surface" }); // => true
lightButton.variantKeys; // => ["tone"]
```

Use it to read `variantKeys`, or to pass a recipe to code that takes a
plain recipe, such as a child component that does not know about themes.

## Composing themed recipes

A themed recipe composes the recipe of its theme: list
`withTheme(theme)` in `composes`, with the theme its config function
receives, so that each theme composes the recipe of the same theme.

```ts
const iconButton = createStyleRecipe((theme) => ({
  composes: [button.withTheme(theme)],
  base: { width: 40, height: 40 },
  variants: {},
}));

iconButton(dark, { tone: "surface" });
// => { borderRadius: 8, width: 40, height: 40, backgroundColor: "#111827" }
```

A themed recipe can also compose recipes without a theme, and a slot
recipe composes the `withTheme(theme)` of a themed slot recipe in the same
way. See [Composing recipes](/recipe/native-recipe/create-style-recipe/#composing-recipes)
for how the configs merge.

## Slot recipes

`createSlotStyleRecipe` works the same way for slot recipes:

```ts
const { createSlotStyleRecipe } = createThemedRecipes<Theme>();

const card = createSlotStyleRecipe((theme) => ({
  slots: ["root", "title"],
  base: { root: { borderRadius: theme.radius }, title: { fontSize: 16 } },
  variants: {
    raised: { true: { root: { backgroundColor: theme.colors.surface } } },
  },
}));

card(dark, { raised: true });
// => { root: { borderRadius: 8, backgroundColor: "#111827" }, title: { fontSize: 16 } }
```

## Types

`VariantsOf` returns the variants of a themed recipe, as of any recipe:

```ts
import type { VariantsOf } from "@lynstack/native-recipe";

type ButtonVariants = VariantsOf<typeof button>;
// => { readonly tone?: "primary" | "surface" | undefined }
```

`ThemedRecipe` is the type of a themed recipe, and `ThemedRecipeCreators`
the type of what `createThemedRecipes` returns.
