/**
 * Variant definitions in the loose shape the runtime works with: for each
 * variant name, the value of each of its options.
 */
type LooseVariants<Value> = Readonly<
  Record<string, Readonly<Record<string, Value>>>
>;

/** A selection in the loose shape the runtime works with. */
type SelectedVariants = Readonly<Record<string, unknown>>;

/** A compound variant in the loose shape the runtime works with. */
interface LooseCompoundVariant<Value> {
  readonly variants: SelectedVariants;
  readonly value: Value;
}

/** The variant's index and the option indexes that a condition matches. */
type CompoundCondition = readonly [number, readonly number[]];

/** A compound variant prepared for matching. */
interface Compound<Value> {
  readonly conditions: readonly CompoundCondition[];
  readonly value: Value;
}

/** What {@link compileVariants} prepares. */
interface VariantsConfig<Value> {
  readonly variants: LooseVariants<Value>;
  readonly defaultVariants: SelectedVariants;
  readonly compoundVariants: readonly LooseCompoundVariant<Value>[];
  /**
   * The value of a variant without a selected option, and of a boolean
   * option that the variant does not declare.
   */
  readonly noValue: Value;
}

/**
 * Variants prepared for selecting values. Each variant numbers its options
 * from 1, and 0 stands for no option, so a selection is a list of option
 * indexes. Read together as the digits of a mixed-radix number, they form
 * the selection's key.
 */
interface CompiledVariants<Value> {
  readonly names: readonly string[];
  readonly defaultOptions: readonly (string | undefined)[];
  readonly indexByOption: readonly ReadonlyMap<string, number>[];
  /** The value of each variant's options, by option index. */
  readonly valuesByIndex: readonly (readonly Value[])[];
  readonly strides: readonly number[];
  readonly compounds: readonly Compound<Value>[];
  /** Whether every selection's key is a safe integer. */
  readonly isCacheable: boolean;
}

/** The option index of a variant without a selected option. */
const noOption = 0;

/** The key of a selection with an option that a variant does not declare. */
const undeclared = -1;

const noProps: SelectedVariants = Object.freeze({});

/**
 * Prepares variants for selecting values. A variant that declares an option
 * named `"true"` or `"false"` also declares the other one, with
 * `config.noValue`, and a variant whose only options are those defaults to
 * `"false"`. A compound variant that names an undeclared variant or option,
 * or lists no option for a variant, never matches and is left out.
 */
function compileVariants<Value>(
  config: VariantsConfig<Value>,
): CompiledVariants<Value> {
  const names = Object.keys(config.variants);
  const optionValues = names.map((name) =>
    withBooleanOptions(config.variants[name] ?? {}, config.noValue),
  );
  const indexByOption: readonly ReadonlyMap<string, number>[] =
    optionValues.map(
      (valuesByOption) =>
        new Map(
          Object.keys(valuesByOption).map((option, index) => [
            option,
            index + 1,
          ]),
        ),
    );
  const radixes = indexByOption.map((indexes) => indexes.size + 1);

  return {
    compounds: compileCompounds(config.compoundVariants, names, indexByOption),
    defaultOptions: names.map(
      (name, index) =>
        toOptionName(config.defaultVariants[name]) ??
        (isBooleanVariant(indexByOption[index]) ? "false" : undefined),
    ),
    indexByOption,
    isCacheable: product(radixes) <= Number.MAX_SAFE_INTEGER,
    names,
    strides: radixes.map((_radix, index) => product(radixes.slice(0, index))),
    valuesByIndex: valuesByIndexOf(optionValues, config.noValue),
  };
}

/**
 * Writes the option index of each variant for `selected` into `indexes`
 * and returns the selection's key, or {@link undeclared} when an option is
 * not declared.
 */
function select(
  compiled: CompiledVariants<unknown>,
  selected: SelectedVariants,
  indexes: Int32Array,
): number {
  let key = 0;
  for (let variant = 0; variant < compiled.names.length; variant += 1) {
    const index = selectIndex(compiled, selected, variant);
    indexes[variant] = index ?? noOption;
    key =
      index === undefined || key === undeclared
        ? undeclared
        : key + index * (compiled.strides[variant] ?? 0);
  }
  return key;
}

function selectIndex(
  compiled: CompiledVariants<unknown>,
  selected: SelectedVariants,
  variant: number,
): number | undefined {
  const option =
    toOptionName(selected[compiled.names[variant] ?? ""]) ??
    compiled.defaultOptions[variant];
  return option === undefined
    ? noOption
    : compiled.indexByOption[variant]?.get(option);
}

