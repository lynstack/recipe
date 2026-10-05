import type { CreateKindSlotRecipe, KindVariants } from "@lynstack/recipe";
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
  const slots: Slots = {
    addClasses: concatenates
      ? appendClasses
      : (className, classes) => joinClasses([className, classes]),
    names: [...config.slots],
  };
  const classRecipe = concatenates
    ? concatKind(options)
    : joinKind(joinClasses, options);
  const classNamesOf = classRecipe(withStringClasses(config, slots.names));

  const slotRecipe = (
    props?: LooseSlotRecipeProps | null,
  ): LooseSlotClassNames => {
    const classNames = classNamesOf(props ?? undefined);
    const overrides = props?.classNames;
    return overrides === undefined || overrides === null
      ? classNames
      : withOverrides(slots, classNames, overrides);
  };
  return Object.assign(slotRecipe, { variantKeys: classNamesOf.variantKeys });
}

/** Slot recipes whose classes are concatenated by slot. */
function concatKind(
  options: BuildOptions,
): CreateKindSlotRecipe<string, string> {
  return createSlotRecipeKind({
    cache: options.cache,
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
 * compound variant under `value`, and of each value only the declared
 * slots whose classes are a string that is not empty.
 */
function withStringClasses(
  config: LooseSlotRecipeConfig,
  slots: readonly string[],
): {
  readonly slots: readonly string[];
  readonly base: LooseSlotClassNames;
  readonly variants: KindVariants<LooseSlotClassNames>;
  readonly compoundVariants: readonly {
    readonly variants: LooseSelection;
    readonly value: LooseSlotClassNames;
  }[];
  readonly defaultVariants: LooseSelection | undefined;
} {
  const variants: Record<string, Record<string, LooseSlotClassNames>> = {};
  for (const [name, options] of Object.entries(config.variants)) {
    variants[name] = Object.fromEntries(
      Object.entries(options).map(
        ([option, classes]: readonly [string, LooseSlotClasses]) => [
          option,
          stringClasses(slots, classes),
        ],
      ),
    );
  }
  return {
    base: stringClasses(slots, config.base ?? {}),
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      value: stringClasses(slots, compound.classNames),
      variants: compound.variants,
    })),
    defaultVariants: config.defaultVariants,
    slots,
    variants,
  };
}

/** Returns the classes in `classes` of each slot that has some. */
function stringClasses(
  slots: readonly string[],
  classes: LooseSlotClasses,
): LooseSlotClassNames {
  const classesBySlot: Record<string, string> = {};
  for (const slot of slots) {
    const classesOfSlot = classOfSlot(classes, slot);
    if (classesOfSlot !== "") {
      classesBySlot[slot] = classesOfSlot;
    }
  }
  return classesBySlot;
}

/**
 * Returns `classNames` with the classes of `overrides` added to each slot,
 * or `classNames` itself when `overrides` adds no classes.
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
  return result ?? classNames;
}

function classOfSlot(classes: LooseSlotClasses, slot: string): string {
  const classesOfSlot = Object.hasOwn(classes, slot) ? classes[slot] : "";
  return typeof classesOfSlot === "string" ? classesOfSlot : "";
}

export { buildSlotRecipe };
export type { LooseSlotRecipe, LooseSlotRecipeConfig, LooseSlotRecipeProps };
