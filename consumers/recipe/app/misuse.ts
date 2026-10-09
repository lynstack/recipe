import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
};
const styleRecipe = createRecipeKind(styleKind);
const slotStyleRecipe = createSlotRecipeKind(styleKind);

const text = styleRecipe({
  defaultVariants: { size: "md" },
  variants: {
    size: { md: { fontSize: 16 }, sm: { fontSize: 12 } },
    tone: { muted: { opacity: 0.6 } },
  },
});
const card = slotStyleRecipe({
  slots: ["root", "title"],
  variants: { raised: { true: { root: { elevation: 2 } } } },
});

const declared = {
  defaultVariants: { size: "lg" },
  variants: { size: { md: { fontSize: 16 } } },
} as const;

/** Calls and configs that the types reject, one of each mistake. */
function misuses(): void {
  // @ts-expect-error: tone has no default, so a call must name it.
  text({ size: "sm" });
  // @ts-expect-error: size has no option xl.
  text({ size: "xl", tone: "muted" });
  // @ts-expect-error: the recipe has no variant named weight.
  text({ tone: "muted", weight: "bold" });
  styleRecipe({
    // @ts-expect-error: the default names an option that size lacks.
    defaultVariants: { size: "lg" },
    variants: { size: { md: {} } },
  });
  // @ts-expect-error: a declared config whose default size lacks.
  styleRecipe(declared);
  styleRecipe({
    // @ts-expect-error: the compound variant names an option that size lacks.
    compoundVariants: [{ value: {}, variants: { size: "lg" } }],
    variants: { size: { md: {} } },
  });
  // @ts-expect-error: the kind reduces styles, not strings.
  styleRecipe({ variants: { size: { md: "text-base" } } });
  slotStyleRecipe({
    slots: ["root"],
    // @ts-expect-error: an option styles only the slots of the recipe.
    variants: { size: { md: { title: {} } } },
  });
  // @ts-expect-error: a recipe composes recipes, not slot recipes.
  styleRecipe({ composes: [card], variants: {} });
}

export { card, misuses, text };
