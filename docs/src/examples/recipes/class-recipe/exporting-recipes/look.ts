import type { SlotRecipeOf } from "@lynstack/class-recipe";
import { sva } from "@lynstack/class-recipe";

const lookConfig = {
  slots: ["root"],
  base: { root: "inline-flex items-center rounded-md border" },
  variants: {
    size: { sm: { root: "h-8 px-2" }, md: { root: "h-10 px-4" } },
  },
  defaultVariants: { size: "md" },
} as const;

export const look: SlotRecipeOf<typeof lookConfig> = sva(lookConfig);
