---
title: Themes and design tokens
description: "Build React Native styles from the tokens of a design system: define a light and a dark theme, provide them with a theme provider, follow the color scheme, and keep every style cached."
---

There are two ways to make styles depend on a theme:

- **A variant**, for a few colors in an app without a design system. Each
  recipe declares the styles of each theme.
- **Theme tokens**, for a design system. The colors, spacing, radii, and
  type sizes live in one theme object for each theme, and each recipe is
  built from the tokens, so adding a theme changes no recipe.

## A color scheme as a variant

Make the color scheme a variant, and select its option from
`useColorScheme`:

```tsx
import { createStyleRecipe } from "@lynstack/native-recipe";
import { Text, useColorScheme } from "react-native";

const title = createStyleRecipe({
  base: { fontSize: 24, fontWeight: "700" },
  variants: {
    scheme: {
      light: { color: "#111827" },
      dark: { color: "#f9fafb" },
    },
  },
  defaultVariants: { scheme: "light" },
});

export function Title({ children }: { children: string }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return <Text style={title({ scheme })}>{children}</Text>;
}
```

Each scheme is an option, so its styles are cached like any other
selection. This stays simple while a few recipes set a few colors. Once
every recipe repeats the same colors for each scheme, move them into
theme tokens.

## Theme tokens

The rest of this page builds a small design system: tokens for a light and
a dark theme, the recipe creators, a theme provider, and a button. It uses
these files:

```
src/theme/tokens.ts      the Theme type, and the light and dark themes
src/theme/recipes.ts     the recipe creators, bound to Theme
src/theme/provider.tsx   ThemeProvider and useTheme
src/components/button.tsx
```

### 1. Define the tokens

A theme is an object of tokens. Declare its type once, and create each
theme once, at the top level of a module:

```ts
// src/theme/tokens.ts
export interface Theme {
  readonly colors: {
    readonly background: string;
    readonly surface: string;
    readonly text: string;
    readonly textMuted: string;
    readonly border: string;
    readonly primary: string;
    readonly onPrimary: string;
    readonly danger: string;
  };
  readonly space: {
    readonly sm: number;
    readonly md: number;
    readonly lg: number;
  };
  readonly radius: { readonly md: number; readonly full: number };
  readonly fontSize: {
    readonly sm: number;
    readonly md: number;
    readonly lg: number;
  };
}

const space = { sm: 8, md: 12, lg: 16 };
const radius = { md: 8, full: 999 };
const fontSize = { sm: 14, md: 16, lg: 20 };

export const light: Theme = {
  colors: {
    background: "#ffffff",
    surface: "#f3f4f6",
    text: "#111827",
    textMuted: "#6b7280",
    border: "#d1d5db",
    primary: "#2563eb",
    onPrimary: "#ffffff",
    danger: "#dc2626",
  },
  space,
  radius,
  fontSize,
};

export const dark: Theme = {
  colors: {
    background: "#030712",
    surface: "#1f2937",
    text: "#f9fafb",
    textMuted: "#9ca3af",
    border: "#374151",
    primary: "#60a5fa",
    onPrimary: "#030712",
    danger: "#f87171",
  },
  space,
  radius,
  fontSize,
};
```

Name colors by their role, such as `surface` or `onPrimary`, not by their
value, so that each theme can give them its own value.

### 2. Create the recipe creators

Call `createThemedRecipes` once, with the theme type, and export its
recipe creators. Every component imports them from here, so their recipes
take a `Theme`:

```ts
// src/theme/recipes.ts
import { createThemedRecipes } from "@lynstack/native-recipe";
import type { Theme } from "./tokens";

export const { createStyleRecipe, createSlotStyleRecipe } =
  createThemedRecipes<Theme>();
```

### 3. Provide the theme

The package leaves the choice of theme to your app. A React context fits
most apps: a provider picks the theme from the color scheme, or from the
user's preference, and a hook reads it:

```tsx
// src/theme/provider.tsx
import { createContext, use, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { dark, light, type Theme } from "./tokens";

export type ColorSchemePreference = "system" | "light" | "dark";

const ThemeContext = createContext<Theme>(light);

export function ThemeProvider({
  preference = "system",
  children,
}: {
  preference?: ColorSchemePreference;
  children: ReactNode;
}) {
  const systemScheme = useColorScheme();
  const scheme = preference === "system" ? systemScheme : preference;
  return (
    <ThemeContext value={scheme === "dark" ? dark : light}>
      {children}
    </ThemeContext>
  );
}

export function useTheme(): Theme {
  return use(ThemeContext);
}
```

