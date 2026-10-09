import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";

interface Theme {
  readonly colors: { readonly primary: string; readonly surface: string };
  readonly space: number;
}

const light: Theme = {
  colors: { primary: "#2563eb", surface: "#ffffff" },
  space: 4,
};

// The themed creators that users of the design system extend it with.
const themed = createThemedRecipes<Theme>();
const { themeToken } = themed;

const box = createStyleRecipe({
  base: { borderRadius: 8 },
  compoundVariants: [
    { style: { borderWidth: 2 }, variants: { size: "lg", tone: "danger" } },
  ],
  defaultVariants: { size: "md" },
  variants: {
    disabled: { true: { opacity: 0.5 } },
    size: { lg: { height: 48 }, md: { height: 40 } },
    tone: { danger: { backgroundColor: "#dc2626" }, neutral: {} },
  },
});

const button = createSlotStyleRecipe({
  base: { label: { fontWeight: "600" }, root: { alignItems: "center" } },
  defaultVariants: { size: "md" },
  slots: ["root", "label"],
  variants: {
    size: {
      md: { label: { fontSize: 16 }, root: { height: 40 } },
      sm: { label: { fontSize: 14 }, root: { height: 32 } },
    },
  },
});

const iconButton = createSlotStyleRecipe({
  base: { icon: { width: 16 }, root: { gap: 8 } },
  composes: [button],
  slots: ["icon"],
  variants: { round: { true: { root: { borderRadius: 999 } } } },
});

const chip = themed.createStyleRecipe((theme) => ({
  base: { padding: theme.space },
  defaultVariants: { tone: "primary" },
  variants: {
    tone: {
      primary: { backgroundColor: theme.colors.primary },
      surface: { backgroundColor: theme.colors.surface },
    },
  },
}));

const card = themed.createSlotStyleRecipe(() => ({
  base: { root: { padding: themeToken.space }, title: { fontSize: 18 } },
  compoundVariants: [
    {
      styles: { title: { color: themeToken.colors.primary } },
      variants: { raised: true, tone: "accent" },
    },
  ],
  slots: ["root", "title"],
  variants: {
    raised: { true: { root: { elevation: 2 } } },
    tone: { accent: { root: { borderColor: themeToken.colors.primary } } },
  },
}));

export { box, button, card, chip, iconButton, light, themed };
export type { Theme };
