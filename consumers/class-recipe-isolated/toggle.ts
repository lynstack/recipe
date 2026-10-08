import type { RecipeOf, SlotRecipeOf } from "@lynstack/class-recipe";
import { cva, sva } from "@lynstack/class-recipe";

import { look, pill } from "./look.js";

const badgeConfig = {
  variants: { tone: { danger: "bg-red-100", neutral: "bg-gray-100" } },
} as const;

const toggleConfig = {
  defaultVariants: { tone: "neutral" },
  slots: ["icon"],
  variants: {
    pressed: { true: { icon: "opacity-100", root: "ring" } },
    tone: {
      danger: { icon: "text-red-700" },
      neutral: { icon: "text-gray-700" },
    },
  },
} as const;

const badge: RecipeOf<typeof badgeConfig, readonly [typeof pill]> = cva({
  ...badgeConfig,
  composes: [pill],
});
const toggle: SlotRecipeOf<typeof toggleConfig, readonly [typeof look]> = sva({
  ...toggleConfig,
  composes: [look],
});

export { badge, toggle };
