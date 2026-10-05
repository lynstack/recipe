import { ExpressiveCodeTheme } from "@astrojs/starlight/expressive-code";

/** The colors of a code theme, from the lyn-ui tokens of one theme. */
interface CodePalette {
  readonly name: string;
  readonly type: "dark" | "light";
  readonly background: string;
  readonly foreground: string;
  readonly mutedForeground: string;
}

/**
 * Returns a monochrome code theme, as lyn-ui's CodeBlock styles code:
 * keywords and properties stand out by weight, strings and numbers are
 * `foreground`, and comments and punctuation `muted-foreground`. No hues,
 * so color stays free for status and the code reads the same in both
 * themes.
 */
function monochromeTheme(palette: CodePalette): ExpressiveCodeTheme {
  return new ExpressiveCodeTheme({
    colors: {
      "editor.background": palette.background,
      "editor.foreground": palette.foreground,
    },
    name: palette.name,
    tokenColors: [
      {
        scope: [
          "comment",
          "punctuation",
          "punctuation.definition.comment",
          "meta.brace",
          "keyword.operator",
        ],
        settings: { foreground: palette.mutedForeground },
      },
      {
        scope: [
          "keyword",
          "storage",
          "storage.type",
          "storage.modifier",
          "constant.language",
          "variable.language",
          "meta.object-literal.key",
          "variable.other.property",
          "support.type.property-name",
          "entity.name.tag",
        ],
        settings: { fontStyle: "bold", foreground: palette.foreground },
      },
      {
        scope: [
          "string",
          "constant.numeric",
          "variable",
          "entity.name",
          "support",
          "meta",
        ],
        settings: { foreground: palette.foreground },
      },
    ],
    type: palette.type,
  });
}

const lynstackDark = monochromeTheme({
  background: "#19191c",
  foreground: "#ededef",
  mutedForeground: "#a1a1aa",
  name: "lynstack-dark",
  type: "dark",
});

const lynstackLight = monochromeTheme({
  background: "#f4f4f5",
  foreground: "#18181b",
  mutedForeground: "#5f5f68",
  name: "lynstack-light",
  type: "light",
});

export { lynstackDark, lynstackLight };
