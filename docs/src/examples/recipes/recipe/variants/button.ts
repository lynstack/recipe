import { styleRecipe } from "../style-recipe.ts";

export const button = styleRecipe({
  variants: {
    tone: {
      primary: { color: "white" },
      neutral: { color: "black" },
      ghost: { color: "gray" },
    },
    size: { sm: { height: 32 }, lg: { height: 48 } },
  },
  compoundVariants: [
    {
      variants: { tone: ["primary", "neutral"], size: "lg" },
      value: { fontWeight: 600 },
    },
  ],
  defaultVariants: { size: "sm" },
});
