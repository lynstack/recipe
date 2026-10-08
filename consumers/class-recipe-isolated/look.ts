import type { RecipeOf, SlotRecipeOf } from "@lynstack/class-recipe";
import { cva, sva } from "@lynstack/class-recipe";

const pillConfig = {
  base: "rounded-full",
  defaultVariants: { size: "md" },
  variants: { size: { md: "h-8", sm: "h-6" } },
} as const;

const lookConfig = {
  base: { root: "border" },
  defaultVariants: { size: "md" },
  slots: ["root"],
  variants: { size: { md: { root: "h-8" }, sm: { root: "h-6" } } },
} as const;

const pill: RecipeOf<typeof pillConfig> = cva(pillConfig);
const look: SlotRecipeOf<typeof lookConfig> = sva(lookConfig);

export { look, pill };
