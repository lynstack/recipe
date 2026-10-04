import type { CreateKindRecipe, KindVariants } from "@lynstack/recipe";
import { createRecipeKind } from "@lynstack/recipe";

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

/** The classes of each slot, in the order of the declared slots. */
type ClassesBySlot = readonly string[];

/**
 * The classes of each slot while a selection is reduced, which
 * {@link appendBySlot} extends in place.
 */
interface SlotAccumulator {
  readonly length: number;
  [index: number]: string;
}

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

/** The slots of a slot recipe and how it joins their classes. */
interface Slots {
  readonly names: readonly string[];
  readonly joinClasses: JoinClasses;
}

/** A slot recipe's config, with the classes of each value by slot. */
interface ClassesBySlotConfig {
  readonly base: ClassesBySlot;
  readonly variants: KindVariants<ClassesBySlot>;
  readonly compoundVariants: readonly {
    readonly variants: LooseSelection;
    readonly value: ClassesBySlot;
  }[];
  readonly defaultVariants: LooseSelection | undefined;
}

/**
 * Returns the slot recipe function for `config`, whose classes are combined
 * with `options.join` and cached unless `options.cache` is false.
 */
function buildSlotRecipe(
  config: LooseSlotRecipeConfig,
  options: BuildOptions,
): LooseSlotRecipe {
  const slots: Slots = {
    joinClasses: createJoinClasses(options.join),
    names: [...config.slots],
  };
  const classRecipe =
    slots.joinClasses === concatClasses
      ? concatKind(slots, options)
      : joinKind(slots, options);
  const classNamesOf = classRecipe(toClassesBySlot(config, slots.names));

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
  slots: Slots,
  options: BuildOptions,
): CreateKindRecipe<ClassesBySlot, LooseSlotClassNames> {
  return createRecipeKind({
    cache: options.cache,
    finish: (classes: SlotAccumulator) => namedBySlot(slots, classes),
    initial: (base: ClassesBySlot | undefined): SlotAccumulator => [
      ...(base ?? []),
    ],
    reduce: appendBySlot,
  });
}

/** Appends the classes of each slot in `added` to `classes`. */
function appendBySlot(
  classes: SlotAccumulator,
  added: ClassesBySlot,
): SlotAccumulator {
  for (let index = 0; index < classes.length; index += 1) {
    classes[index] = appendClasses(classes[index] ?? "", added[index] ?? "");
  }
  return classes;
}

/** Slot recipes whose classes are passed to `joinClasses` by slot. */
function joinKind(
  slots: Slots,
  options: BuildOptions,
): CreateKindRecipe<ClassesBySlot, LooseSlotClassNames> {
  return createRecipeKind({
    cache: options.cache,
    finish: (collected: readonly ClassesBySlot[]) =>
      joinBySlot(slots, collected),
    initial: (base: ClassesBySlot | undefined): readonly ClassesBySlot[] =>
      base === undefined ? [] : [base],
    reduce: (collected: readonly ClassesBySlot[], added: ClassesBySlot) => [
      ...collected,
      added,
    ],
  });
}

function toClassesBySlot(
  config: LooseSlotRecipeConfig,
  slots: readonly string[],
): ClassesBySlotConfig {
  const variants: Record<string, Record<string, ClassesBySlot>> = {};
  for (const [name, options] of Object.entries(config.variants)) {
    variants[name] = Object.fromEntries(
      Object.entries(options).map(
        ([option, classes]: readonly [string, LooseSlotClasses]) => [
          option,
          bySlot(slots, classes),
        ],
      ),
    );
  }
  return {
    base: bySlot(slots, config.base ?? {}),
    compoundVariants: (config.compoundVariants ?? []).map((compound) => ({
      value: bySlot(slots, compound.classNames),
      variants: compound.variants,
    })),
    defaultVariants: config.defaultVariants,
    variants,
  };
}

function bySlot(
  slots: readonly string[],
  classes: LooseSlotClasses,
): ClassesBySlot {
  return slots.map((slot) => classOfSlot(classes, slot));
}

function namedBySlot(
  slots: Slots,
  classes: ArrayLike<string>,
): LooseSlotClassNames {
  const classNames: Record<string, string> = {};
  const { names } = slots;
  for (let index = 0; index < names.length; index += 1) {
    classNames[names[index] ?? ""] = classes[index] ?? "";
  }
  return Object.freeze(classNames);
}

function joinBySlot(
  slots: Slots,
  collected: readonly ClassesBySlot[],
): LooseSlotClassNames {
  const classNames: Record<string, string> = {};
  const { names } = slots;
  for (let index = 0; index < names.length; index += 1) {
    classNames[names[index] ?? ""] = slots.joinClasses(
      collected.map((classes) => classes[index] ?? ""),
    );
  }
  return Object.freeze(classNames);
}

function withOverrides(
  slots: Slots,
  classNames: LooseSlotClassNames,
  overrides: LooseSlotClasses,
): LooseSlotClassNames {
  const overridden = slots.names.filter(
    (slot) => classOfSlot(overrides, slot) !== "",
  );
  if (overridden.length === 0) {
    return classNames;
  }
  const result = { ...classNames };
  for (const slot of overridden) {
    result[slot] = slots.joinClasses([
      classOfSlot(classNames, slot),
      classOfSlot(overrides, slot),
    ]);
  }
  return result;
}

function classOfSlot(classes: LooseSlotClasses, slot: string): string {
  const classesOfSlot = Object.hasOwn(classes, slot) ? classes[slot] : "";
  return typeof classesOfSlot === "string" ? classesOfSlot : "";
}

export { buildSlotRecipe };
export type { LooseSlotRecipe, LooseSlotRecipeConfig, LooseSlotRecipeProps };
