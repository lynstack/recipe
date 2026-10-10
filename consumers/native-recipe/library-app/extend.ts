import type { NativeStyle, SlotStyles, Theme } from "native-recipe-library";
import {
  box,
  button,
  card,
  chip,
  define,
  defineComposed,
  defineComposedRecipe,
  defineRecipe,
  defineSlotRecipe,
  defineSlots,
  defineThemedRecipe,
  iconButton,
  light,
  themed,
  withFooter,
} from "native-recipe-library";
import {
  field,
  light as isolatedLight,
  tag,
  themed as isolatedThemed,
} from "native-recipe-library-isolated";

// Exporting a recipe would need the app to depend on @lynstack/native-recipe.
const toolbar = themed.createSlotStyleRecipe((theme: Theme) => ({
  base: { root: { gap: theme.space } },
  composes: [iconButton],
  slots: ["divider"],
  variants: { dense: { true: { divider: { width: 1 } } } },
}));
const tile = themed.createStyleRecipe((theme: Theme) => ({
  composes: [chip.withTheme(theme), box],
  variants: { pressed: { true: { opacity: 0.8 } } },
}));
const sheet = themed.createSlotStyleRecipe(() => ({
  composes: [card.withTheme(themed.themeToken)],
  slots: ["handle"],
  variants: {
    open: {
      true: { handle: { backgroundColor: themed.themeToken.colors.primary } },
    },
  },
}));
const pillTag = isolatedThemed.createSlotStyleRecipe((theme) => ({
  composes: [tag.withTheme(theme)],
  slots: ["close"],
  variants: { closable: { true: { close: { width: theme.gap } } } },
}));

const avatar = define({
  defaultVariants: { size: "md" },
  variants: { size: { md: { width: 40 }, sm: { width: 32 } } },
});
const fab = defineComposed({
  composes: [box],
  variants: { size: { xl: { height: 64 } } },
});
const alert = defineSlots({
  slots: ["root", "icon"],
  variants: { tone: { danger: { icon: { tintColor: "red" } } } },
});
const footedField = withFooter(field);
const footedButton = withFooter(button);
const pressable = defineComposedRecipe({
  composes: [box],
  variants: { pressed: { true: { opacity: 0.8 } } },
});
const notice = defineRecipe({
  defaultVariants: { tone: "info" },
  variants: { tone: { info: { opacity: 1 }, warn: { opacity: 0.8 } } },
});
const tabs = defineSlotRecipe({
  slots: ["list", "tab"],
  variants: { size: { sm: { tab: { padding: 4 } } } },
});
const spacer = defineThemedRecipe((theme) => ({
  variants: { size: { md: { height: theme.space * 4 } } },
}));

const toolbarStyles: SlotStyles<"divider" | "icon" | "label" | "root"> =
  toolbar(light, { dense: true, round: true });
const tileStyle: NativeStyle = tile(light, { pressed: true, tone: "surface" });
const sheetStyles: SlotStyles<"handle" | "root" | "title"> = sheet(light, {
  open: true,
  raised: true,
  tone: "accent",
});
const pillTagStyles: SlotStyles<"close" | "label" | "root"> = pillTag(
  isolatedLight,
  { closable: true, size: "sm" },
);
const pressableStyle: NativeStyle = pressable({
  pressed: true,
  tone: "danger",
});
const noticeStyle: NativeStyle = notice({ tone: "warn" });
const tabsStyles: SlotStyles<"list" | "tab"> = tabs({ size: "sm" });
const spacerStyle: NativeStyle = spacer(light, { size: "md" });
const avatarStyle: NativeStyle = avatar();
const fabStyle: NativeStyle = fab({ size: "xl", tone: "neutral" });
const alertStyles: SlotStyles<"icon" | "root"> = alert({ tone: "danger" });
const footedFieldStyles: SlotStyles<"footer" | "label" | "root"> = footedField({
  dense: true,
  size: "sm",
});
const footedButtonStyles: SlotStyles<"footer" | "label" | "root"> =
  footedButton({ dense: true });

export {
  alertStyles,
  avatarStyle,
  fabStyle,
  footedButtonStyles,
  footedFieldStyles,
  noticeStyle,
  pressableStyle,
  pillTagStyles,
  sheetStyles,
  spacerStyle,
  tabsStyles,
  tileStyle,
  toolbarStyles,
};
