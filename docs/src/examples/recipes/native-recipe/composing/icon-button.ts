import { createStyleRecipe } from "@lynstack/native-recipe";

import { button } from "./button.ts";

export const iconButton = createStyleRecipe({
  composes: [button],
  base: { alignItems: "center", justifyContent: "center" },
  variants: {
    size: { sm: { width: 32 }, md: { width: 40 } },
  },
});
