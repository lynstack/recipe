import { styleRecipe } from "../style-recipe.ts";

export const button = styleRecipe({
  base: { borderRadius: 6 },
  variants: {
    size: { sm: { height: 32 }, md: { height: 40 }, lg: { height: 48 } },
    tone: { primary: { color: "white" }, neutral: { color: "black" } },
    disabled: { true: { opacity: 0.5 } },
  },
  compoundVariants: [
    { variants: { tone: "primary", disabled: true }, value: { color: "gray" } },
  ],
  defaultVariants: { size: "md", tone: "primary" },
});
