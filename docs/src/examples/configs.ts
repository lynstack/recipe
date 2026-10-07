import type { ComposableKindRecipe } from "@lynstack/recipe";

import type { VariantsConfig } from "./option-numbers.ts";

type ByName<Value> = Readonly<Record<string, Value>>;

type Style = ByName<string | number>;

/** The config of a style recipe of the docs. */
interface StyleConfig extends VariantsConfig {
  readonly composes?: readonly ComposableKindRecipe<Style>[] | undefined;
  readonly base?: Style | undefined;
  readonly variants: ByName<ByName<Style>>;
  readonly compoundVariants?:
    | readonly { readonly variants: ByName<unknown>; readonly value: Style }[]
    | undefined;
}

/** The config of a slot recipe of styles of the docs. */
interface SlotStyleConfig {
  readonly slots: readonly string[];
  readonly base?: ByName<Style | undefined> | undefined;
  readonly variants: ByName<ByName<ByName<Style | undefined>>>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: ByName<unknown>;
        readonly value: ByName<Style | undefined>;
      }[]
    | undefined;
}

const configs = new WeakMap<object, StyleConfig>();

const slotConfigs = new WeakMap<object, SlotStyleConfig>();

/** Keeps the config of `recipe`, which the figures of the docs read. */
function recordConfig<Recipe extends object>(
  recipe: Recipe,
  config: StyleConfig,
): Recipe {
  configs.set(recipe, config);
  return recipe;
}

/**
 * Returns the config that `recipe` was created from.
 *
 * @throws {RangeError} When `styleRecipe` did not create `recipe`.
 */
function configOf(recipe: object): StyleConfig {
  const config = configs.get(recipe);
  if (config === undefined) {
    throw new RangeError("Only the recipes of styleRecipe keep their config");
  }
  return config;
}

/** Keeps the config of the slot recipe `recipe`, which figures read. */
function recordSlotConfig<Recipe extends object>(
  recipe: Recipe,
  config: SlotStyleConfig,
): Recipe {
  slotConfigs.set(recipe, config);
  return recipe;
}

/**
 * Returns the config that the slot recipe `recipe` was created from.
 *
 * @throws {RangeError} When `slotStyleRecipe` did not create `recipe`.
 */
function slotConfigOf(recipe: object): SlotStyleConfig {
  const config = slotConfigs.get(recipe);
  if (config === undefined) {
    throw new RangeError(
      "Only the slot recipes of slotStyleRecipe keep their config",
    );
  }
  return config;
}

export { configOf, recordConfig, recordSlotConfig, slotConfigOf };
export type { SlotStyleConfig, Style, StyleConfig };
