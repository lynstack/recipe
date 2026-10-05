import type { KindRecipe, KindSlotVariants } from "@lynstack/recipe";
import { createSlotRecipeKind } from "@lynstack/recipe";

import type { LooseSelection, LooseStyle } from "./compile-style-recipe.js";
import { styleKind } from "./compile-style-recipe.js";

type LooseSlotStyles = Readonly<Record<string, LooseStyle | undefined>>;

interface LooseSlotStyleRecipeConfig {
  readonly slots: readonly string[];
  readonly base?: LooseSlotStyles | undefined;
  readonly variants: KindSlotVariants<LooseStyle>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: LooseSelection;
        readonly styles: LooseSlotStyles;
      }[]
    | undefined;
  readonly defaultVariants?: LooseSelection | undefined;
  readonly cache?: boolean | undefined;
}

type LooseSlotStyleRecipe = KindRecipe<
  LooseSelection,
  Readonly<Record<string, LooseStyle>>
>;

const slotStyleRecipe = createSlotRecipeKind(styleKind);

/** Returns the slot style recipe function for `config`. */
function buildSlotStyleRecipe(
  config: LooseSlotStyleRecipeConfig,
): LooseSlotStyleRecipe {
  return slotStyleRecipe({
    base: config.base,
    cache: config.cache,
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      value: compound.styles,
      variants: compound.variants,
    })),
    defaultVariants: config.defaultVariants,
    slots: config.slots,
    variants: config.variants,
  });
}

export { buildSlotStyleRecipe };
export type { LooseSlotStyleRecipe, LooseSlotStyleRecipeConfig };
