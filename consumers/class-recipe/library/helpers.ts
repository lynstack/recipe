import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
  Recipe,
  RecipeConfig,
  RecipeProps,
  RecipeVariants,
  SlotRecipe,
  SlotRecipeConfig,
  SlotRecipeProps,
  SlotRecipeVariants,
} from "@lynstack/class-recipe";
import { cva, sva } from "@lynstack/class-recipe";

/** Creates a recipe from any config. */
function define<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: RecipeConfig<Variants, DefaultedName>,
): Recipe<RecipeProps<Variants, DefaultedName>> {
  return cva(config);
}

/** Creates a recipe that may compose others. */
function defineComposed<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<string>[] = readonly [],
>(
  config: RecipeConfig<Variants, DefaultedName, Composed>,
): ReturnType<typeof cva<Variants, DefaultedName, Composed>> {
  return cva(config);
}

/** Creates a slot recipe from any config. */
function defineSlots<
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotRecipeConfig<Slot, Variants, DefaultedName>,
): SlotRecipe<Slot, SlotRecipeProps<Slot, Variants, DefaultedName>> {
  return sva(config);
}

/** Creates a slot recipe that may compose others. */
function defineComposedSlots<
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<string>[] =
    readonly [],
>(
  config: SlotRecipeConfig<Slot, Variants, DefaultedName, Composed>,
): ReturnType<typeof sva<Slot, Variants, DefaultedName, Composed>> {
  return sva(config);
}

/** Adds a footer to any slot recipe. */
function withFooter<const Base extends ComposableKindSlotRecipe<string>>(
  base: Base,
): ReturnType<
  typeof sva<
    "footer",
    { readonly dense: { readonly true: { readonly footer: "pt-2" } } },
    never,
    readonly [Base]
  >
> {
  return sva({
    base: { footer: "pt-4" },
    composes: [base],
    slots: ["footer"],
    variants: { dense: { true: { footer: "pt-2" } } },
  });
}

export { define, defineComposed, defineComposedSlots, defineSlots, withFooter };
