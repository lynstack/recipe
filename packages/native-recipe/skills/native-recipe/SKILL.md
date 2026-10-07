---
name: native-recipe
description: Write React Native component styles with @lynstack/native-recipe (createStyleRecipe, createSlotStyleRecipe, createThemedRecipes) that stay stable between renders and come from theme tokens. Use this skill whenever you create or change a React Native component whose styles depend on props, state, the color scheme, or a theme in a project that imports @lynstack/native-recipe, whenever you add or edit a variant, compound variant, slot, composed recipe, theme, or token, and whenever you are tempted to build a style inline, copy a recipe's style, or wrap it in a style array, even if the user does not mention the library by name.
---

# Stable, themed styles with native-recipe

A recipe from `@lynstack/native-recipe` returns the same frozen style
object for the same variants. That identity is what makes styles cheap in
React Native: when the `style` prop is the same object as on the last
render, React skips comparing it, and a memoized child skips rendering.
Every rule below protects that identity, or the cache that produces it.
Breaking one never shows as a bug; the app just renders more and
allocates more, and nothing in the code says why.

**Check the setup first.** If the project calls `createThemedRecipes`,
usually in a module such as `src/theme/recipes.ts`, import
`createStyleRecipe` and `createSlotStyleRecipe` from that module for
every component that uses colors, spacing, radii, or type sizes, and take
those values from the theme. Find how components read the theme, usually
a `useTheme` hook, and use it. If the project has no theme, use the
functions of `@lynstack/native-recipe` directly, and see
[Adding themes](#adding-themes) when a task asks for dark mode or a
theme.

## The API at a glance

The package is recent, so do not guess its shapes; they are these.

```ts
import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
  type VariantsOf,
} from "@lynstack/native-recipe";

// One element: returns one style.
const badge = createStyleRecipe({
  base: { borderRadius: 999, paddingHorizontal: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#fee2e2" },
    },
    outlined: { true: { borderWidth: 1 } },
  },
  compoundVariants: [
    {
      variants: { tone: "danger", outlined: true },
      style: { borderColor: "#dc2626" },
    },
  ],
  defaultVariants: { tone: "neutral" },
});
badge({ tone: "danger", outlined: true }); // a frozen style
badge.variantKeys; // => ["tone", "outlined"]
badge.variantOptions; // => { tone: ["neutral", "danger"], outlined: ["false", "true"] }

// Several elements: every style is keyed by slot, and compound variants
// take `styles`, not `style`.
const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: { root: { borderRadius: 8 }, label: { fontWeight: "600" } },
  variants: {
    size: {
      sm: { root: { height: 32 }, label: { fontSize: 14 } },
      md: { root: { height: 40 }, label: { fontSize: 16 } },
    },
  },
  compoundVariants: [
    { variants: { size: "sm" }, styles: { label: { letterSpacing: 0.2 } } },
  ],
  defaultVariants: { size: "md" },
});
button({ size: "sm" }).label; // a frozen style for each slot

// Themed: the config is a function of the theme, and the recipe takes the
// theme first.
const { createStyleRecipe: createThemedStyleRecipe } =
  createThemedRecipes<Theme>();
const card = createThemedStyleRecipe((theme) => ({
  base: { backgroundColor: theme.colors.surface },
  variants: {},
}));
card(theme); // the style for this theme
card.withTheme(theme).variantKeys; // a plain recipe for one theme

type BadgeProps = VariantsOf<typeof badge>; // also works on themed recipes
```

- A variant without a default is required; one in `defaultVariants` may
  be left out.
- A variant with an option named `"true"` or `"false"` accepts booleans.
  A variant with only `"true"` is optional and `false` by default.
- A compound variant matches after defaults apply, takes one option or a
  list of options for each variant it names, and adds its style after
  the variants' styles.
- A recipe ignores props that are not variants, so it can take all of a
  component's props.
- `composes: [other]` adds the config of another recipe of the same kind
  (style recipe or slot style recipe) before its own; see
  [Compose a shared recipe](#compose-a-shared-recipe-instead-of-copying-its-config).

## Do

### Create every recipe once, at the top level of a module

A recipe's cache belongs to the recipe. A recipe created inside a
component is a new recipe on every render, with an empty cache, and
returns new objects every time.

```tsx
// Wrong: a new recipe, and new styles, on every render.
function Badge({ tone }: BadgeProps) {
  const badge = createStyleRecipe({ variants: { tone: tones } });
  return <View style={badge({ tone })} />;
}

// Right
const badge = createStyleRecipe({ variants: { tone: tones } });

function Badge({ tone }: BadgeProps) {
  return <View style={badge({ tone })} />;
}
```

The same holds for `createThemedRecipes`: call it once, in one module.
Leave the `cache` of a recipe's config unset: with `cache: false`, the
recipe returns a new object on every call, like a recipe created inside a
component.

### Put every choice a component offers in a variant

A style that depends on a prop or a state belongs in a recipe, as an
option of a variant, not in a lookup object, a ternary, or an inline
style object. The recipe checks the options at the type level and caches
the result.

```tsx
// Wrong: a new object or array on every render.
<View style={{ padding: 16, opacity: disabled ? 0.5 : 1 }} />
<View style={[styles.box, disabled && styles.disabled]} />

// Right
const box = createStyleRecipe({
  base: { padding: 16 },
  variants: { disabled: { true: { opacity: 0.5 } } },
});
<View style={box({ disabled })} />
```

When several props would set the same property, derive one variant in
the component, and let a compound variant style the combinations.

### Give a component of several elements one slot recipe

React Native styles do not cascade. A button and its label each need a
style, and both depend on the same variants, so use one slot recipe and
pass each slot to its element:

```tsx
const styles = button({ tone, size });
<Pressable style={styles.root}>
  <Text style={styles.label}>{title}</Text>
</Pressable>;
```

### Compose a shared recipe instead of copying its config

When several components share styles and variants, such as every
control's border and sizes, put them in one recipe and list it in the
`composes` of the others. The composed recipe's styles come first, so the
recipe that composes it overrides a property it sets again, and it
accepts the composed recipe's variants too.

```ts
const control = createStyleRecipe({
  base: { borderRadius: 8, borderWidth: 1 },
  variants: { size: { sm: { height: 32 }, md: { height: 40 } } },
  defaultVariants: { size: "md" },
});

const input = createStyleRecipe({
  composes: [control],
  base: { paddingHorizontal: 12 },
  variants: { invalid: { true: { borderColor: "#dc2626" } } },
});

input({ size: "sm", invalid: true });
// => { borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, height: 32, borderColor: "#dc2626" }
```

In a themed recipe, compose the recipe of the same theme:
`composes: [control.withTheme(theme)]`, with the `theme` the config
function receives. A compound variant of the composed recipe applies after
every option of the recipe that composes it; to override one, give that
recipe a compound variant with the same condition.

### Take colors, spacing, and sizes from the theme

In a project with a theme, a recipe's config is a function of the theme,
and every value that a token exists for comes from the theme, never as a
literal. Name new tokens by their role, such as `surface` or `onPrimary`,
so that each theme gives them its own value.

```ts
// Wrong: the dark theme gets the light theme's color.
const card = createStyleRecipe(() => ({
  base: { backgroundColor: "#ffffff", padding: 16 },
  variants: {},
}));

// Right
const card = createStyleRecipe((theme) => ({
  base: { backgroundColor: theme.colors.surface, padding: theme.space.lg },
  variants: {},
}));
```

Keep the variants and options the same for every theme; only the styles
may depend on the theme.

### Pass the theme object itself

A themed recipe keeps one compiled recipe and one cache for each theme
object. Pass the objects the theme module creates, through the provider,
unchanged. A theme built at runtime, such as one with a brand color from a
server, is built once for each set of inputs, with `useMemo`.

### Override only when there is an override

To let a component's user add a style, put it next to the recipe's style
in an array only when it is given, so that the prop keeps the recipe's
object otherwise:

```tsx
const boxStyle = box(variants);
<View style={style ? [boxStyle, style] : boxStyle} />;
```

## Adding themes

When a task asks for dark mode or a theme in a project that has none,
pick the smaller tool that fits:

- **A few colors in a few components:** make the color scheme a variant,
  such as `scheme: { light: {...}, dark: {...} }`, and select it with
  `useColorScheme() === "dark" ? "dark" : "light"`.
- **Anything larger, or a design system:** use theme tokens, so that a
  new theme changes no recipe:
  1. A tokens module with a `Theme` interface and one object for each
     theme, created once at the top level, with colors named by role.
  2. A recipes module that calls `createThemedRecipes<Theme>()` once and
     exports `createStyleRecipe` and `createSlotStyleRecipe`.
  3. A provider that passes one of those theme objects, chosen from
     `useColorScheme` or the user's preference, through a React context,
     and a `useTheme` hook that returns it unchanged.
  4. Recipes written as functions of the theme, called as
     `recipe(useTheme(), variants)` in components.

The full walkthrough, with a provider, is at
https://lynstack.github.io/recipe/native-recipe/themes/.

## Don't

### Don't copy, spread, or change a recipe's style

`{ ...box(variants), marginTop: 8 }` makes a new object on every render,
and a recipe's styles are frozen, so changing one throws in strict mode.
Add the property to the recipe, as a variant if it varies, or pass it as
an override.

### Don't create a theme object during a render

```tsx
// Wrong: a new theme on every render, so every recipe compiles again.
<ThemeContext value={{ ...light, colors: { ...light.colors, primary: brand } }}>
  {children}
</ThemeContext>
```

The same goes for a hook that returns a copy of the theme.

### Don't make a variant of a value that varies continuously

A variant holds a few choices. The window's width, a scroll offset, or an
animated value has no fixed set of options; pass it as an override, or
with the animation library's own styles.

### Don't pass a recipe's style through `StyleSheet.create`

`StyleSheet.create` returns the styles it is given and adds nothing to a
recipe's style, which is already checked against React Native's style
types. This is about a recipe's result only: a static style still belongs
in `StyleSheet.create` (see the next rule).

### Don't make a recipe of a style that never changes

A recipe earns its place when a style depends on a variant or on the
theme. A style with neither, such as a separator of a fixed height in a
project without a theme, stays in `StyleSheet.create` or a module-level
constant, which is just as stable and simpler to read.

```ts
// Wrong: a recipe with nothing to select.
const separator = createStyleRecipe({ base: { height: 12 }, variants: {} });

// Right
const styles = StyleSheet.create({ separator: { height: 12 } });
```

In a project with a theme, a static style that uses a token, such as
`theme.space.md`, does depend on the theme, so it is a themed recipe with
no variants.

## Checklist before you finish

- Is every recipe, and `createThemedRecipes`, created at the top level of
  a module, never inside a component or a hook?
- Is any style built inline, chosen by a lookup object or a conditional,
  or wrapped in an array without an override, where a variant would do?
- Is any recipe a static style with no variants and no tokens, which
  belongs in `StyleSheet.create`?
- Does any recipe copy the styles and variants of another, where it could
  compose it?
- Does any component copy, spread, or change a style a recipe returned?
- In a project with a theme, does any recipe write a color, spacing, or
  size that a token exists for?
- Is every theme object created once, or memoized, and passed unchanged?
