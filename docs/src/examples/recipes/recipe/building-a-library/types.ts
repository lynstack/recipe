import type {
  CompoundCondition,
  DefaultVariants,
  KindRecipe,
  KindVariants,
  RecipeFunction,
} from "@lynstack/recipe";
import type { Style } from "./kinds.ts";

export interface StyleVariantsConfig<
  Variants extends KindVariants<Style>,
  DefaultedName extends keyof Variants,
> {
  readonly base?: Style;
  readonly variants: Variants;
  readonly compoundVariants?: readonly {
    readonly variants: CompoundCondition<NoInfer<Variants>>;
    readonly style: Style;
  }[];
  readonly defaultVariants?: DefaultVariants<Variants, DefaultedName>;
}

export type StyleVariants<Selection> = RecipeFunction<
  Selection & { readonly style?: Style },
  Style
> &
  Pick<
    KindRecipe<Selection, Style>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;
