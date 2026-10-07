import type {
  ComposableKindRecipe,
  CreateKindRecipe,
  KindVariants,
} from "@lynstack/recipe";
import { createRecipeKind } from "@lynstack/recipe";

import { appendClasses, createJoinClasses } from "./join-classes.js";
import type { BuildOptions } from "./build-options.js";
import { cx } from "./cx.js";

type LooseSelection = Readonly<Record<string, unknown>>;

interface LooseRecipeConfig {
  readonly composes?: readonly ComposableKindRecipe<string>[] | undefined;
  readonly base?: string | undefined;
  readonly variants: KindVariants<string>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: LooseSelection;
        readonly className: string;
      }[]
    | undefined;
  readonly defaultVariants?: LooseSelection | undefined;
  readonly cache?: boolean | undefined;
}

interface LooseRecipeProps extends LooseSelection {
  readonly className?: string | undefined;
}

type LooseRecipe = ((props?: LooseRecipeProps | null) => string) & {
  readonly variantKeys: readonly string[];
};

const noProps: LooseRecipeProps = Object.freeze({});

/** The recipe of the engine that each recipe of the package is built on. */
const engineRecipes = new WeakMap<object, ComposableKindRecipe<string>>();

/**
 * Returns the recipes of the engine that `composes` names: the one each
 * recipe of the package is built on, or the recipe itself, which the engine
 * rejects unless it created it.
 */
function engineRecipesOf(
  composes: readonly ComposableKindRecipe<string>[] = [],
): readonly ComposableKindRecipe<string>[] {
  return composes.map((recipe) => engineRecipes.get(recipe) ?? recipe);
}

/**
 * Returns the function that builds the recipe of a config, whose classes
 * are combined with `options.join` and cached unless `options.cache` is
 * false.
 */
function createRecipeBuilder(
  options: BuildOptions,
): (config: LooseRecipeConfig) => LooseRecipe {
  const joinClasses = createJoinClasses(options.join);
  const classRecipe =
    options.join === cx ? concatKind(options) : joinKind(options, joinClasses);

  return (config) => {
    const classesOf = classRecipe({
      base: config.base,
      cache: config.cache,
      composes: engineRecipesOf(config.composes),
      compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
        value: compound.className,
        variants: compound.variants,
      })),
      defaultVariants: config.defaultVariants,
      variants: config.variants,
    });

    const recipe = (props?: LooseRecipeProps | null): string => {
      const selected = props ?? noProps;
      const classes = classesOf(selected);
      const { className } = selected;
      return typeof className === "string" && className !== ""
        ? joinClasses([classes, className])
        : classes;
    };
    const result = Object.assign(recipe, {
      variantKeys: classesOf.variantKeys,
    });
    engineRecipes.set(result, classesOf);
    return result;
  };
}

/** Recipes whose classes are concatenated. */
function concatKind(options: BuildOptions): CreateKindRecipe<string, string> {
  return createRecipeKind({
    cache: options.cache,
    combine: appendClasses,
    initial: (base: string | undefined): string => base ?? "",
    reduce: appendClasses,
  });
}

/** Recipes whose classes are passed to `joinClasses`. */
function joinKind(
  options: BuildOptions,
  joinClasses: (classNames: readonly string[]) => string,
): CreateKindRecipe<string, string> {
  return createRecipeKind({
    cache: options.cache,
    combine: appendClasses,
    finish: joinClasses,
    initial: (base: string | undefined): readonly string[] => [base ?? ""],
    reduce: (classNames: readonly string[], classes: string) => [
      ...classNames,
      classes,
    ],
  });
}

export { createRecipeBuilder };
export type { LooseRecipe, LooseRecipeConfig, LooseRecipeProps };
