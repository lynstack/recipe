import { formatCallResult, keysOf } from "./format.ts";
import type { Selection } from "./example.ts";
import { examples } from "./examples.ts";

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
  const example = name === undefined ? undefined : examples.get(name);
  if (example === undefined || form === null || output === null) {
    return;
  }
  let previous = keysOf(example.valuesOf(selectionOf(form)));
  const update = (): void => {
    const call = selectionOf(form);
    const values = example.valuesOf(call);
    output.innerHTML = formatCallResult({
      call,
      name: example.name,
      previous,
      values,
    });
    previous = keysOf(values);
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

export { mountPlaygrounds };
