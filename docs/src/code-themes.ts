import { ExpressiveCodeTheme } from "@astrojs/starlight/expressive-code";

/** The colors of a code theme, from the lyn-ui tokens of one theme. */
interface CodePalette {
  readonly name: string;
  readonly type: "dark" | "light";
  readonly background: string;
  readonly foreground: string;
  readonly mutedForeground: string;
  /** Keywords and storage, such as `const` and `import`. */
  readonly keyword: string;
  /** Strings. */
  readonly string: string;
  /** Functions, where they are declared and called. */
  readonly function: string;
  /** Types, numbers, and constants such as `true`. */
  readonly constant: string;
}

/** The roles of a palette that color tokens. */
type TokenRole = Exclude<keyof CodePalette, "name" | "type" | "background">;

/** The TextMate scopes that each role colors, later ones winning. */
const scopesByRole: readonly (readonly [TokenRole, readonly string[]])[] = [
  [
    "foreground",
    [
      "variable",
      "meta.object-literal.key",
      "variable.other.property",
      "support.type.property-name",
    ],
  ],
  [
    "mutedForeground",
    [
      "comment",
      "punctuation",
      "punctuation.definition.comment",
      "meta.brace",
      "keyword.operator",
    ],
  ],
  [
    "keyword",
    [
      "keyword",
      "storage",
      "storage.type",
      "storage.modifier",
      "variable.language",
    ],
  ],
  ["string", ["string", "punctuation.definition.string"]],
  ["function", ["entity.name.function", "support.function"]],
  [
    "constant",
    [
      "constant.numeric",
      "constant.language",
      "entity.name.type",
      "support.type",
      "support.class",
      "entity.other.inherited-class",
    ],
  ],
];

/**
 * Returns a code theme in the hues of the lyn-ui chart tokens, never the
 * brand orange, each at 4.5:1 or better on the code background. Comments
 * and punctuation are `muted-foreground`, and names `foreground`.
 */
function codeTheme(palette: CodePalette): ExpressiveCodeTheme {
  return new ExpressiveCodeTheme({
    colors: {
      "editor.background": palette.background,
      "editor.foreground": palette.foreground,
    },
    name: palette.name,
    tokenColors: scopesByRole.map(([role, scope]) => ({
      scope: [...scope],
      settings: { foreground: palette[role] },
    })),
    type: palette.type,
  });
}

const lynstackDark = codeTheme({
  background: "#19191c",
  constant: "#f2b33d",
  foreground: "#ededef",
  function: "#6f9ff2",
  keyword: "#ae95f5",
  mutedForeground: "#a1a1aa",
  name: "lynstack-dark",
  string: "#3fc2af",
  type: "dark",
});

const lynstackLight = codeTheme({
  background: "#f6f6f7",
  constant: "#a3480a",
  foreground: "#111113",
  function: "#1d4ed8",
  keyword: "#6d28d9",
  mutedForeground: "#55555e",
  name: "lynstack-light",
  string: "#047857",
  type: "light",
});

export { lynstackDark, lynstackLight };