The provider passes `light` or `dark` themselves, never a copy, so each
theme keeps its identity, and with it the cache of every recipe (see
[Keep each theme stable](#keep-each-theme-stable)). Wrap the app in it:

```tsx
// App.tsx
import { ThemeProvider } from "./src/theme/provider";

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
```

Pass `preference` from your settings to let the user choose light or dark
over the system's color scheme.

### 4. Write recipes with tokens

A recipe's config is a function of the theme. Variants still choose
between options; the tokens give the options their values:

```ts
// src/components/button.styles.ts
import { createSlotStyleRecipe } from "../theme/recipes";

export const button = createSlotStyleRecipe((theme) => ({
  slots: ["root", "label"],
  base: {
    root: {
      alignItems: "center",
      borderRadius: theme.radius.md,
      flexDirection: "row",
      justifyContent: "center",
    },
    label: { fontWeight: "600" },
  },
  variants: {
    tone: {
      primary: {
        root: { backgroundColor: theme.colors.primary },
        label: { color: theme.colors.onPrimary },
      },
      outline: {
        root: { borderColor: theme.colors.border, borderWidth: 1 },
        label: { color: theme.colors.text },
      },
      danger: {
        root: { backgroundColor: theme.colors.danger },
        label: { color: theme.colors.onPrimary },
      },
    },
    size: {
      sm: {
        root: { height: 32, paddingHorizontal: theme.space.md },
        label: { fontSize: theme.fontSize.sm },
      },
      md: {
        root: { height: 40, paddingHorizontal: theme.space.lg },
        label: { fontSize: theme.fontSize.md },
      },
    },
  },
  defaultVariants: { tone: "primary", size: "md" },
}));
```

The same recipe returns the styles of each theme:

```ts
button(light, { tone: "outline" }).label;
// => { fontWeight: "600", color: "#111827", fontSize: 16 }

button(dark, { tone: "outline" }).label;
// => { fontWeight: "600", color: "#f9fafb", fontSize: 16 }
```

A style that no theme changes, such as `fontWeight` here, is written as
it is; only tokens come from the theme.

### 5. Use them in components

A component reads the theme with the hook and passes it to the recipe,
with its variants. `VariantsOf` types the variants of a themed recipe:

```tsx
// src/components/button.tsx
import type { VariantsOf } from "@lynstack/native-recipe";
import { Pressable, Text } from "react-native";
import { useTheme } from "../theme/provider";
import { button } from "./button.styles";

type ButtonProps = VariantsOf<typeof button> & {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress, ...variants }: ButtonProps) {
  const styles = button(useTheme(), variants);
  return (
    <Pressable style={styles.root} onPress={onPress}>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}
```

When the color scheme changes, the provider passes the other theme, every
component that reads it renders again, and each recipe returns the styles
of that theme: built on the first switch, from the cache after that.

## Keep each theme stable

A themed recipe keeps one compiled recipe, with its cache, for each theme
object. A new object, even with the same tokens, compiles a new recipe
and starts with an empty cache, so it costs as much as a first call on
every render.

Pass the theme objects themselves:

```tsx
// Wrong: a new object on every render.
<ThemeContext value={{ ...light, colors: { ...light.colors, primary: brand } }}>
  {children}
</ThemeContext>;

// Wrong: a new object on every read.
const theme = { ...use(ThemeContext) };
```

A theme built at runtime, such as one with a brand color loaded from a
server, is fine as long as it is built once for each set of inputs.
Memoize it on what it is built from:

```tsx
const theme = useMemo(
  () => ({ ...base, colors: { ...base.colors, primary: brandColor } }),
  [base, brandColor],
);
```

A theme that is no longer referenced is released with its recipe.

## More than two themes

The provider can pick from any number of themes, such as a high-contrast
theme or one theme for each brand. Keep them in an object, and pick one by
name:

```ts
export const themes = { light, dark, highContrast } as const;
export type ThemeName = keyof typeof themes;
```

Every theme has the same type, so every recipe works with every theme.

## Themes and variants together

A theme is the context a component renders in, and applies to the whole
app; a variant is a choice that each use of a component makes. Keep
the color scheme, the brand, and the density in the theme, and the tone,
the size, and the state of a component in its variants. Compound variants
combine variants as usual, with styles built from the theme.

The config of every theme must declare the same variants and options;
only the styles depend on the theme.

## Passing a theme's recipe down

`withTheme` returns the recipe of one theme, a plain recipe, which a
child can call without knowing about themes:

```ts
const outline = button.withTheme(light);

outline({ tone: "outline" }) === button(light, { tone: "outline" }); // => true
outline.variantKeys; // => ["tone", "size"]
```

## Values that do not fit a theme

A value that varies continuously, such as the window's width or an
animated value, fits neither a variant nor a theme. Pass it in a style
next to the recipe's (see
[Building components](/recipe/native-recipe/building-components/#overriding-styles)).
