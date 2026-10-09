import { createThemedRecipes } from "@lynstack/native-recipe";

interface Theme {
  readonly colors: { readonly primary: string; readonly surface: string };
  readonly radius: number;
}

const { createStyleRecipe, themeToken } = createThemedRecipes<Theme>();

const button = createStyleRecipe(() => ({
  base: { borderRadius: themeToken.radius },
  variants: {
    tone: {
      primary: { backgroundColor: themeToken.colors.primary },
      surface: { backgroundColor: themeToken.colors.surface },
    },
  },
  defaultVariants: { tone: "primary" },
}));

const iconButton = createStyleRecipe(() => ({
  // The button of the same theme as this icon button.
  composes: [button.withTheme(themeToken)],
  base: { width: 40, height: 40 },
  variants: {},
}));

const light: Theme = {
  colors: { primary: "#2563eb", surface: "#ffffff" },
  radius: 8,
};

const dark: Theme = {
  colors: { primary: "#60a5fa", surface: "#111827" },
  radius: 8,
};

export { button, dark, iconButton, light };
