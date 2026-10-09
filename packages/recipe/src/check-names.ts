import { isBooleanName, toOptionName, toOptionNames } from "./variants.js";
import type { Layer } from "./compose.js";

/**
 * The console, which every runtime that runs the packages has, and which
 * the ES2022 library does not declare.
 */
declare const console: { readonly warn: (message: string) => void };

/** The options of each variant that the layers of a recipe declare. */
type DeclaredOptions = ReadonlyMap<string, readonly string[]>;

function declaredOptionsOf<Value>(
  layers: readonly Layer<Value>[],
): DeclaredOptions {
  const optionsByName = new Map<string, readonly string[]>();
  for (const { variants } of layers) {
    for (const [name, options] of Object.entries(variants)) {
      const declared = [
        ...(optionsByName.get(name) ?? []),
        ...Object.keys(options),
      ];
      optionsByName.set(
        name,
        declared.some((option) => isBooleanName(option))
          ? [...declared, "true", "false"]
          : declared,
      );
    }
  }
  return optionsByName;
}

function unknownDefaults(
  defaultVariants: Readonly<Record<string, unknown>>,
  declared: ReadonlyMap<string, readonly string[]>,
): string[] {
  return Object.entries(defaultVariants).flatMap(
    ([name, value]: readonly [string, unknown]) => {
      if (value === undefined) {
        return [];
      }
      const options = declared.get(name);
      if (options === undefined) {
        return [`\`defaultVariants\` names the variant "${name}".`];
      }
      const option = toOptionName(value);
      return option !== undefined && options.includes(option)
        ? []
        : [
            `\`defaultVariants\` gives "${name}" the option ${JSON.stringify(value)}.`,
          ];
    },
  );
}

function unknownConditions<Value>(
  own: Layer<Value>,
  declared: ReadonlyMap<string, readonly string[]>,
): string[] {
  return own.compoundVariants.flatMap(({ variants }, index) =>
    Object.entries(variants).flatMap(
      ([name, value]: readonly [string, unknown]) => {
        if (value === undefined) {
          return [];
        }
        const options = declared.get(name);
        if (options === undefined) {
          return [
            `Compound variant ${String(index)} names the variant "${name}".`,
          ];
        }
        return toOptionNames(value)
          .filter((option) => !options.includes(option))
          .map(
            (option) =>
              `Compound variant ${String(index)} names the option "${option}" of "${name}".`,
          );
      },
    ),
  );
}

function unknownSlotsIn(
  value: unknown,
  slots: readonly string[],
  where: string,
): string[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }
  return Object.keys(value)
    .filter((slot) => !slots.includes(slot))
    .map((slot) => `${where} gives a value to the slot "${slot}".`);
}

function unknownSlots<Value>(
  own: Layer<Value>,
  slots: readonly string[],
): string[] {
  return [
    ...unknownSlotsIn(own.base, slots, "`base`"),
    ...Object.entries(own.variants).flatMap(
      ([name, options]: readonly [string, Readonly<Record<string, Value>>]) =>
        Object.entries(options).flatMap(
          ([option, value]: readonly [string, Value]) =>
            unknownSlotsIn(value, slots, `The option "${option}" of "${name}"`),
        ),
    ),
    ...own.compoundVariants.flatMap(({ value }, index) =>
      unknownSlotsIn(value, slots, `Compound variant ${String(index)}`),
    ),
  ];
}

/**
 * Returns the names in a recipe's own config that none of its layers
 * declares: a variant or option in its defaults or compound variants, and,
 * for a slot recipe, a slot that a value is given to. Such a default or
 * value is left out, and such a compound variant never matches. Each layer
 * was checked when its own recipe was created, so only `own` is checked.
 */
function unknownNames<Value>(
  own: Layer<Value>,
  layers: readonly Layer<Value>[],
  isSlotRecipe: boolean,
): string[] {
  const declared = declaredOptionsOf(layers);
  return [
    ...unknownDefaults(own.defaultVariants, declared),
    ...unknownConditions(own, declared),
    ...(isSlotRecipe
      ? unknownSlots(
          own,
          layers.flatMap(({ slots }) => slots),
        )
      : []),
  ];
}

const warned = new Set<string>();

/**
 * Warns once about the names that {@link unknownNames} returns, if any. A
 * warning already given is not repeated, so that a recipe created again
 * with the same config, such as a themed recipe for each theme, warns once.
 */
function warnUnknownNames<Value>(
  own: Layer<Value>,
  layers: readonly Layer<Value>[],
  isSlotRecipe: boolean,
): void {
  const problems = unknownNames(own, layers, isSlotRecipe);
  if (problems.length === 0) {
    return;
  }
  const warning = `A recipe's config names variants, options, or slots that it does not declare, so they add nothing:\n- ${problems.join("\n- ")}`;
  if (!warned.has(warning)) {
    warned.add(warning);
    console.warn(warning);
  }
}

export { unknownNames, warnUnknownNames };
