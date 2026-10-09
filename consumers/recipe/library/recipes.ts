import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  finish: (style: Style): Style => Object.freeze(style),
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};

// The library's own kinds, which its users extend its recipes with.
const styleRecipe = createRecipeKind(styleKind);
const slotStyleRecipe = createSlotRecipeKind(styleKind);
const classRecipe = createRecipeKind({
  initial: (base: string | undefined): string => base ?? "",
  reduce: (classes: string, value: string): string => `${classes} ${value}`,
});

const text = styleRecipe({
  base: { color: "black" },
  compoundVariants: [{ value: { fontWeight: 700 }, variants: { size: "lg" } }],
  defaultVariants: { size: "md" },
  variants: {
    size: { lg: { fontSize: 24 }, md: { fontSize: 16 }, sm: { fontSize: 12 } },
    truncated: { true: { overflow: "hidden" } },
  },
});

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

const heading = styleRecipe({
  composes: [text],
  variants: { level: { "1": { fontSize: 32 }, "2": { fontSize: 28 } } },
});

const dialog = slotStyleRecipe({
  base: { footer: { gap: 8 } },
  composes: [card],
  slots: ["footer"],
  variants: { tone: { dark: { footer: { borderColor: "white" } } } },
});

const link = classRecipe({
  base: "underline",
  variants: { tone: { muted: "text-gray-500", primary: "text-blue-600" } },
});

export {
  card,
  classRecipe,
  dialog,
  heading,
  link,
  slotStyleRecipe,
  styleRecipe,
  text,
};
export type { Style };
