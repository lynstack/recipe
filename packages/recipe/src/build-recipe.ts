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
 * are reduced into it first.
 */
function compileMergedLayers(
  kind: LooseRecipeKind,
  merged: MergedLayers<unknown>,
): CompiledRecipe {
  const { initial, reduce, finish = asResult } = kind;
  const [base, ...otherBases] = merged.bases;
  const compiled = compileVariants<readonly unknown[]>({
    ...merged,
    noValue: noValues,
  });
  const reducer = {
    initial: (): unknown => reduceEach(initial(base), otherBases, reduce),
    reduce,
  };
  const build = (indexes: Int32Array): unknown =>
    finish(reduceValueLists(compiled, indexes, reducer));
  return { build, compiled };
}

export { compileLayer, compileMergedLayers };
export type { LooseKindRecipeConfig, LooseRecipeKind };
