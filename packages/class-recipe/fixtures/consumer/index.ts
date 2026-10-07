import {
  createRecipe,
  createRecipes,
  createSlotRecipe,
  cva,
  cx,
  sva,
} from "@lynstack/class-recipe";
import type { VariantsOf } from "@lynstack/class-recipe";

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

export {
  button,
  buttonDefaults,
  buttonKeys,
  buttonOptions,
  card,
  cardKeys,
  cardOptions,
  className,
  field,
  iconButton,
  iconClassName,
  merged,
  pill,
  select,
  selectClassNames,
};
export type { ButtonVariants };
