import type {
  NativeStyle,
  SlotStyles,
  VariantsOf,
} from "@lynstack/native-recipe";
import type { StyleProp, ViewStyle } from "react-native";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";

import {
  defineComposedSlots,
  defineThemed,
  defineThemedAsCreated,
  themed,
  withThemedDense,
} from "./themed-generic";
import type { Palette } from "./themed-generic";

const palette: Palette = {
  colors: { primary: "#2563eb", surface: "#ffffff" },
  radius: 8,
};

const badge = defineThemed((theme) => ({
  defaultVariants: { tone: "primary" },
  variants: {
    tone: {
      primary: { backgroundColor: theme.colors.primary },
      surface: { backgroundColor: theme.colors.surface },
    },
  },
}));

const chip = defineThemedAsCreated((theme) => ({
  variants: { size: { md: { borderRadius: theme.radius, height: 40 } } },
}));

const card = themed.createSlotStyleRecipe((theme) => ({
  base: { root: { borderRadius: theme.radius } },
  slots: ["root", "title"],
  variants: { raised: { true: { root: { elevation: 2 } } } },
}));

const lightChip = createStyleRecipe({
  composes: [chip.withTheme(palette)],
  variants: { round: { true: { borderRadius: 999 } } },
});

const lightCard = createSlotStyleRecipe({
  base: { footer: { paddingTop: 8 } },
  composes: [card.withTheme(palette)],
  slots: ["footer"],
  variants: {},
});

const panel = defineComposedSlots({
  composes: [lightCard],
  slots: ["body"],
  variants: { dense: { true: { body: { padding: 4 }, root: { margin: 0 } } } },
});

const { themeToken } = themed;

const pill = defineThemed(() => ({
  defaultVariants: { size: "sm" },
  variants: { size: { sm: { borderRadius: themeToken.radius } } },
}));

const sheet = themed.createSlotStyleRecipe(() => ({
  composes: [card.withTheme(themeToken)],
  compoundVariants: [
    {
      styles: { handle: { backgroundColor: themeToken.colors.primary } },
      variants: { open: true, raised: true },
    },
  ],
  slots: ["handle"],
  variants: { open: { true: { root: { height: 320 } } } },
}));

const denseChip = withThemedDense(lightChip);
const denseChipStyle: NativeStyle = denseChip(palette, {
  dense: true,
  size: "md",
});

type LightChipVariants = VariantsOf<typeof lightChip>;

const badgeStyle: StyleProp<ViewStyle> = badge(palette);
const chipStyle: StyleProp<ViewStyle> = chip(palette, { size: "md" });
const lightChipStyle: NativeStyle = lightChip({ round: true, size: "md" });
const lightCardStyles: SlotStyles<"footer" | "root" | "title"> = lightCard({
  raised: true,
});
const panelStyles: SlotStyles<"body" | "footer" | "root" | "title"> = panel({
  dense: true,
});
const pillStyle: StyleProp<ViewStyle> = pill(palette);
const sheetStyles: SlotStyles<"handle" | "root" | "title"> = sheet(palette, {
  open: true,
  raised: true,
});

export {
  badge,
  badgeStyle,
  card,
  chip,
  chipStyle,
  denseChip,
  denseChipStyle,
  lightChip,
  lightChipStyle,
  lightCard,
  lightCardStyles,
  panel,
  panelStyles,
  pill,
  pillStyle,
  sheet,
  sheetStyles,
};
export type { LightChipVariants };
