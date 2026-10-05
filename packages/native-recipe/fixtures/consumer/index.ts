import type {
  NativeStyle,
  ThemedRecipe,
  VariantsOf,
} from "@lynstack/native-recipe";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";

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

type BoxVariants = VariantsOf<typeof box>;

const button = createSlotStyleRecipe({
  base: { label: { fontWeight: "600" }, root: { alignItems: "center" } },
  slots: ["root", "label"],
  variants: { size: { md: { label: { fontSize: 16 }, root: { height: 40 } } } },
});

const style: StyleProp<ViewStyle> = box({ tone: "danger" });
const rootStyle: StyleProp<ViewStyle> = button({ size: "md" }).root;
const labelStyle: StyleProp<TextStyle> = button({ size: "md" }).label;
const anyStyle: NativeStyle = box({ tone: "neutral" });
const boxKeys: readonly ("disabled" | "size" | "tone")[] = box.variantKeys;

interface Theme {
  readonly colors: { readonly primary: string };
}

const themed = createThemedRecipes<Theme>();

const chip = themed.createStyleRecipe((theme) => ({
  variants: { tone: { primary: { backgroundColor: theme.colors.primary } } },
}));

const tag = themed.createSlotStyleRecipe((theme) => ({
  slots: ["root", "label"],
  variants: { tone: { primary: { label: { color: theme.colors.primary } } } },
}));

type ChipVariants = VariantsOf<typeof chip>;

const theme: Theme = { colors: { primary: "#2563eb" } };
const chipStyle: StyleProp<ViewStyle> = chip(theme, { tone: "primary" });
const tagLabelStyle: StyleProp<TextStyle> = tag(theme, {
  tone: "primary",
}).label;
const chipKeys: readonly "tone"[] = chip.withTheme(theme).variantKeys;
const anyChip: ThemedRecipe<
  Theme,
  ChipVariants,
  { readonly backgroundColor?: string }
> = chip;

export {
  anyChip,
  anyStyle,
  box,
  boxKeys,
  button,
  chip,
  chipKeys,
  chipStyle,
  labelStyle,
  rootStyle,
  style,
  tag,
  tagLabelStyle,
};
export type { BoxVariants, ChipVariants };
