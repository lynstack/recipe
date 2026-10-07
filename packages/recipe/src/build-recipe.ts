import type { CompiledVariants, SelectedVariants } from "./variants.js";
import type { Layer, MergedLayers } from "./compose.js";
import { reduceEach, reduceValueLists, reduceValues } from "./reduce-values.js";
import type { KindVariants } from "./recipe-kind.js";
import { compileVariants } from "./variants.js";

/** A recipe kind in the loose shape the runtime works with. */
interface LooseRecipeKind {
  readonly initial: (base: unknown) => unknown;
  readonly reduce: (accumulator: unknown, value: unknown) => unknown;
  readonly finish?: ((accumulator: unknown) => unknown) | undefined;
  readonly cache?: boolean | undefined;
}

interface LooseKindRecipeConfig {
  readonly composes?: readonly unknown[] | undefined;
  readonly base?: unknown;
  readonly variants: KindVariants<unknown>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: SelectedVariants;
        readonly value: unknown;
      }[]
    | undefined;
  readonly defaultVariants?: SelectedVariants | undefined;
  readonly cache?: boolean | undefined;
}

/** The variants of a recipe, and how it builds the result of a selection. */
interface CompiledRecipe {
  readonly compiled: CompiledVariants<unknown>;
  readonly build: (indexes: Int32Array) => unknown;
}

const asResult = (accumulator: unknown): unknown => accumulator;

const noValues: readonly unknown[] = Object.freeze([]);

/** Compiles a recipe that composes no other recipe. */
function compileLayer(
  kind: LooseRecipeKind,
  layer: Layer<unknown>,
): CompiledRecipe {
  const { initial, reduce, finish } = kind;
  const { base } = layer;
  const compiled = compileVariants<unknown>({ ...layer, noValue: undefined });
  const reducer = { initial: (): unknown => initial(base), reduce };
  const build =
    finish === undefined
      ? (indexes: Int32Array): unknown =>
          reduceValues(compiled, indexes, reducer)
      : (indexes: Int32Array): unknown =>
          finish(reduceValues(compiled, indexes, reducer));
  return { build, compiled };
}

/**
 * Compiles a recipe from the merged layers of the recipes it composes and
 * its own: its accumulator starts from the first base, and the other bases
 * are reduced into it first. When no option or compound variant has more
 * than one value, it compiles them as one config.
 */
function compileMergedLayers(
  kind: LooseRecipeKind,
  merged: MergedLayers<unknown>,
): CompiledRecipe {
  const [base, ...otherBases] = merged.bases;
  const kindOfBases =
    otherBases.length === 0
      ? kind
      : {
          ...kind,
          initial: (): unknown =>
            reduceEach(kind.initial(base), otherBases, kind.reduce),
        };
  const layer = singleValuedLayerOf(merged, base);
  return layer === undefined
    ? compileValueLists(kindOfBases, merged, base)
    : compileLayer(kindOfBases, layer);
}

/**
 * Returns the merged layers as one config, or undefined when an option or
 * a compound variant has more than one value.
 */
function singleValuedLayerOf(
  merged: MergedLayers<unknown>,
  base: unknown,
): Layer<unknown> | undefined {
  const optionValues = Object.values(merged.variants).flatMap((options) =>
    Object.values(options),
  );
  if (
    !optionValues.every((values) => hasOneValueAtMost(values)) ||
    !merged.compoundVariants.every(({ value }) => hasOneValueAtMost(value))
  ) {
    return undefined;
  }
  return {
    base,
    compoundVariants: merged.compoundVariants.map(({ variants, value }) => ({
      value: value[0],
      variants,
    })),
    defaultVariants: merged.defaultVariants,
    slots: [],
    variants: Object.fromEntries(
      Object.entries(merged.variants).map(
        ([name, options]: readonly [
          string,
          Readonly<Record<string, readonly unknown[]>>,
        ]) => [
          name,
          Object.fromEntries(
            Object.entries(options).map(
              ([option, values]: readonly [string, readonly unknown[]]) => [
                option,
                values[0],
              ],
            ),
          ),
        ],
      ),
    ),
  };
}

function hasOneValueAtMost(values: readonly unknown[]): boolean {
  return values.length <= 1;
}

/** Compiles a recipe whose options or compound variants have value lists. */
function compileValueLists(
  kind: LooseRecipeKind,
  merged: MergedLayers<unknown>,
  base: unknown,
): CompiledRecipe {
  const { initial, reduce, finish = asResult } = kind;
  const compiled = compileVariants<readonly unknown[]>({
    ...merged,
    noValue: noValues,
  });
  const reducer = { initial: (): unknown => initial(base), reduce };
  const build = (indexes: Int32Array): unknown =>
    finish(reduceValueLists(compiled, indexes, reducer));
  return { build, compiled };
}

export { compileLayer, compileMergedLayers };
export type { LooseKindRecipeConfig, LooseRecipeKind };
