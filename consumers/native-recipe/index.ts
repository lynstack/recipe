import type {
  NativeStyle,
  SlotStyles,
  ThemedRecipe,
  VariantsOf,
} from "@lynstack/native-recipe";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";

import { define, defineComposed, defineSlots, withFooter } from "./define.js";

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

const iconBox = createStyleRecipe({
  composes: [box],
  variants: { size: { sm: { height: 32, width: 32 } } },
});

type IconBoxVariants = VariantsOf<typeof iconBox>;

const button = createSlotStyleRecipe({
  base: { label: { fontWeight: "600" }, root: { alignItems: "center" } },
  slots: ["root", "label"],
  variants: { size: { md: { label: { fontSize: 16 }, root: { height: 40 } } } },
});

const labeledButton = createSlotStyleRecipe({
  base: { icon: { width: 16 }, root: { gap: 8 } },
  composes: [button],
  slots: ["icon"],
  variants: {},
});

const style: StyleProp<ViewStyle> = box({ tone: "danger" });
const iconBoxStyle: StyleProp<ViewStyle> = iconBox({
  size: "sm",
  tone: "neutral",
});
const iconStyle: StyleProp<ViewStyle> = labeledButton({ size: "md" }).icon;
const rootStyle: StyleProp<ViewStyle> = button({ size: "md" }).root;
const labelStyle: StyleProp<TextStyle> = button({ size: "md" }).label;
const anyStyle: NativeStyle = box({ tone: "neutral" });
const boxKeys: readonly ("disabled" | "size" | "tone")[] = box.variantKeys;
const boxOptions: { readonly size: readonly ("lg" | "md")[] } =
  box.variantOptions;
const boxDefaults: { readonly disabled: "false" | "true" } =
  box.defaultVariants;

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

const iconChip = themed.createStyleRecipe((theme) => ({
  base: { width: 24 },
  composes: [chip.withTheme(theme)],
  variants: {},
}));

type ChipVariants = VariantsOf<typeof chip>;

const theme: Theme = { colors: { primary: "#2563eb" } };
const chipStyle: StyleProp<ViewStyle> = chip(theme, { tone: "primary" });
const tagLabelStyle: StyleProp<TextStyle> = tag(theme, {
  tone: "primary",
}).label;
const chipKeys: readonly "tone"[] = chip.withTheme(theme).variantKeys;
const chipOptions: { readonly tone: readonly "primary"[] } =
  chip.withTheme(theme).variantOptions;
const iconChipStyle: StyleProp<ViewStyle> = iconChip(theme, {
  tone: "primary",
});
const anyChip: ThemedRecipe<
  Theme,
  ChipVariants,
  { readonly backgroundColor?: string }
> = chip;

const fade = define({
  defaultVariants: { tone: "neutral" },
  variants: { tone: { danger: { opacity: 1 }, neutral: { opacity: 0.5 } } },
});
const fadeStyle: NativeStyle = fade();
const field = defineSlots({
  slots: ["label", "input"],
  variants: { size: { sm: { input: { height: 24 } } } },
});
const fieldStyles: SlotStyles<"label" | "input"> = field({ size: "sm" });

/** Configs whose styles are arrays of styles, which the types reject. */
function createArrayStyleRecipes(): void {
  const styles = [{ padding: 8 }];
  // @ts-expect-error: a style is an object, not an array of styles.
  createStyleRecipe({ base: styles, variants: {} });
  // @ts-expect-error: a style is an object, not an array of styles.
  createStyleRecipe({ base: [{ padding: 8 }], variants: {} });
  // @ts-expect-error: a style is an object, not an array of styles.
  createStyleRecipe({ variants: { size: { sm: [{ padding: 8 }] } } });
}

const compactBox = defineComposed({
  composes: [box],
  variants: { size: { xs: { height: 24 } } },
});
const compactBoxStyle: NativeStyle = compactBox({
  size: "xs",
  tone: "neutral",
});

const footedButton = withFooter(button);
const footedButtonStyles: Readonly<
  Record<"root" | "label" | "footer", NativeStyle>
> = footedButton({ dense: true, size: "md" });

export {
  compactBox,
  compactBoxStyle,
  footedButton,
  footedButtonStyles,
  anyChip,
  anyStyle,
  box,
  boxDefaults,
  boxKeys,
  boxOptions,
  button,
  chip,
  chipKeys,
  chipOptions,
  chipStyle,
  createArrayStyleRecipes,
  fade,
  fadeStyle,
  field,
  fieldStyles,
  iconBox,
  iconBoxStyle,
  iconChip,
  iconChipStyle,
  iconStyle,
  labelStyle,
  labeledButton,
  rootStyle,
  style,
  tag,
  tagLabelStyle,
};
export type { BoxVariants, ChipVariants, IconBoxVariants };
