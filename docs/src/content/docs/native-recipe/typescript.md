---
title: native-recipe with TypeScript
description: "How native-recipe checks React Native styles like StyleSheet.create, infers the style a recipe returns, types themed recipes, and types props with VariantsOf."
sidebar:
  label: TypeScript
---

The types are inferred from the config: write the config inline, or
declare it with `as const`, and pass it to the recipe creator. A library
that exports its recipes, or sets `isolatedDeclarations`, also needs
[Exporting and wrapping recipes](/recipe/native-recipe/exporting-recipes/).

## A config declared before the call

Declare a config before the call `as const`, so that the options named in
its compound and default variants stay literal types. The same holds for
the `slots` of a slot recipe: a list declared without `as const` is a
`string[]`, so the slot recipe takes any slot name, and a misspelled slot
in `base`, in the variants, or in the result is not a type error.

TypeScript also checks a declared config less than one written in the
call, since it reports a name that a type does not declare only in an
object written where that type is expected. In a declared config, and in
the config that a themed recipe's function returns, a misspelled variant
name next to a correct one in the variants that a compound variant names
is not a type error. The recipe warns about it when it is created, and
the compound variant never matches; see
[Names the config does not declare](/recipe/native-recipe/create-style-recipe/#names-the-config-does-not-declare).

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

## Chains of composed recipes

Before TypeScript 5.9, the work of checking a chain of recipes, each of
which composes the one before, grows exponentially with its length,
about fourfold with each recipe. A chain of about eight recipes compiled
in the same project fails with "Type instantiation is excessively deep
and possibly infinite", and a shorter one already slows the editor down.
TypeScript 5.9 and newer check the same chain in time that grows
linearly.

With an older TypeScript:

- List the recipes in one `composes` rather than chaining them: a recipe
  that composes ten recipes costs about what each of them costs.
- A recipe imported from a package, through its emitted declarations,
  counts as one recipe, however many recipes it composes.
- Or upgrade to TypeScript 5.9 or newer.

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

createStyleRecipe((theme: Theme) => ({
  variants: {
    // Error: Theme has no spacing.
    size: { sm: { padding: theme.spacing } },
  },
}));
```

Type the `theme` parameter, as above. Without its type, an editor
completes nothing in a config that has an error, such as one you are
writing (see
[Editor completions](/recipe/native-recipe/create-themed-recipes/#editor-completions)).

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

A function of yours that takes a config and returns its recipe is typed
in
[Exporting and wrapping recipes](/recipe/native-recipe/exporting-recipes/#a-function-generic-over-a-config).

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

- [Exporting and wrapping recipes](/recipe/native-recipe/exporting-recipes/)
  annotates exported recipes for `isolatedDeclarations`, and types a
  function that creates recipes.
- [All exports](/recipe/native-recipe/exports/) lists every type, with
  its type parameters.
- [Building components](/recipe/native-recipe/building-components/) uses
  `VariantsOf` in real components.
- [FAQ](/recipe/native-recipe/faq/#why-do-i-get-type-errors-from-react-native-outside-expo)
  fixes tsconfig errors outside Expo.
