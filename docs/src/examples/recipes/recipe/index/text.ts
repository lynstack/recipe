import { createRecipeKind } from "@lynstack/recipe";
import { styleKind } from "../quick-start/style-kind.ts";

const styleRecipe = createRecipeKind(styleKind);

export const text = styleRecipe({
  base: { color: "black" },
  variants: {
    size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } },
    muted: { true: { opacity: 0.6 } },
  },
  compoundVariants: [
    { variants: { size: "lg", muted: true }, value: { fontWeight: 300 } },
  ],
  defaultVariants: { size: "sm" },
});
