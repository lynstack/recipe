import type {
  ComposedDefaultedName,
  KindCompoundVariant,
  KindSlotCompoundVariant,
  SlotValues,
} from "@lynstack/recipe";
import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};
const styleRecipe = createRecipeKind(styleKind);
const slotStyleRecipe = createSlotRecipeKind(styleKind);

// Each part of a config is declared before the call, with its public type.
const textVariants = {
  size: { md: { fontSize: 16 }, sm: { fontSize: 12 } },
  tone: { muted: { opacity: 0.6 } },
} as const;
const textCompounds: readonly KindCompoundVariant<
  typeof textVariants,
  Style
>[] = [{ value: { fontWeight: 600 }, variants: { size: "md", tone: "muted" } }];
const text = styleRecipe({
  compoundVariants: textCompounds,
  defaultVariants: { size: "md" },
  variants: textVariants,
});

const cardVariants = {
  raised: { true: { root: { elevation: 2 } } },
} as const;
const cardBase: SlotValues<"root" | "title", Style> = {
  root: { padding: 16 },
};
const cardCompounds: readonly KindSlotCompoundVariant<
  typeof cardVariants,
  "root" | "title",
  Style
>[] = [{ value: { title: { fontWeight: 700 } }, variants: { raised: true } }];
const card = slotStyleRecipe({
  base: cardBase,
  compoundVariants: cardCompounds,
  slots: ["root", "title"],
  variants: cardVariants,
});

const textDefaulted: readonly ComposedDefaultedName<
  readonly [typeof text],
  "tone"
>[] = ["size", "tone"];

const textStyle: Style = text({ tone: "muted" });
const cardStyles: Readonly<Record<"root" | "title", Style>> = card({
  raised: true,
});

export { card, cardStyles, text, textDefaulted, textStyle };
