import { sva } from "@lynstack/class-recipe";

import { card } from "./card.ts";

export const dialog = sva({
  composes: [card],
  slots: ["footer"],
  base: { root: "max-w-lg", footer: "flex justify-end gap-2" },
  variants: {
    size: { sm: { footer: "pt-2" }, md: { footer: "pt-4" } },
  },
});
