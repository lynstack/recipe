import type {
  NativeStyle,
  SlotStyles,
  VariantsOf,
} from "native-recipe-library";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  box,
  button,
  card,
  chip,
  iconButton,
  light,
} from "native-recipe-library";
import {
  badge,
  card as isolatedCard,
  light as isolatedLight,
  search,
} from "native-recipe-library-isolated";

type BoxVariants = VariantsOf<typeof box>;
type ChipVariants = VariantsOf<typeof chip>;

const boxVariants: BoxVariants = { size: "lg", tone: "danger" };
const boxStyle: StyleProp<ViewStyle> = box(boxVariants);
const boxKeys: readonly ("disabled" | "size" | "tone")[] = box.variantKeys;
const boxOptions: { readonly size: readonly ("lg" | "md")[] } =
  box.variantOptions;
const boxDefaults: { readonly size: "lg" | "md" } = box.defaultVariants;
const labelStyle: StyleProp<TextStyle> = button({ size: "sm" }).label;
const iconButtonStyles: SlotStyles<"icon" | "label" | "root"> = iconButton({
  round: true,
});

const chipVariants: ChipVariants = { tone: "surface" };
const chipStyle: StyleProp<ViewStyle> = chip(light, chipVariants);
const chipKeys: readonly "tone"[] = chip.withTheme(light).variantKeys;
const cardStyles: SlotStyles<"root" | "title"> = card(light, {
  raised: true,
  tone: "accent",
});

const isolatedCardStyle: NativeStyle = isolatedCard({
  raised: true,
  tone: "neutral",
});
const searchStyles: SlotStyles<"icon" | "label" | "root"> = search({
  open: true,
  size: "sm",
});
const badgeStyle: NativeStyle = badge(isolatedLight, { size: "sm" });

export {
  badgeStyle,
  boxDefaults,
  boxKeys,
  boxOptions,
  boxStyle,
  boxVariants,
  cardStyles,
  chipKeys,
  chipStyle,
  chipVariants,
  iconButtonStyles,
  isolatedCardStyle,
  labelStyle,
  searchStyles,
};
export type { BoxVariants, ChipVariants };
