import {
  compileVariants,
  select,
  undeclared,
} from "../../../packages/recipe/src/variants.ts";
import type { Call } from "./example.ts";
import type { CompiledVariants } from "../../../packages/recipe/src/variants.ts";

type ByName<Value> = Readonly<Record<string, Value>>;

/** The variants, compound variants, and defaults of a config. */
interface VariantsConfig {
  readonly variants: ByName<ByName<unknown>>;
  readonly compoundVariants?:
    readonly { readonly variants: ByName<unknown> }[] | undefined;
  readonly defaultVariants?: ByName<unknown> | undefined;
}

interface NumberedOption {
  readonly name: string;
  readonly number: number;
  readonly isDefault: boolean;
  /** Whether the recipe declares the option without the config naming it. */
  readonly isAdded: boolean;
}

interface NumberedVariant {
  readonly name: string;
  readonly options: readonly NumberedOption[];
  /** What the variant's option number counts for in a key. */
  readonly placeValue: number;
}

/** The options that a compound variant matches, for one variant. */
interface CompoundCondition {
  readonly variant: string;
  readonly options: readonly NumberedOption[];
}

/** The option a selection takes for a variant, if any, in its key. */
interface SelectedOption {
  readonly variant: NumberedVariant;
  readonly option: NumberedOption | undefined;
  /** Whether the call leaves the variant out, so that its default applies. */
  readonly isDefaulted: boolean;
}

interface SelectionKey {
  readonly options: readonly SelectedOption[];
  readonly key: number;
}

/**
 * The option numbers of a config, as the engine compiles them, which the
 * figures of "How it works" show.
 */
interface OptionNumbers {
  readonly variants: readonly NumberedVariant[];
  /** The conditions of each compound variant that can match. */
  readonly compounds: readonly (readonly CompoundCondition[])[];
  /**
   * Returns the option that `call` selects for each variant, and its key.
   *
   * @throws {RangeError} When `call` selects an undeclared option.
   */
  readonly keyOf: (call: Call) => SelectionKey;
}

function isOptionName(option: unknown): boolean {
  return (
    typeof option === "string" ||
    typeof option === "number" ||
    typeof option === "boolean"
  );
}

function numberedVariants(
  config: VariantsConfig,
  compiled: CompiledVariants<unknown>,
): readonly NumberedVariant[] {
  return compiled.names.map((name, variant) => ({
    name,
    options: [...(compiled.indexByOption[variant] ?? [])].map(
      ([option, number]: readonly [string, number]) => ({
        isAdded: !Object.hasOwn(config.variants[name] ?? {}, option),
        isDefault: option === compiled.defaultOptions[variant],
        name: option,
        number,
      }),
    ),
    placeValue: compiled.strides[variant] ?? 0,
  }));
}

function optionNumbered(
  variant: NumberedVariant | undefined,
  number: number,
): NumberedOption {
  const option = variant?.options.find((each) => each.number === number);
  if (option === undefined) {
    throw new RangeError(`The engine numbers no option ${String(number)}`);
  }
  return option;
}

/** Numbers the options of `config` with the engine. */
function optionNumbersOf(config: VariantsConfig): OptionNumbers {
  const compiled = compileVariants<unknown>({
    compoundVariants: (config.compoundVariants ?? []).map(({ variants }) => ({
      value: undefined,
      variants,
    })),
    defaultVariants: config.defaultVariants ?? {},
    noValue: undefined,
    variants: config.variants,
  });
  const variants = numberedVariants(config, compiled);
  return {
    compounds: compiled.compounds.map(({ conditions }) =>
      conditions.map(([index, numbers]) => {
        const variant = variants[index];
        return {
          options: numbers.map((number) => optionNumbered(variant, number)),
          variant: variant?.name ?? "",
        };
      }),
    ),
    keyOf: (call) => {
      const indexes = new Int32Array(variants.length);
      const key = select(compiled, call, indexes);
      if (key === undeclared) {
        throw new RangeError(`${JSON.stringify(call)} has no key`);
      }
      return {
        key,
        options: variants.map((variant, index) => ({
          isDefaulted: !isOptionName(call[variant.name]),
          option: variant.options.find(
            (option) => option.number === indexes[index],
          ),
          variant,
        })),
      };
    },
    variants,
  };
}

export { optionNumbersOf };
export type { CompoundCondition, NumberedVariant, VariantsConfig };
