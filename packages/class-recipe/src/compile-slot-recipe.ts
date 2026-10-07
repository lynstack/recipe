import type {
  ComposableKindSlotRecipe,
  CreateKindSlotRecipe,
  KindVariants,
} from "@lynstack/recipe";
import { createSlotRecipeKind } from "@lynstack/recipe";

import {
  appendClasses,
  concatClasses,
  createJoinClasses,
} from "./join-classes.js";
import type { BuildOptions } from "./build-options.js";
import type { JoinClasses } from "./join-classes.js";

type LooseSelection = Readonly<Record<string, unknown>>;

type LooseSlotClasses = Readonly<Record<string, string | undefined>>;

type LooseSlotClassNames = Readonly<Record<string, string>>;

interface LooseSlotRecipeConfig {
  readonly composes?: readonly ComposableKindSlotRecipe<string>[] | undefined;
  readonly slots: readonly string[];
  readonly base?: LooseSlotClasses | undefined;
  readonly variants: KindVariants<LooseSlotClasses>;
  readonly compoundVariants?:
    | readonly {
        readonly variants: LooseSelection;
        readonly classNames: LooseSlotClasses;
      }[]
    | undefined;
  readonly defaultVariants?: LooseSelection | undefined;
  readonly cache?: boolean | undefined;
}

interface LooseSlotRecipeProps extends LooseSelection {
  readonly classNames?: LooseSlotClasses | null | undefined;
}

type LooseSlotRecipe = ((
  props?: LooseSlotRecipeProps | null,
) => LooseSlotClassNames) & {
  readonly variantKeys: readonly string[];
};

/**
 * The slots of a slot recipe and how it adds the classes of `classNames` to
 * the class name of a slot.
 */
interface Slots {
  readonly names: readonly string[];
  readonly addClasses: (className: string, classes: string) => string;
}

/** The slot recipe of the engine that each one of the package is built on. */
const engineSlotRecipes = new WeakMap<
  object,
  ComposableKindSlotRecipe<string>
>();

/**
 * Returns the slot recipes of the engine that `composes` names: the one
 * each slot recipe of the package is built on, or the slot recipe itself,
 * which the engine rejects unless it created it.
 */
function engineSlotRecipesOf(
  composes: readonly ComposableKindSlotRecipe<string>[] = [],
): readonly ComposableKindSlotRecipe<string>[] {
  return composes.map((recipe) => engineSlotRecipes.get(recipe) ?? recipe);
}

/**
 * Returns the slot recipe function for `config`, whose classes are combined
 * with `options.join` and cached unless `options.cache` is false.
 */
function buildSlotRecipe(
  config: LooseSlotRecipeConfig,
  options: BuildOptions,
): LooseSlotRecipe {
  const joinClasses = createJoinClasses(options.join);
  const concatenates = joinClasses === concatClasses;
  const classRecipe = concatenates
    ? concatKind(options)
    : joinKind(joinClasses, options);
  const composes = engineSlotRecipesOf(config.composes);
  const classNamesOf = classRecipe({
    ...withStringClasses(config),
    composes,
  });
  const slots: Slots = {
    addClasses: concatenates
      ? appendClasses
      : (className, classes) => joinClasses([className, classes]),
    // The result of a slot recipe that composes others lists their slots.
    names:
      composes.length === 0 ? [...config.slots] : Object.keys(classNamesOf()),
  };

  const slotRecipe = (
    props?: LooseSlotRecipeProps | null,
  ): LooseSlotClassNames => {
    const classNames = classNamesOf(props ?? undefined);
    const overrides = props?.classNames;
    return overrides === undefined || overrides === null
      ? classNames
      : withOverrides(slots, classNames, overrides);
  };
  const result = Object.assign(slotRecipe, {
    variantKeys: classNamesOf.variantKeys,
  });
  engineSlotRecipes.set(result, classNamesOf);
  return result;
}

/** Slot recipes whose classes are concatenated by slot. */
function concatKind(
  options: BuildOptions,
): CreateKindSlotRecipe<string, string> {
  return createSlotRecipeKind({
    cache: options.cache,
    combine: appendClasses,
    initial: (base: string | undefined): string => base ?? "",
    reduce: appendClasses,
  });
}

/** Slot recipes whose classes are passed to `joinClasses` by slot. */
function joinKind(
  joinClasses: JoinClasses,
  options: BuildOptions,
): CreateKindSlotRecipe<string, string> {
  return createSlotRecipeKind({
    cache: options.cache,
    combine: appendClasses,
    finish: joinClasses,
    initial: (base: string | undefined): readonly string[] =>
      base === undefined ? [] : [base],
    reduce: (classNames: readonly string[], classes: string) => [
      ...classNames,
      classes,
    ],
  });
}

/**
 * Returns `config` as a slot recipe of a kind takes it: the classes of each
 * compound variant under `value`, and of each value only the slots whose
 * classes are a string that is not empty. The engine ignores the slots that
 * neither the config nor a slot recipe it composes declares.
 */
function withStringClasses(config: LooseSlotRecipeConfig): {
  readonly slots: readonly string[];
  readonly base: LooseSlotClassNames;
  readonly variants: KindVariants<LooseSlotClassNames>;
  readonly compoundVariants: readonly {
    readonly variants: LooseSelection;
    readonly value: LooseSlotClassNames;
  }[];
  readonly defaultVariants: LooseSelection | undefined;
  readonly cache: boolean | undefined;
} {
  const variants = Object.fromEntries(
    Object.entries(config.variants).map(
      ([name, options]: readonly [
        string,
        Readonly<Record<string, LooseSlotClasses>>,
      ]) => [
        name,
        Object.fromEntries(
          Object.entries(options).map(
            ([option, classes]: readonly [string, LooseSlotClasses]) => [
              option,
              stringClasses(classes),
            ],
          ),
        ),
      ],
    ),
  );
  return {
    base: stringClasses(config.base ?? {}),
    cache: config.cache,
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      value: stringClasses(compound.classNames),
      variants: compound.variants,
    })),
    defaultVariants: config.defaultVariants,
    slots: config.slots,
    variants,
  };
}

/**
 * Returns the classes in `classes` of each slot that has some, including
 * slots that only a slot recipe it composes declares.
 */
function stringClasses(classes: LooseSlotClasses): LooseSlotClassNames {
  return Object.fromEntries(
    Object.keys(classes)
      .map((slot) => [slot, classOfSlot(classes, slot)] as const)
      .filter(([, classesOfSlot]) => classesOfSlot !== ""),
  );
}

/**
 * Returns `classNames` with the classes of `overrides` added to each slot,
 * frozen, or `classNames` itself when `overrides` adds no classes.
 */
function withOverrides(
  slots: Slots,
  classNames: LooseSlotClassNames,
  overrides: LooseSlotClasses,
): LooseSlotClassNames {
  let result: Record<string, string> | undefined = undefined;
  for (const slot of slots.names) {
    const classes = classOfSlot(overrides, slot);
    if (classes !== "") {
      result ??= { ...classNames };
      result[slot] = slots.addClasses(classOfSlot(classNames, slot), classes);
    }
  }
  return result === undefined ? classNames : Object.freeze(result);
}

function classOfSlot(classes: LooseSlotClasses, slot: string): string {
  const classesOfSlot = Object.hasOwn(classes, slot) ? classes[slot] : "";
  return typeof classesOfSlot === "string" ? classesOfSlot : "";
}

export { buildSlotRecipe };
export type { LooseSlotRecipe, LooseSlotRecipeConfig, LooseSlotRecipeProps };
