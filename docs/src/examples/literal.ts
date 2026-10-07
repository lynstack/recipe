type TokenKind =
  "arrow" | "constant" | "function" | "property" | "punctuation" | "string";

/** Code as HTML, with its text to measure its width. */
interface Fragment {
  readonly text: string;
  readonly html: string;
}

const empty: Fragment = { html: "", text: "" };

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function token(kind: TokenKind, text: string): Fragment {
  return {
    html: `<span class="example-${kind}">${escapeHtml(text)}</span>`,
    text,
  };
}

function join(
  fragments: readonly Fragment[],
  separator: Fragment = empty,
): Fragment {
  return {
    html: fragments.map(({ html }) => html).join(separator.html),
    text: fragments.map(({ text }) => text).join(separator.text),
  };
}

function wrap(
  element: string,
  className: string,
  fragment: Fragment,
): Fragment {
  return {
    html: `<${element} class="${className}">${fragment.html}</${element}>`,
    text: fragment.text,
  };
}

function formatKey(key: string): Fragment {
  return /^[A-Za-z_$][\w$]*$/u.test(key)
    ? token("property", key)
    : token("string", JSON.stringify(key));
}

/**
 * Writes `items` between `open` and `close` on one line, with a space
 * inside braces but not inside brackets, as Prettier does.
 */
function formatList(
  items: readonly Fragment[],
  open: string,
  close: string,
): Fragment {
  const padding = open === "{" ? " " : "";
  return items.length === 0
    ? token("punctuation", `${open}${close}`)
    : join([
        token("punctuation", `${open}${padding}`),
        join(items, token("punctuation", ", ")),
        token("punctuation", `${padding}${close}`),
      ]);
}

/** Writes `value` as a JavaScript literal on one line. */
function formatLiteral(value: unknown): Fragment {
  if (typeof value === "string") {
    return token("string", JSON.stringify(value));
  }
  if (Array.isArray(value)) {
    return formatList(
      value.map((item: unknown) => formatLiteral(item)),
      "[",
      "]",
    );
  }
  if (typeof value === "object" && value !== null) {
    return formatList(
      Object.entries(value).map(([key, item]: readonly [string, unknown]) =>
        formatProperty(key, item),
      ),
      "{",
      "}",
    );
  }
  return token("constant", String(value));
}

function formatProperty(key: string, value: unknown): Fragment {
  return join([
    formatKey(key),
    token("punctuation", ": "),
    formatLiteral(value),
  ]);
}

export {
  empty,
  escapeHtml,
  formatKey,
  formatList,
  formatLiteral,
  formatProperty,
  join,
  token,
  wrap,
};
export type { Fragment };
