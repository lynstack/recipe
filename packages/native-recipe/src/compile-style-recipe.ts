import type {
  ComposableKindRecipe,
  KindRecipe,
  KindVariants,
} from "@lynstack/recipe";
import { createRecipeKind } from "@lynstack/recipe";

import { checkStyleRecipeConfig } from "./check-config.js";

/** A style in the loose shape the runtime works with. */
type LooseStyle = Readonly<Record<string, unknown>>;

type LooseSelection = Readonly<Record<string, unknown>>;

interface LooseStyleRecipeConfig {
  readonly composes?: readonly ComposableKindRecipe<LooseStyle>[] | undefined;
  readonly base?: LooseStyle | undefined;
  readonly variants: KindVariants<LooseStyle>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: LooseSelection;
        readonly style: LooseStyle;
      }[]
    | undefined;
  readonly defaultVariants?: LooseSelection | undefined;
  readonly cache?: boolean | undefined;
}

type LooseStyleRecipe = KindRecipe<LooseSelection, LooseStyle>;

/**
 * A style while a recipe merges the styles of a selection into it, which
 * `reduce` extends in place.
 */
interface StyleAccumulator {
  [property: string]: unknown;
}

/**
 * How a recipe merges styles: into a new style for each result, which it
 * freezes. Recipes and slot recipes of the package share it.
 */
const styleKind = {
  combine: (first: LooseStyle, second: LooseStyle): LooseStyle => ({
    ...first,
    ...second,
  }),
  finish: (style: StyleAccumulator): LooseStyle => Object.freeze(style),
  initial: (base: LooseStyle | undefined): StyleAccumulator => ({ ...base }),
  reduce: (style: StyleAccumulator, value: LooseStyle): StyleAccumulator =>
    Object.assign(style, value),
};

const styleRecipe = createRecipeKind(styleKind);

/**
 * Returns the style recipe function for `config`.
 *
 * @throws {TypeError} When a part of the config has the wrong shape.
 */
function buildStyleRecipe(config: LooseStyleRecipeConfig): LooseStyleRecipe {
  checkStyleRecipeConfig(config);
  return styleRecipe({
    base: config.base,
    cache: config.cache,
    composes: config.composes,
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      value: compound.style,
      variants: compound.variants,
    })),
    defaultVariants: config.defaultVariants,
    variants: config.variants,
  });
}

export { buildStyleRecipe, styleKind };
export type {
  LooseSelection,
  LooseStyle,
  LooseStyleRecipe,
  LooseStyleRecipeConfig,
};
