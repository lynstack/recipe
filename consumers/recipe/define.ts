import type {
  CreateKindRecipe,
  CreateKindSlotRecipe,
  KindRecipe,
  KindRecipeConfig,
  KindSelection,
  KindSlotRecipeConfig,
  KindSlotVariants,
  KindVariants,
  RecipeKind,
} from "@lynstack/recipe";
import { createRecipeKind, createSlotRecipeKind } from "@lynstack/recipe";

type Style = Readonly<Record<string, string | number>>;

const styleKind: RecipeKind<Style, Style, Style> = {
  finish: (style) => Object.freeze(style),
  initial: (base) => ({ ...base }),
  reduce: (style, value) => ({ ...style, ...value }),
};

const styleRecipe: CreateKindRecipe<Style, Style> = createRecipeKind(styleKind);
const slotStyleRecipe: CreateKindSlotRecipe<Style, Style> =
  createSlotRecipeKind(styleKind);

/** Creates a recipe from any config, as a library's own helper does. */
function define<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: KindRecipeConfig<Style, Variants, DefaultedName>,
): KindRecipe<KindSelection<Variants, DefaultedName>, Style> {
  return styleRecipe(config);
}

/** Creates a slot recipe from any config, as a library's own helper does. */
function defineSlots<
  const Slot extends string,
  const Variants extends KindSlotVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: KindSlotRecipeConfig<Slot, Style, Variants, DefaultedName>,
): KindRecipe<
  KindSelection<Variants, DefaultedName>,
  Readonly<Record<Slot, Style>>
> {
  return slotStyleRecipe(config);
}

export { define, defineSlots };
