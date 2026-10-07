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

export { button, dark, light };
