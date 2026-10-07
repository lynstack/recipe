/** The option of each variant that a reader chose, as a recipe takes it. */
type Selection = Readonly<Record<string, string | boolean>>;

/** The argument of a call of a recipe, as a page writes it. */
type Call = Readonly<Record<string, unknown>>;

/** A variant that a reader can choose, with its options. */
interface Control {
  readonly name: string;
  readonly options: readonly string[];
  /** The option chosen at first, or `""` to leave the variant out. */
  readonly initial: string;
}

/** A class name, or a style object, that a recipe returns for an element. */
type Value = string | object;

/** The value of one slot, or of the one element when `slot` is undefined. */
interface SlotValue {
  readonly slot: string | undefined;
  readonly value: Value;
}

/** What an example's recipe returns: class names or style objects. */
type ValueKind = "className" | "style";

/** A recipe of the docs, which a page calls or a reader plays with. */
interface Example {
  /** The name of the recipe in the code that the docs show. */
  readonly name: string;
  readonly kind: ValueKind;
  readonly controls: readonly Control[];
  /**
   * Calls the recipe and reads what it returns.
   *
   * @throws {RangeError} When `call` passes anything but the options the
   *   recipe declares and the overrides of its kind.
   */
  readonly valuesOf: (call: Call) => readonly SlotValue[];
}

/**
 * The options of each variant of a recipe, which `Props` lists. `Props` is
 * undefined too when the recipe's argument is optional.
 */
type OptionsOf<Props> = {
  readonly [
    Name in Exclude<
      keyof NonNullable<Props>,
      "className" | "classNames"
    > as Name extends string ? Name : never
  ]-?: readonly `${Extract<NonNullable<NonNullable<Props>[Name]>, string | number>}`[];
};

/** The variants of `Props` that a selection cannot leave out. */
type RequiredVariant<Props> = Extract<
  {
    [
      Name in keyof NonNullable<Props>
    ]-?: undefined extends NonNullable<Props>[Name] ? never : Name;
  }[keyof NonNullable<Props>],
  string
>;

/** The options of the variants of `Props` that `Listed` leaves out. */
type UnlistedOption<Props, Listed extends OptionsOf<Props>> = {
  readonly [Name in keyof OptionsOf<Props>]: Exclude<
    OptionsOf<Props>[Name][number],
    Listed[Name][number]
  >;
}[keyof OptionsOf<Props>];

/**
 * Accepts `Listed` when it lists every option of each variant, and names
 * the options it leaves out otherwise.
 */
type EveryOption<Props, Listed extends OptionsOf<Props>> = [
  UnlistedOption<Props, Listed>,
] extends [never]
  ? unknown
  : { readonly unlistedOptions: UnlistedOption<Props, Listed> };

/**
 * Accepts `Listed` when it lists every variant that a selection cannot
 * leave out, and names those it leaves out otherwise.
 */
type EveryRequired<Props, Listed extends readonly RequiredVariant<Props>[]> = [
  Exclude<RequiredVariant<Props>, Listed[number]>,
] extends [never]
  ? unknown
  : {
      readonly unlistedVariants: Exclude<
        RequiredVariant<Props>,
        Listed[number]
      >;
    };

/** A recipe, the options a reader can choose, and how to read its result. */
interface ExampleConfig<
  Props,
  Result,
  Listed extends OptionsOf<Props>,
  Required extends readonly RequiredVariant<Props>[],
> {
  readonly name: string;
  readonly kind: ValueKind;
  readonly recipe: ((props: Props) => Result) & {
    readonly variantKeys: readonly string[];
  };
  /** Every option of each variant, in the order the playground shows. */
  readonly options: Listed & EveryOption<Props, Listed>;
  /** The variants without a default, which start at their first option. */
  readonly required: readonly [...Required] & EveryRequired<Props, Required>;
  readonly valuesOf: (result: Result) => readonly SlotValue[];
}

/** The props, besides variants, that a recipe of each kind takes. */
const overrides: Readonly<Record<ValueKind, readonly string[]>> = {
  className: ["className", "classNames"],
  style: [],
};

/** Returns the name of the option that `value` chooses, as a config declares it. */
function optionName(value: unknown): string {
  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
    ? String(value)
    : "";
}

/**
 * Checks that `call` chooses only options that `options` lists, or leaves
 * a variant undefined, and passes no other props but `allowed`.
 */
function isCallOf<Props>(
  call: Call,
  options: OptionsOf<Props>,
  allowed: readonly string[],
): call is Call & Props {
  const optionsByVariant: Readonly<
    Record<string, readonly string[] | undefined>
  > = options;
  return Object.entries(call).every(
    ([prop, value]: readonly [string, unknown]) =>
      allowed.includes(prop) ||
      (Object.hasOwn(optionsByVariant, prop) &&
        (value === undefined ||
          optionsByVariant[prop]?.includes(optionName(value)) === true)),
  );
}

function defineExample<
  Props,
  Result,
  const Listed extends OptionsOf<Props>,
  const Required extends readonly RequiredVariant<Props>[],
>({
  name,
  kind,
  recipe,
  options,
  required,
  valuesOf,
}: ExampleConfig<Props, Result, Listed, Required>): Example {
  const optionsByVariant: Readonly<
    Record<string, readonly string[] | undefined>
  > = options;
  const requiredVariants: readonly string[] = required;
  const controls = recipe.variantKeys.map((variant) => {
    const variantOptions = optionsByVariant[variant] ?? [];
    return {
      initial: requiredVariants.includes(variant)
        ? (variantOptions[0] ?? "")
        : "",
      name: variant,
      options: variantOptions,
    };
  });
  return {
    controls,
    kind,
    name,
    valuesOf: (call) => {
      if (!isCallOf(call, options, overrides[kind])) {
        throw new RangeError(
          `${name} declares no such options: ${JSON.stringify(call)}`,
        );
      }
      return valuesOf(recipe(call));
    },
  };
}

/** Reads the result of a recipe, which styles one element. */
function elementValue(value: Value): readonly SlotValue[] {
  return [{ slot: undefined, value }];
}

/** Reads the result of a slot recipe, which styles each of its slots. */
function slotValues(
  values: Readonly<Record<string, Value>>,
): readonly SlotValue[] {
  return Object.entries(values).map(
    ([slot, value]: readonly [string, Value]) => ({ slot, value }),
  );
}

/** Returns the options that the controls of `example` start at. */
function initialSelection(example: Example): Selection {
  return Object.fromEntries(
    example.controls
      .filter((control) => control.initial !== "")
      .map((control) => [control.name, control.initial]),
  );
}

export { defineExample, elementValue, initialSelection, slotValues };
export type { Call, Control, Example, Selection, SlotValue, Value, ValueKind };
