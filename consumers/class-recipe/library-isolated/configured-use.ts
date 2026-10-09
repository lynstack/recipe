import type { PropsOf, RecipeOf, SlotRecipeOf } from "@lynstack/class-recipe";
import { sva } from "@lynstack/class-recipe";

import { chip, configured, field, tag } from "./configured.js";

type ChipProps = PropsOf<typeof chip>;

const labelConfig = {
  base: "text-sm",
  variants: { tone: { danger: "text-red-700" } },
} as const;

const label: RecipeOf<typeof labelConfig, readonly [typeof tag]> =
  configured.cva({ ...labelConfig, composes: [tag] });

const selectConfig = {
  slots: ["trigger"],
  variants: { open: { true: { trigger: "ring" } } },
} as const;

const select: SlotRecipeOf<typeof selectConfig, readonly [typeof field]> = sva({
  ...selectConfig,
  composes: [field],
});

const chipProps: ChipProps = { tone: "danger" };
const chipClassName: string = chip(chipProps);
const labelClassName: string = label({ muted: true, tone: "danger" });
const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>> =
  select({ invalid: true, open: true });

export { chipClassName, label, labelClassName, select, selectClassNames };
export type { ChipProps };
