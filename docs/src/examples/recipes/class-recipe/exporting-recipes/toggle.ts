import type { SlotRecipeOf } from "@lynstack/class-recipe";
import { sva } from "@lynstack/class-recipe";

import { look } from "./look.ts";

const toggleConfig = {
  slots: ["icon"],
  variants: {
    pressed: {
      false: { icon: "opacity-50" },
      true: { root: "bg-gray-100", icon: "opacity-100" },
    },
  },
} as const;

export const toggle: SlotRecipeOf<typeof toggleConfig, readonly [typeof look]> =
  sva({ ...toggleConfig, composes: [look] });
