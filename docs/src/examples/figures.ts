import type { CompoundCondition, NumberedVariant } from "./option-numbers.ts";
import {
  formatList,
  formatLiteral,
  formatProperty,
  join,
  token,
  wrap,
} from "./literal.ts";
import { slotTraceExampleOf, traceConfigOf, traceExampleOf } from "./traces.ts";
import type { Call } from "./example.ts";
import type { Fragment } from "./literal.ts";
import type { TraceStep } from "./recorder.ts";
import { optionNumbersOf } from "./option-numbers.ts";
import { traceCall } from "./trace.ts";
import { traceSlotCall } from "./slot-trace.ts";

/** Writes a call of the recipe `name` as code. */
function callHtml(name: string, call: Call): string {
  return join([
    token("function", name),
    token("punctuation", "("),
    formatLiteral(call),
    token("punctuation", ")"),
  ]).html;
}

/** Writes a style as code, with the properties in `marked` marked. */
function styleHtml(
  style: Readonly<Record<string, unknown>>,
  marked: readonly string[] = [],
): string {
  const properties = Object.entries(style).map(
    ([key, value]: readonly [string, unknown]): Fragment => {
      const property = formatProperty(key, value);
      return marked.includes(key)
        ? wrap("mark", "example-part", property)
        : property;
    },
  );
  return formatList(properties, "{", "}").html;
}

/** What a step of a trace shows: what it did, and with what. */
interface StepFigure {
  readonly operation: TraceStep["operation"];
  readonly origin: string;
  /** The value the step adds, as code, unless it adds none. */
  readonly valueHtml: string | undefined;
  /** The accumulator after the step, or the result, as code. */
  readonly accumulatorHtml: string;
}

function originOf(step: TraceStep): string {
  if (step.operation === "finish") {
    return "returns the result";
  }
  return step.origin ?? "no base";
}

/** Returns what each step of a trace shows. */
function stepFigures(steps: readonly TraceStep[]): readonly StepFigure[] {
  return steps.map((step) => ({
    accumulatorHtml: styleHtml(
      step.accumulator,
      step.operation === "finish" ? [] : step.changed,
    ),
    operation: step.operation,
    origin: originOf(step),
    valueHtml:
      step.operation === "reduce" && step.value !== undefined
        ? styleHtml(step.value)
        : undefined,
  }));
}

/** Counts the values that a trace reduces. */
function reduceCount(steps: readonly TraceStep[]): number {
  return steps.filter((step) => step.operation === "reduce").length;
}

/** A call of a traced recipe that a figure shows. */
interface FigureCall {
  /** The path of the recipe's module in `recipes`. */
  readonly name: string;
  /** The name of the recipe in the code that the page shows. */
  readonly recipe: string;
  readonly call: Call;
}

/** What the figure of the option numbers of a recipe shows. */
interface OptionNumbersFigure {
  readonly variants: readonly NumberedVariant[];
  readonly compounds: readonly {
    readonly label: string;
    readonly conditions: readonly CompoundCondition[];
  }[];
}

/** Returns the option numbers of the traced recipe named `name`. */
function optionNumbersFigureOf(name: string): OptionNumbersFigure {
  const { variants, compounds } = optionNumbersOf(traceConfigOf(name));
  return {
    compounds: compounds.map((conditions, index) => ({
      conditions,
      label: `Compound ${String(index + 1)}`,
    })),
    variants,
  };
}

/** The option a call selects for a variant, and what it adds to the key. */
interface SelectedOptionFigure {
  readonly variant: string;
  /** The option's name, or `"none"` when the variant has no option. */
  readonly option: string;
  readonly number: number;
  readonly placeValue: number;
  readonly isDefaulted: boolean;
  /** Whether the option's term comes first in the sum of the key. */
  readonly isFirst: boolean;
}

/** What the figure of a call of a recipe, from its key to its result, shows. */
interface CallFlowFigure {
  readonly callHtml: string;
  readonly options: readonly SelectedOptionFigure[];
  readonly key: number;
  readonly reduces: number;
}

/** Returns how a traced recipe keys and builds the result of a call. */
function callFlowOf({ name, recipe, call }: FigureCall): CallFlowFigure {
  const { key, options } = optionNumbersOf(traceConfigOf(name)).keyOf(call);
  const trace = traceCall(traceExampleOf(name), call, { combine: false });
  return {
    callHtml: callHtml(recipe, call),
    key,
    options: options.map(({ variant, option, isDefaulted }, index) => ({
      isDefaulted,
      isFirst: index === 0,
      number: option?.number ?? 0,
      option: option?.name ?? "none",
      placeValue: variant.placeValue,
      variant: variant.name,
    })),
    reduces: reduceCount(trace.steps),
  };
}

/** What the figure of a trace of a recipe shows. */
interface RecipeTraceFigure {
  readonly callHtml: string;
  /** How many values the call reduces, such as `"4 reduces"`. */
  readonly reduces: string;
  /** The values that `combine` made when the recipe was created. */
  readonly combinations: readonly {
    readonly origin: string;
    readonly valueHtml: string;
  }[];
  readonly steps: readonly StepFigure[];
}

/**
 * Returns the trace of a call of a traced recipe, built with or without
 * the kind's `combine`.
 */
function recipeTraceOf(
  { name, recipe, call }: FigureCall,
  options: { readonly combine: boolean },
): RecipeTraceFigure {
  const trace = traceCall(traceExampleOf(name), call, options);
  const reduces = reduceCount(trace.steps);
  return {
    callHtml: callHtml(recipe, call),
    combinations: trace.combinations.map(({ origin, value }) => ({
      origin,
      valueHtml: styleHtml(value),
    })),
    reduces: `${String(reduces)} ${reduces === 1 ? "reduce" : "reduces"}`,
    steps: stepFigures(trace.steps),
  };
}

/** What the figure of a trace of a slot recipe shows. */
interface SlotRecipeTraceFigure {
  readonly callHtml: string;
  readonly slots: readonly {
    readonly slot: string;
    readonly steps: readonly StepFigure[];
  }[];
}

/** Returns the trace of a call of a traced slot recipe, slot by slot. */
function slotRecipeTraceOf({
  name,
  recipe,
  call,
}: FigureCall): SlotRecipeTraceFigure {
  return {
    callHtml: callHtml(recipe, call),
    slots: traceSlotCall(slotTraceExampleOf(name), call).map(
      ({ slot, steps }) => ({ slot, steps: stepFigures(steps) }),
    ),
  };
}

export { callFlowOf, optionNumbersFigureOf, recipeTraceOf, slotRecipeTraceOf };
export type { FigureCall, StepFigure };
