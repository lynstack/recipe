import type { PropsOf, VariantsOf } from "@lynstack/class-recipe";
import {
  createRecipe,
  createRecipes,
  createSlotRecipe,
  cva,
  cx,
  sva,
} from "@lynstack/class-recipe";

import {
  define,
  defineComposed,
  defineComposedSlots,
  defineSlots,
} from "./define.js";
import { look } from "./look.js";

const button = createRecipe({
  base: "inline-flex",
  compoundVariants: [
    { className: "font-bold", variants: { size: "lg", tone: "danger" } },
  ],
  defaultVariants: { size: "md" },
  variants: {
    disabled: { true: "opacity-50" },
    size: { lg: "h-12", md: "h-10" },
    tone: { danger: "bg-red-600", neutral: "bg-gray-100" },
  },
});

type ButtonVariants = VariantsOf<typeof button>;
type ButtonProps = PropsOf<typeof button>;

const card = createSlotRecipe({
  slots: ["root", "title"],
  variants: { size: { md: { root: "p-4", title: "text-base" } } },
});

const pill = cva({
  base: "rounded-full",
  variants: { tone: { danger: "bg-red-100", neutral: "bg-gray-100" } },
});

const field = sva({
  slots: ["label", "input"],
  variants: { invalid: { true: { input: "border-red-600" } } },
});

const merged = createRecipes({
  join: (...classNames) => cx(classNames),
});

const iconButton = cva({
  composes: [button],
  compoundVariants: [
    { className: "rounded-full", variants: { shape: "round", size: "lg" } },
  ],
  variants: { shape: { round: "aspect-square" } },
});

const select = sva({
  base: { trigger: "h-10" },
  composes: [field],
  slots: ["trigger"],
  variants: { invalid: { true: { label: "text-red-700" } } },
});

const badge = define({
  defaultVariants: { tone: "neutral" },
  variants: { tone: { danger: "bg-red-100", neutral: "bg-gray-100" } },
});
const badgeClassName: string = badge({});
const compactButton = defineComposed({
  composes: [button],
  variants: { size: { xs: "h-6" } },
});
const compactButtonClassName: string = compactButton({
  size: "xs",
  tone: "neutral",
});
const alert = defineSlots({
  slots: ["root", "title"],
  variants: { tone: { danger: { root: "bg-red-100" } } },
});
const alertClassNames: Readonly<Record<"root" | "title", string>> = alert({
  tone: "danger",
});

const toggle = sva({
  composes: [look],
  defaultVariants: { size: "md" },
  slots: ["icon"],
  variants: { pressed: { true: { icon: "opacity-100" } } },
});

const toggleClassNames = toggle({ pressed: true });
const toggleRoot: string = toggleClassNames.root;

const iconClassName: string = iconButton({ shape: "round", tone: "danger" });
const selectClassNames: Readonly<
  Record<"input" | "label" | "trigger", string>
> = select({ invalid: true });
const className: string = button({ tone: "danger" });
const buttonKeys: readonly ("disabled" | "size" | "tone")[] =
  button.variantKeys;
const cardKeys: readonly "size"[] = card.variantKeys;
const buttonOptions: { readonly size: readonly ("lg" | "md")[] } =
  button.variantOptions;
const buttonDefaults: { readonly disabled: "false" | "true" } =
  button.defaultVariants;
const cardOptions: { readonly size: readonly "md"[] } = card.variantOptions;
const buttonProps: ButtonProps = { className: "w-full", tone: "danger" };
const cardProps: PropsOf<typeof card> = {
  classNames: { title: "text-sm" },
  size: "md",
};

const panel = defineComposedSlots({
  composes: [card],
  slots: ["footer"],
  variants: { size: { sm: { footer: "gap-2" } } },
});
const panelClassNames: Readonly<Record<"root" | "title" | "footer", string>> =
  panel({ size: "sm" });

export {
  alert,
  alertClassNames,
  badge,
  badgeClassName,
  button,
  buttonDefaults,
  buttonProps,
  buttonKeys,
  buttonOptions,
  card,
  cardKeys,
  cardOptions,
  cardProps,
  className,
  compactButton,
  compactButtonClassName,
  field,
  iconButton,
  iconClassName,
  merged,
  panel,
  panelClassNames,
  pill,
  select,
  selectClassNames,
  toggle,
  toggleClassNames,
  toggleRoot,
};
export type { ButtonProps, ButtonVariants };
