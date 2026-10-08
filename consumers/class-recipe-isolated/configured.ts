import type { RecipeOf, Recipes, SlotRecipeOf } from "@lynstack/class-recipe";
import { createRecipes, cva as plainCva } from "@lynstack/class-recipe";

import { look, pill } from "./look.js";

/** Keeps the last class of each prefix, as a merge of conflicts does. */
function keepLastOfEachPrefix(...classNames: readonly string[]): string {
  const byPrefix = new Map<string, string>();
  for (const className of classNames.join(" ").split(" ")) {
    const [prefix = className] = className.split("-");
    byPrefix.delete(prefix);
    byPrefix.set(prefix, className);
  }
  return [...byPrefix.values()].join(" ");
}

const configured: Recipes = createRecipes({
  cache: false,
  join: keepLastOfEachPrefix,
});

const chipConfig = {
  base: "inline-flex px-4",
  variants: { tone: { danger: "bg-red-100", neutral: "bg-gray-100" } },
} as const;

const tagConfig = {
  defaultVariants: { tone: "neutral" },
  variants: { muted: { true: "opacity-50" } },
} as const;

const fieldConfig = {
  slots: ["label"],
  variants: { invalid: { true: { label: "text-red-700", root: "border-2" } } },
} as const;

const chip: RecipeOf<typeof chipConfig, readonly [typeof pill]> =
  configured.cva({ ...chipConfig, composes: [pill] });
const tag: RecipeOf<typeof tagConfig, readonly [typeof chip]> = plainCva({
  ...tagConfig,
  composes: [chip],
});
const field: SlotRecipeOf<typeof fieldConfig, readonly [typeof look]> =
  configured.sva({ ...fieldConfig, composes: [look] });

export { chip, configured, field, tag };
