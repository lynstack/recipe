import type {
  NativeStyle,
  SlotStyles,
  VariantsOf,
} from "@lynstack/native-recipe";
import { createStyleRecipe } from "@lynstack/native-recipe";

import { badge, pill } from "./badge";
import { card, search } from "./card";
import { light } from "./theme";

type CardVariants = VariantsOf<typeof card>;
type BadgeVariants = VariantsOf<typeof badge>;

const cardVariants: CardVariants = { raised: true, size: "sm", tone: "danger" };
const cardStyle: NativeStyle = card(cardVariants);
const searchStyles: SlotStyles<"icon" | "label" | "root"> = search({
  open: true,
  size: "md",
});
const badgeVariants: BadgeVariants = { size: "sm", tone: "muted" };
const badgeStyle: NativeStyle = badge(light, badgeVariants);
const pillStyles: SlotStyles<"icon" | "label" | "root"> = pill(light, {
  closable: true,
  size: "sm",
});

const raisedCard = createStyleRecipe({
  composes: [card],
  variants: { inset: { true: { margin: 4 } } },
});
const raisedCardStyle: NativeStyle = raisedCard({
  inset: true,
  tone: "neutral",
});

export {
  badgeStyle,
  badgeVariants,
  cardStyle,
  cardVariants,
  pillStyles,
  raisedCardStyle,
  searchStyles,
};
export type { BadgeVariants, CardVariants };
export { box, field } from "./box";
export { card, search } from "./card";
export { badge, pill } from "./badge";
export { chip, light, tag, themed } from "./theme";
export type { Theme } from "./theme";
