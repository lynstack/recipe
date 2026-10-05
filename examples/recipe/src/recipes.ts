import type { CSSProperties } from "react";
import { createRecipeKind } from "@lynstack/recipe";

type Style = Readonly<CSSProperties>;

const styleKind = {
  initial: (base?: Style): CSSProperties => ({ ...base }),
  reduce: (style: CSSProperties, value: Style) => Object.assign(style, value),
  finish: (style: CSSProperties): Style => Object.freeze(style),
};

const styleRecipe = createRecipeKind(styleKind);

export const button = styleRecipe({
  base: { border: "none", borderRadius: 6, paddingInline: 16 },
  variants: {
    tone: {
      primary: { backgroundColor: "#2563eb", color: "#fff" },
      neutral: { backgroundColor: "#f3f4f6", color: "#111827" },
    },
    size: {
      sm: { height: 32 },
      md: { height: 40 },
    },
    disabled: {
      true: { opacity: 0.5 },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "primary", disabled: true },
      value: { backgroundColor: "#93c5fd" },
    },
  ],
  defaultVariants: { tone: "primary", size: "md" },
});