function valuesByIndexOf<Value>(
  optionValues: readonly Readonly<Record<string, Value>>[],
  noValue: Value,
): Value[][] {
  const valuesByIndex: Value[][] = [];
  for (const valuesByOption of optionValues) {
    valuesByIndex.push([noValue, ...Object.values(valuesByOption)]);
  }
  return valuesByIndex;
}

function product(numbers: readonly number[]): number {
  return numbers.reduce((result, number) => result * number, 1);
}

function withBooleanOptions<Value>(
  valuesByOption: Readonly<Record<string, Value>>,
  noValue: Value,
): Readonly<Record<string, Value>> {
  const optionNames = Object.keys(valuesByOption);
  if (!optionNames.some((option) => isBooleanName(option))) {
    return valuesByOption;
  }
  return { false: noValue, true: noValue, ...valuesByOption };
}

function compileCompounds<Value>(
  compoundVariants: readonly LooseCompoundVariant<Value>[],
  names: readonly string[],
  indexByOption: readonly ReadonlyMap<string, number>[],
): Compound<Value>[] {
  return compoundVariants.flatMap(({ variants, value }) => {
    const conditions = Object.keys(variants)
      .filter((name) => variants[name] !== undefined)
      .map((name) =>
        compileCondition(indexByOption, names.indexOf(name), variants[name]),
      );
    return conditions.every(([, indexes]) => indexes.length > 0)
      ? [{ conditions, value }]
      : [];
  });
}

function compileCondition(
  indexByOption: readonly ReadonlyMap<string, number>[],
  variant: number,
  value: unknown,
): CompoundCondition {
  const indexes = indexByOption[variant];
  return [
    variant,
    toOptionNames(value)
      .map((option) => indexes?.get(option))
      .filter((index): index is number => index !== undefined),
  ];
}

function isBooleanVariant(
  indexByOption: ReadonlyMap<string, number> | undefined,
): boolean {
  return (
    indexByOption !== undefined &&
    indexByOption.size > 0 &&
    [...indexByOption.keys()].every((option) => isBooleanName(option))
  );
}

function toOptionName(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : undefined;
}

function toOptionNames(value: unknown): readonly string[] {
  const values: readonly unknown[] = Array.isArray(value) ? value : [value];
  return values
    .map((option) => toOptionName(option))
    .filter((option): option is string => option !== undefined);
}

/** A recipe function with the names, options, and defaults of its variants. */
type WithVariants<Recipe> = Recipe & {
  readonly variantKeys: readonly string[];
  readonly variantOptions: Readonly<Record<string, readonly string[]>>;
  readonly defaultVariants: Readonly<Record<string, string>>;
};

/**
 * Adds the names of the compiled variants to `recipe` as `variantKeys`,
 * the names of their options as `variantOptions`, and the option each
 * variant uses when a selection leaves it out as `defaultVariants`.
 */
function withVariants<Recipe extends object>(
  recipe: Recipe,
  compiled: CompiledVariants<unknown>,
): WithVariants<Recipe> {
  return Object.assign(recipe, {
    defaultVariants: Object.freeze(defaultVariantsOf(compiled)),
    variantKeys: Object.freeze([...compiled.names]),
    variantOptions: Object.freeze(variantOptionsOf(compiled)),
  });
}

function variantOptionsOf(
  compiled: CompiledVariants<unknown>,
): Record<string, readonly string[]> {
  const entries = compiled.names.map((name, index) => {
    const options = compiled.indexByOption[index]?.keys() ?? [];
    return [name, Object.freeze([...options])] as const;
  });
  return Object.fromEntries(entries);
}

function defaultVariantsOf(
  compiled: CompiledVariants<unknown>,
): Record<string, string> {
  const entries = compiled.names.flatMap((name, index) => {
    const option = compiled.defaultOptions[index];
    return option === undefined ? [] : [[name, option] as const];
  });
  return Object.fromEntries(entries);
}

function isBooleanName(option: string): boolean {
  return option === "true" || option === "false";
}

export {
  compileVariants,
  isBooleanName,
  noOption,
  noProps,
  select,
  toOptionName,
  toOptionNames,
  undeclared,
  withVariants,
};
export type {
  CompiledVariants,
  Compound,
  LooseCompoundVariant,
  LooseVariants,
  SelectedVariants,
  WithVariants,
};
