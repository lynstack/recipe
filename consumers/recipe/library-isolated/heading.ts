import type { KindRecipeOf, KindSlotRecipeOf } from "@lynstack/recipe";

import { card, text } from "./text.js";
import { slotStyleRecipe, styleRecipe } from "./kind.js";
import type { Style } from "./kind.js";

const headingConfig = {
  defaultVariants: { weight: "bold" },
  variants: {
    size: { xl: { fontSize: 32 } },
    weight: { bold: { fontWeight: 700 }, regular: { fontWeight: 400 } },
  },
} as const;

const dialogConfig = {
  slots: ["footer"],
  variants: { tone: { dark: { footer: { borderColor: "white" } } } },
} as const;

const heading: KindRecipeOf<
  Style,
  Style,
  typeof headingConfig,
  readonly [typeof text]
> = styleRecipe({ ...headingConfig, composes: [text] });
const dialog: KindSlotRecipeOf<
  Style,
  Style,
  typeof dialogConfig,
  readonly [typeof card]
> = slotStyleRecipe({ ...dialogConfig, composes: [card] });

export { dialog, heading };
