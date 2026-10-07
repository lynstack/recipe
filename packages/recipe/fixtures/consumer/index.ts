import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
  CreateKindRecipe,
  CreateKindSlotRecipe,
  KindRecipe,
  RecipeKind,
  VariantKey,
  VariantsOf,
} from "@lynstack/recipe";
import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind: RecipeKind<Style, Style, Style> = {
  finish: (style) => Object.freeze(style),
  initial: (base) => ({ ...base }),
  reduce: (style, value) => ({ ...style, ...value }),
};

const styleRecipe: CreateKindRecipe<Style, Style> = createRecipeKind(styleKind);

const text = styleRecipe({
  base: { color: "black" },
  compoundVariants: [{ value: { fontWeight: 700 }, variants: { size: "lg" } }],
  defaultVariants: { size: "sm" },
  variants: { size: { lg: { fontSize: 24 }, sm: { fontSize: 12 } } },
});

const slotStyleRecipe: CreateKindSlotRecipe<Style, Style> =
  createSlotRecipeKind(styleKind);

const card = slotStyleRecipe({
  base: { root: { padding: 16 } },
  compoundVariants: [
    { value: { title: { fontWeight: 600 } }, variants: { tone: "dark" } },
  ],
  defaultVariants: { tone: "light" },
  slots: ["root", "title"],
  variants: {
    tone: {
      dark: { root: { backgroundColor: "black" }, title: { color: "white" } },
      light: { root: { backgroundColor: "white" } },
    },
  },
});

const cardStyles: Readonly<Record<"root" | "title", Style>> = card({
  tone: "dark",
});
const cardKeys: readonly "tone"[] = card.variantKeys;
const style: Style = text({ size: "lg" });
const textKeys: readonly "size"[] = text.variantKeys;
const recipe: KindRecipe<{ readonly size?: "sm" | "lg" }, Style> = text;
const variants: VariantsOf<typeof text> = { size: "lg" };
const textKey: VariantKey<VariantsOf<typeof text>> = "size";

const emphasis = styleRecipe({
  composes: [text],
  compoundVariants: [{ value: { color: "red" }, variants: { size: "lg" } }],
  variants: { size: { xl: { fontSize: 32 } } },
});

const emphasisStyle: Style = emphasis({ size: "xl" });
const emphasisKeys: readonly "size"[] = emphasis.variantKeys;
const composable: ComposableKindRecipe<Style> = text;
const sizes: keyof ComposedVariants<
  readonly [typeof text],
  { readonly size: { readonly xl: Style } }
>["size"] = "lg";

const dialog = slotStyleRecipe({
  base: { footer: { gap: 8 } },
  composes: [card],
  slots: ["footer"],
  variants: { tone: { dark: { footer: { borderColor: "white" } } } },
});

const dialogStyles: Readonly<Record<"root" | "title" | "footer", Style>> =
  dialog({ tone: "dark" });
const composableSlots: ComposableKindSlotRecipe<Style> = card;

export {
  card,
  composable,
  composableSlots,
  dialog,
  dialogStyles,
  emphasis,
  emphasisKeys,
  emphasisStyle,
  sizes,
  cardKeys,
  cardStyles,
  recipe,
  slotStyleRecipe,
  style,
  styleRecipe,
  text,
  textKey,
  textKeys,
  variants,
};
