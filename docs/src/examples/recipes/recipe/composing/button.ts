import { styleRecipe } from "../style-recipe.ts";

const control = styleRecipe({
  base: { borderRadius: 6 },
  variants: {
    size: { sm: { height: 32 }, md: { height: 40 } },
    disabled: { true: { opacity: 0.5 } },
  },
  defaultVariants: { size: "md" },
});

export const button = styleRecipe({
  composes: [control],
  base: { fontWeight: 500 },
  variants: {
    tone: { primary: { color: "white" }, neutral: { color: "black" } },
    size: { md: { paddingInline: 16 }, lg: { height: 48 } },
  },
  compoundVariants: [
    { variants: { tone: "primary", disabled: true }, value: { color: "gray" } },
  ],
  defaultVariants: { tone: "primary" },
});
