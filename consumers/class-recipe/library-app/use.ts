import type { PropsOf, VariantsOf } from "class-recipe-library";
import { badge, button, card, dialog, iconButton } from "class-recipe-library";
import { chip, label, select, toggle } from "class-recipe-library-isolated";

type ButtonProps = PropsOf<typeof button>;
type CardVariants = VariantsOf<typeof card>;

const buttonProps: ButtonProps = { className: "w-full", tone: "danger" };
const buttonClassName: string = button(buttonProps);
const buttonKeys: readonly ("disabled" | "size" | "tone")[] =
  button.variantKeys;
const buttonOptions: { readonly size: readonly ("lg" | "md" | "sm")[] } =
  button.variantOptions;
const buttonDefaults: {
  readonly size: "lg" | "md" | "sm";
  readonly tone: "danger" | "neutral";
} = button.defaultVariants;
const iconButtonClassName: string = iconButton({ shape: "round", size: "sm" });
const badgeClassName: string = badge({ tone: "danger" });

const cardVariants: CardVariants = { raised: true, size: "lg" };
const cardClassNames: Readonly<Record<"body" | "root" | "title", string>> =
  card({ ...cardVariants, classNames: { body: "grid" } });
const dialogClassNames: Readonly<
  Record<"body" | "footer" | "root" | "title", string>
> = dialog({ raised: true, size: "sm" });

const chipClassName: string = chip({ size: "sm", tone: "danger" });
const labelClassName: string = label({ muted: true, tone: "danger" });
const selectClassNames: Readonly<Record<"label" | "root" | "trigger", string>> =
  select({ invalid: true, open: true });
const toggleClassNames: Readonly<Record<"icon" | "root", string>> = toggle({
  pressed: true,
});

export {
  badgeClassName,
  buttonClassName,
  buttonDefaults,
  buttonKeys,
  buttonOptions,
  buttonProps,
  cardClassNames,
  cardVariants,
  chipClassName,
  dialogClassNames,
  iconButtonClassName,
  labelClassName,
  selectClassNames,
  toggleClassNames,
};
export type { ButtonProps, CardVariants };
