import type { Call, SlotValue, Value } from "./example.ts";
import {
  empty,
  escapeHtml,
  formatKey,
  formatList,
  formatProperty,
  join,
  token,
  wrap,
} from "./literal.ts";
import type { Fragment } from "./literal.ts";

/** The keys of the parts of each slot, by slot name, with `""` for the one element. */
type KeysBySlot = Readonly<Record<string, readonly string[]>>;

/** A line of a result, before its indentation. */
interface Line {
  readonly fragment: Fragment;
  readonly depth: number;
  /** Whether a choice added the line or changed its value. */
  readonly marked: boolean;
}

/** Where a value goes on its lines: its depth and the code around it. */
interface Layout {
  readonly depth: number;
  readonly prefix: Fragment;
  readonly suffix: Fragment;
  /** The parts of the value before a choice, to mark the parts it adds or changes. */
  readonly previous: readonly string[] | undefined;
}

/** A call of a recipe, what it returns, and what it returned before. */
interface CallResult {
  readonly name: string;
  readonly call: Call;
  readonly values: readonly SlotValue[];
  readonly previous?: KeysBySlot | undefined;
  /** The slot whose value to show, as the call reads it, rather than every slot. */
  readonly slot?: string | undefined;
}

const indentation = "  ";
/** The widest line a result keeps on one line, as Prettier would. */
const printWidth = 72;

function propertyKey(key: string, value: unknown): string {
  return `${key}: ${JSON.stringify(value)}`;
}

/** Returns the keys of the classes of a class name, or of the properties of a style. */
function partKeysOf(value: Value): readonly string[] {
  return typeof value === "string"
    ? value.split(" ").filter((name) => name !== "")
    : Object.entries(value).map(([key, item]: readonly [string, unknown]) =>
        propertyKey(key, item),
      );
}

/** Returns the keys of the parts of each slot of `values`. */
function keysOf(values: readonly SlotValue[]): KeysBySlot {
  return Object.fromEntries(
    values.map(({ slot, value }) => [slot ?? "", partKeysOf(value)]),
  );
}

function isMarked(
  key: string,
  previous: readonly string[] | undefined,
): boolean {
  return previous !== undefined && !previous.includes(key);
}

function markPart(
  fragment: Fragment,
  key: string,
  previous: readonly string[] | undefined,
): Fragment {
  return isMarked(key, previous)
    ? wrap("mark", "example-part", fragment)
    : fragment;
}

/** Writes `value` on one line, marking the parts not in `previous`. */
function formatValue(
  value: Value,
  previous: readonly string[] | undefined,
): Fragment {
  if (typeof value === "string") {
    const classes = partKeysOf(value).map((name) =>
      markPart(
        wrap("span", "example-class", { html: escapeHtml(name), text: name }),
        name,
        previous,
      ),
    );
    return wrap(
      "span",
      "example-string",
      join([
        { html: '"', text: '"' },
        join(classes, { html: " ", text: " " }),
        { html: '"', text: '"' },
      ]),
    );
  }
  return formatList(
    Object.entries(value).map(([key, item]: readonly [string, unknown]) =>
      markPart(formatProperty(key, item), propertyKey(key, item), previous),
    ),
    "{",
    "}",
  );
}

function fits(depth: number, fragment: Fragment): boolean {
  return indentation.length * depth + fragment.text.length <= printWidth;
}

/**
 * Returns the lines of `value`: one if it fits, or else, for a style, a
 * line for each property, marked when it is not in `previous`.
 */
function linesOf(
  value: Value,
  { depth, prefix, suffix, previous }: Layout,
): readonly Line[] {
  const line = join([prefix, formatValue(value, previous), suffix]);
  const entries = typeof value === "string" ? [] : Object.entries(value);
  if (entries.length === 0 || fits(depth, line)) {
    return [{ depth, fragment: line, marked: false }];
  }
  return [
    {
      depth,
      fragment: join([prefix, token("punctuation", "{")]),
      marked: false,
    },
    ...entries.map(([key, item]: readonly [string, unknown]) => ({
      depth: depth + 1,
      fragment: join([formatProperty(key, item), token("punctuation", ",")]),
      marked: isMarked(propertyKey(key, item), previous),
    })),
    {
      depth,
      fragment: join([token("punctuation", "}"), suffix]),
      marked: false,
    },
  ];
}

/** Returns the lines of what a recipe returns, as one value or an object of slots. */
function resultLines(
  values: readonly SlotValue[],
  previous: KeysBySlot | undefined,
): readonly Line[] {
  const [first] = values;
  if (first !== undefined && first.slot === undefined) {
    return linesOf(first.value, {
      depth: 0,
      prefix: empty,
      previous: previous?.[""],
      suffix: empty,
    });
  }
  const line = formatList(
    values.map(({ slot = "", value }) =>
      join([
        formatKey(slot),
        token("punctuation", ": "),
        formatValue(value, previous?.[slot]),
      ]),
    ),
    "{",
    "}",
  );
  if (fits(0, line)) {
    return [{ depth: 0, fragment: line, marked: false }];
  }
  return [
    { depth: 0, fragment: token("punctuation", "{"), marked: false },
    ...values.flatMap(({ slot = "", value }) =>
      linesOf(value, {
        depth: 1,
        prefix: join([formatKey(slot), token("punctuation", ": ")]),
        previous: previous?.[slot],
        suffix: token("punctuation", ","),
      }),
    ),
    { depth: 0, fragment: token("punctuation", "}"), marked: false },
  ];
}

/** Writes the call of the recipe named `name` with `call`, reading `slot`. */
function formatCall(name: string, call: Call, slot?: string): Fragment {
  const argument = Object.entries(call).map(
    ([prop, value]: readonly [string, unknown]) => formatProperty(prop, value),
  );
  return join([
    token("function", name),
    token("punctuation", "("),
    argument.length === 0 ? empty : formatList(argument, "{", "}"),
    token("punctuation", ")"),
    slot === undefined
      ? empty
      : join([token("punctuation", "."), token("property", slot)]),
  ]);
}

/** Returns the value of `slot` as the value of one element, or every value. */
function valuesToShow(
  values: readonly SlotValue[],
  slot: string | undefined,
): readonly SlotValue[] {
  if (slot === undefined) {
    return values;
  }
  const slotValue = values.find((value) => value.slot === slot);
  if (slotValue === undefined) {
    throw new RangeError(`The recipe has no slot named ${slot}`);
  }
  return [{ slot: undefined, value: slotValue.value }];
}

function formatLine(html: string, marked = false): string {
  const element = marked ? "mark" : "span";
  return `<${element} class="example-line">${html}</${element}>`;
}

/**
 * Writes a call of a recipe and, under an arrow, what it returns, as
 * highlighted HTML.
 */
function formatCallResult({
  name,
  call,
  values,
  previous,
  slot,
}: CallResult): string {
  const lines = resultLines(valuesToShow(values, slot), previous).map(
    ({ fragment, depth, marked }, index) => {
      const lead = index === 0 ? token("arrow", "→ ").html : indentation;
      return formatLine(
        `${lead}${indentation.repeat(depth)}${fragment.html}`,
        marked,
      );
    },
  );
  return `<span class="example-call">${[formatLine(formatCall(name, call, slot).html), ...lines].join("")}</span>`;
}

export { formatCall, formatCallResult, formatLine, keysOf };
export type { KeysBySlot };
