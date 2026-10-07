import type { KindVariants, VariantSelection } from "@lynstack/recipe";
import type { StyleVariants, StyleVariantsConfig } from "./types.ts";
import { overrideStyle, styleRecipe } from "./kinds.ts";
import type { Style } from "./kinds.ts";

interface LooseConfig {
  readonly base?: Style;
  readonly variants: KindVariants<Style>;
  readonly compoundVariants?: readonly {
    readonly variants: Readonly<Record<string, unknown>>;
    readonly style: Style;
  }[];
  readonly defaultVariants?: Readonly<Record<string, unknown>>;
}

type LooseProps = Readonly<Record<string, unknown>> & {
  readonly style?: Style;
};

type LooseStyleVariants = StyleVariants<Readonly<Record<string, unknown>>>;

export function sv<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: StyleVariantsConfig<Variants, DefaultedName>,
): StyleVariants<VariantSelection<Variants, DefaultedName>>;

export function sv(config: LooseConfig): LooseStyleVariants {
  const recipe = styleRecipe({
    ...config,
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      variants: compound.variants,
      value: compound.style,
    })),
  });
  const styleVariants = (props: LooseProps = {}): Style =>
    props.style === undefined
      ? recipe(props)
      : overrideStyle(recipe(props), props.style);
  const { defaultVariants, variantKeys, variantOptions } = recipe;
  return Object.assign(styleVariants, {
    defaultVariants,
    variantKeys,
    variantOptions,
  });
}
