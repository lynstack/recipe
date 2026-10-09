import type {
  Composable,
  ComposableKindRecipe,
  ComposedVariants,
  CompoundCondition,
  DefaultVariants,
  InheritedDefaultedName,
  KindRecipe,
  KindVariants,
  RecipeComposition,
  RecipeFunction,
  VariantSelection,
} from "@lynstack/recipe";
import type { Style } from "./recipes.js";
import { styleRecipe } from "./recipes.js";

interface StyleVariantsConfig<
  Variants extends KindVariants<Style>,
  DefaultedName extends keyof ComposedVariants<Composed, Variants>,
  Composed extends readonly ComposableKindRecipe<Style>[],
> {
  readonly composes?: Composed;
  readonly base?: Style;
  readonly variants: Variants;
  readonly compoundVariants?: readonly {
    readonly variants: CompoundCondition<
      NoInfer<ComposedVariants<Composed, Variants>>
    >;
    readonly style: Style;
  }[];
  readonly defaultVariants?: DefaultVariants<
    ComposedVariants<Composed, Variants>,
    DefaultedName
  >;
}

type StyleVariants<
  Variants,
  DefaultedName extends keyof Variants,
> = RecipeFunction<
  VariantSelection<Variants, DefaultedName> & { readonly style?: Style },
  Style
> &
  Pick<
    KindRecipe<VariantSelection<Variants, DefaultedName>, Style>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  > &
  Composable<RecipeComposition<Variants, DefaultedName, Style, undefined>>;

interface LooseConfig {
  readonly composes?: readonly ComposableKindRecipe<Style>[];
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

type LooseStyleVariants = RecipeFunction<LooseProps, Style> &
  Pick<
    KindRecipe<Readonly<Record<string, unknown>>, Style>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

/** The engine's recipe of each recipe that `sv` returns. */
const engineRecipes = new WeakMap<object, ComposableKindRecipe<Style>>();

/**
 * Creates a recipe whose calls take a style that overrides theirs, as
 * the docs build it: a library's own creator, wrapping the engine's.
 */
function sv<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<Style>[] = readonly [],
>(
  config: StyleVariantsConfig<Variants, DefaultedName, Composed>,
): StyleVariants<
  ComposedVariants<Composed, Variants>,
  DefaultedName | InheritedDefaultedName<Composed, Variants>
>;

function sv(config: LooseConfig): LooseStyleVariants {
  const recipe = styleRecipe({
    ...config,
    composes: (config.composes ?? []).map(
      (composed) => engineRecipes.get(composed) ?? composed,
    ),
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      value: compound.style,
      variants: compound.variants,
    })),
  });
  const styleVariants = (props: LooseProps = {}): Style =>
    props.style === undefined
      ? recipe(props)
      : { ...recipe(props), ...props.style };
  engineRecipes.set(styleVariants, recipe);
  const { defaultVariants, variantKeys, variantOptions } = recipe;
  return Object.assign(styleVariants, {
    defaultVariants,
    variantKeys,
    variantOptions,
  });
}

const surface = sv({
  base: { padding: 8 },
  compoundVariants: [{ style: { margin: 4 }, variants: { tone: "muted" } }],
  variants: { tone: { muted: { opacity: 0.6 } } },
});

const panel = sv({
  composes: [surface],
  defaultVariants: { tone: "muted" },
  variants: { tone: { loud: { fontWeight: 700 } } },
});

export { panel, surface, sv };
