import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
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

/** Creates a recipe that may compose others, as a library's own helper does. */
function defineComposed<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<Style>[] = readonly [],
>(
  config: KindRecipeConfig<Style, Variants, DefaultedName, Composed>,
): ReturnType<typeof styleRecipe<Variants, DefaultedName, Composed>> {
  return styleRecipe(config);
}

/** Creates a slot recipe that may compose others, as a library's helper does. */
function defineComposedSlots<
  const Slot extends string,
  const Variants extends KindSlotVariants<Style>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<Style>[] =
    readonly [],
>(
  config: KindSlotRecipeConfig<Slot, Style, Variants, DefaultedName, Composed>,
): ReturnType<typeof slotStyleRecipe<Slot, Variants, DefaultedName, Composed>> {
  return slotStyleRecipe(config);
}

/** Adds a footer to any slot recipe, as a library's own helper does. */
function withFooter<const Base extends ComposableKindSlotRecipe<Style>>(
  base: Base,
): ReturnType<
  typeof slotStyleRecipe<
    "footer",
    {
      readonly dense: {
        readonly true: { readonly footer: { readonly borderStyle: "dashed" } };
      };
    },
    never,
    readonly [Base]
  >
> {
  return slotStyleRecipe({
    base: { footer: { borderStyle: "solid" } },
    composes: [base],
    slots: ["footer"],
    variants: { dense: { true: { footer: { borderStyle: "dashed" } } } },
  });
}

export { define, defineComposed, defineComposedSlots, defineSlots, withFooter };
