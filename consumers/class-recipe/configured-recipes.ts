import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
import { cva as plainCva, sva as plainSva } from "@lynstack/class-recipe";

import { cva, cx, sva } from "./configured.js";

const pill = plainCva({
  base: "rounded-full px-4",
  defaultVariants: { size: "md" },
  variants: { size: { md: "px-3", sm: "px-2" } },
});

const chip = cva({
  base: "inline-flex px-4",
  composes: [pill],
  compoundVariants: [
    { className: "font-bold", variants: { size: "sm", tone: "danger" } },
  ],
  variants: { tone: { danger: "bg-red-100", neutral: "bg-gray-100" } },
});

const tag = plainCva({
  composes: [chip],
  defaultVariants: { tone: "neutral" },
  variants: { muted: { true: "opacity-50" } },
});

const look = plainSva({
  base: { root: "border" },
  slots: ["root"],
  variants: { size: { md: { root: "h-8" }, sm: { root: "h-6" } } },
});

const field = sva({
  composes: [look],
  slots: ["label"],
  variants: { invalid: { true: { label: "text-red-700", root: "border-2" } } },
});

const select = plainSva({
  composes: [field],
  defaultVariants: { size: "md" },
  slots: ["trigger"],
  variants: { open: { true: { trigger: "ring" } } },
});

type ChipProps = PropsOf<typeof chip>;
type TagVariants = VariantsOf<typeof tag>;

const chipClassName: string = chip({ size: "sm", tone: "danger" });
const tagClassName: string = tag({ muted: true });
const fieldClassNames: Readonly<Record<"label" | "root", string>> = field({
  invalid: true,
  size: "sm",
});
const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>> =
  select({ classNames: { trigger: "w-full" }, open: true });
const joined: string = cx("px-4", "px-2");

export {
  chip,
  chipClassName,
  field,
  fieldClassNames,
  joined,
  pill,
  look,
  select,
  selectClassNames,
  tag,
  tagClassName,
};
export type { ChipProps, TagVariants };
