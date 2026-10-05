import type {
  CreateKindRecipe,
  KindRecipe,
  RecipeKind,
  VariantKey,
  VariantsOf,
} from "@lynstack/recipe";
import { createRecipeKind } from "@lynstack/recipe";

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

const style: Style = text({ size: "lg" });
const textKeys: readonly "size"[] = text.variantKeys;
const recipe: KindRecipe<{ readonly size?: "sm" | "lg" }, Style> = text;
const variants: VariantsOf<typeof text> = { size: "lg" };
const textKey: VariantKey<VariantsOf<typeof text>> = "size";

export { recipe, style, styleRecipe, text, textKey, textKeys, variants };
