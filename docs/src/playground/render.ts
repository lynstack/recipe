import type {
  Playground,
  PlaygroundName,
  Selection,
  SlotClassName,
} from "./playgrounds.ts";
import { playgrounds } from "./playgrounds.ts";

type TokenKind =
  | "comment"
  | "constant"
  | "function"
  | "keyword"
  | "property"
  | "punctuation"
  | "string";

/** The classes of each slot, by slot name, with `""` for the one element. */
type ClassesBySlot = Readonly<Record<string, readonly string[]>>;

/** A playground, the variants a reader chose, and the classes before them. */
interface CodeInput {
  readonly playground: Playground;
  readonly selection: Selection;
  /** The classes of the previous choice, to mark the classes it adds. */
  readonly previous?: ClassesBySlot;
}

type Entry = readonly [string, string | boolean];

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function token(kind: TokenKind, text: string): string {
  return `<span class="playground-${kind}">${escapeHtml(text)}</span>`;
}

function formatOption(option: string | boolean): string {
  return typeof option === "boolean"
    ? token("constant", String(option))
    : token("string", JSON.stringify(option));
}

/** Writes the call of the recipe named `name` with `selection`. */
function formatCall(name: string, selection: Selection): string {
  const props = Object.entries(selection).map(
    ([variant, option]: Entry) =>
      `${token("property", variant)}${token("punctuation", ": ")}${formatOption(option)}`,
  );
  const argument =
    props.length === 0
      ? ""
      : `${token("punctuation", "{ ")}${props.join(token("punctuation", ", "))}${token("punctuation", " }")}`;
  return `${token("function", name)}${token("punctuation", "(")}${argument}${token("punctuation", ")")}`;
}

/** Writes `className` as a string, marking the classes not in `previous`. */
function formatClassName(
  className: string,
  previous: readonly string[] | undefined,
): string {
  const classes = className
    .split(" ")
    .filter((name) => name !== "")
    .map((name) =>
      previous === undefined || previous.includes(name)
        ? `<span class="playground-class">${escapeHtml(name)}</span>`
        : `<mark class="playground-class">${escapeHtml(name)}</mark>`,
    );
  return `<span class="playground-string">"${classes.join(" ")}"</span>`;
}

function formatResult(
  { slot, className }: SlotClassName,
  previous: ClassesBySlot | undefined,
): string {
  const result = `${token("comment", "// => ")}${formatClassName(className, previous?.[slot ?? ""])}`;
  if (slot === undefined) {
    return result;
  }
  return `${token("property", "classes")}${token("punctuation", ".")}${token("property", slot)}${token("punctuation", ";")} ${result}`;
}

/** Returns the classes of each slot of `classNames`. */
function classesOf(classNames: readonly SlotClassName[]): ClassesBySlot {
  return Object.fromEntries(
    classNames.map(({ slot, className }) => [slot ?? "", className.split(" ")]),
  );
}

/** Writes the call of a playground's recipe and its result, as highlighted HTML. */
function renderCode({ playground, selection, previous }: CodeInput): string {
  const classNames = playground.classNamesOf(selection);
  const call = formatCall(playground.name, selection);
  const hasSlots = classNames.some(({ slot }) => slot !== undefined);
  const first = hasSlots
    ? `${token("keyword", "const")} ${token("property", "classes")} ${token("punctuation", "=")} ${call}${token("punctuation", ";")}`
    : `${call}${token("punctuation", ";")}`;
  return [
    first,
    ...classNames.map((slotClassName) => formatResult(slotClassName, previous)),
  ].join("\n");
}

function isPlaygroundName(name: string | undefined): name is PlaygroundName {
  return name !== undefined && Object.hasOwn(playgrounds, name);
}

/** Reads the options chosen in `form`, leaving out the variants left unset. */
function selectionOf(form: HTMLFormElement): Selection {
  const selection: Record<string, string | boolean> = {};
  for (const [variant, option] of new FormData(form)) {
    if (option === "true" || option === "false") {
      selection[variant] = option === "true";
    } else if (typeof option === "string" && option !== "") {
      selection[variant] = option;
    }
  }
  return selection;
}

function mountPlayground(root: HTMLElement): void {
  const { playground: name } = root.dataset;
  const form = root.querySelector("form");
  const output = root.querySelector("[data-playground-output]");
  if (!isPlaygroundName(name) || form === null || output === null) {
    return;
  }
  const playground = playgrounds[name];
  let previous = classesOf(playground.classNamesOf(selectionOf(form)));
  const update = (): void => {
    const selection = selectionOf(form);
    output.innerHTML = renderCode({ playground, previous, selection });
    previous = classesOf(playground.classNamesOf(selection));
  };
  form.addEventListener("change", update);
  // A form resets its controls after the reset event.
  form.addEventListener("reset", () => {
    setTimeout(update, 0);
  });
}

/** Lets the reader choose the variants of every playground on the page. */
function mountPlaygrounds(): void {
  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-playground]",
  )) {
    mountPlayground(root);
  }
}

export { mountPlaygrounds, renderCode };
