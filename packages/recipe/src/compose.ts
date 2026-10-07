import type {
  LooseCompoundVariant,
  LooseVariants,
  SelectedVariants,
} from "./variants.js";

/** Whether a recipe has slots, which decides the recipes it composes. */
type RecipeType = "recipe" | "slot recipe";

/**
 * The values of one config that a recipe is made of: its own config, or
 * that of a recipe it composes.
 */
interface Layer<Value> {
  readonly slots: readonly string[];
  readonly base: Value | undefined;
  readonly variants: LooseVariants<Value>;
  readonly compoundVariants: readonly LooseCompoundVariant<Value>[];
  readonly defaultVariants: SelectedVariants;
}

/** What a recipe's config gives for its layer. */
interface LayerConfig<Value> {
  readonly base?: Value | undefined;
  readonly variants: LooseVariants<Value>;
  readonly compoundVariants?:
    readonly LooseCompoundVariant<Value>[] | undefined;
  readonly defaultVariants?: SelectedVariants | undefined;
}

/**
 * Returns the layer of a recipe's own config, with copies of its records,
 * so that changing the config later changes no recipe that composes it.
 */
function layerOf<Value>(
  config: LayerConfig<Value>,
  slots: readonly string[],
): Layer<Value> {
  return {
    base: config.base,
    compoundVariants: (config.compoundVariants ?? []).map(
      ({ variants, value }) => ({ value, variants: { ...variants } }),
    ),
    defaultVariants: { ...config.defaultVariants },
    slots: [...slots],
    variants: Object.fromEntries(
      Object.entries(config.variants).map(
        ([name, options]: readonly [
          string,
          Readonly<Record<string, Value>>,
        ]) => [name, { ...options }],
      ),
    ),
  };
}

/** The layers of the recipes of one type, which the engine created. */
interface Registry<Value> {
  /**
   * Returns the layers of a recipe: those of each recipe it composes, in
   * order, each only at its first occurrence, then its own.
   *
   * @throws TypeError when a recipe it composes is not in the registry.
   */
  readonly layersOf: (
    composes: readonly unknown[],
    own: Layer<Value>,
  ) => readonly Layer<Value>[];
  /** Records the layers of `recipe`, so that other recipes can compose it. */
  readonly withLayers: <Recipe extends object>(
    recipe: Recipe,
    layers: readonly Layer<Value>[],
  ) => Recipe;
}

/** Returns an empty registry of recipes of type `type`. */
function createRegistry<Value>(type: RecipeType): Registry<Value> {
  const layersByRecipe = new WeakMap<object, readonly Layer<Value>[]>();

  const layersOfRecipe = (recipe: unknown): readonly Layer<Value>[] => {
    const layers =
      typeof recipe === "function" ? layersByRecipe.get(recipe) : undefined;
    if (layers === undefined) {
      throw new TypeError(
        `A ${type} composes only ${type}s created by @lynstack/recipe. ` +
          "Check that the app installs one copy of @lynstack/recipe.",
      );
    }
    return layers;
  };

  return {
    layersOf: (composes, own) => [
      ...new Set([
        ...composes.flatMap((recipe) => layersOfRecipe(recipe)),
        own,
      ]),
    ],
    withLayers: (recipe, layers) => {
      layersByRecipe.set(recipe, layers);
      return recipe;
    },
  };
}

/**
 * The layers of a recipe merged into one config, in which every option and
 * compound variant has the list of its values, in the order of the layers.
 */
interface MergedLayers<Value> {
  /** The slots of every layer, each once, in order. */
  readonly slots: readonly string[];
  /** The base of each layer that has one. */
  readonly bases: readonly Value[];
  readonly variants: LooseVariants<readonly Value[]>;
  readonly compoundVariants: readonly LooseCompoundVariant<readonly Value[]>[];
  readonly defaultVariants: SelectedVariants;
}

/**
 * Merges layers into one config: the union of their slots, of their
 * variants, and of the options of each, the values of each option in the
 * order of the layers, their compound variants in order, and the default
 * of each variant from the last layer that gives one.
 */
function mergeLayers<Value>(
  layers: readonly Layer<Value>[],
): MergedLayers<Value> {
  const variantNames = unique(
    layers.flatMap((layer) => Object.keys(layer.variants)),
  );
  return {
    bases: layers.flatMap(({ base }) => listOf(base)),
    compoundVariants: layers.flatMap((layer) =>
      layer.compoundVariants.map(({ variants, value }) => ({
        value: listOf(value),
        variants,
      })),
    ),
    defaultVariants: Object.fromEntries(
      layers.flatMap((layer) =>
        Object.entries(layer.defaultVariants).filter(
          ([, option]: readonly [string, unknown]) => option !== undefined,
        ),
      ),
    ),
    slots: unique(layers.flatMap(({ slots }) => slots)),
    variants: Object.fromEntries(
      variantNames.map((name) => [name, mergeOptions(layers, name)]),
    ),
  };
}

/** The options of the variant `name` in any layer, with their values. */
function mergeOptions<Value>(
  layers: readonly Layer<Value>[],
  name: string,
): Readonly<Record<string, readonly Value[]>> {
  const optionsOfLayers = layers.map(
    (layer) => ownValue(layer.variants, name) ?? {},
  );
  const optionNames = unique(
    optionsOfLayers.flatMap((options) => Object.keys(options)),
  );
  return Object.fromEntries(
    optionNames.map((option) => [
      option,
      optionsOfLayers.flatMap((options) => listOf(ownValue(options, option))),
    ]),
  );
}

function ownValue<Value>(
  record: Readonly<Record<string, Value>>,
  key: string,
): Value | undefined {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}

function listOf<Value>(value: Value | undefined): readonly Value[] {
  return value === undefined ? [] : [value];
}

function unique(names: readonly string[]): readonly string[] {
  return [...new Set(names)];
}

export { createRegistry, layerOf, mergeLayers };
export type { Layer, MergedLayers, Registry };
