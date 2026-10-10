import {
  button,
  card,
  define,
  defineRecipe,
  defineSlotRecipe,
  defineComposed,
  defineComposedSlots,
  defineSlots,
  defineVariants,
  dialog,
  ds,
  withFooter,
} from "class-recipe-library";
import { configured, field, tag, toggle } from "class-recipe-library-isolated";

// Exporting a recipe would need the app to depend on @lynstack/class-recipe.
const linkButton = ds.cva({
  composes: [button],
  compoundVariants: [
    { className: "underline", variants: { size: "sm", variant: "link" } },
  ],
  variants: { variant: { link: "bg-transparent" } },
});
const sheet = ds.sva({
  composes: [dialog],
  slots: ["handle"],
  variants: { open: { true: { handle: "block", root: "translate-y-0" } } },
});
const pressable = configured.cva({
  composes: [tag],
  variants: { pressed: { true: "ring" } },
});
const combobox = configured.sva({
  composes: [field],
  slots: ["list"],
  variants: { open: { true: { list: "block" } } },
});
const switchToggle = ds.sva({
  composes: [toggle],
  slots: ["thumb"],
  variants: { size: { sm: { thumb: "size-3" } } },
});

const avatar = define({
  defaultVariants: { size: "md" },
  variants: { size: { md: "size-10", sm: "size-8" } },
});
const fab = defineComposed({
  composes: [button],
  variants: { size: { xl: "h-16" } },
});
const alert = defineSlots({
  slots: ["root", "icon"],
  variants: { tone: { danger: { icon: "text-red-700" } } },
});
const drawer = defineComposedSlots({
  composes: [card],
  slots: ["footer"],
  variants: { size: { sm: { footer: "gap-1" } } },
});
const footedDialog = withFooter(dialog);
const ghost = defineVariants({ ghost: { true: "bg-transparent" } });
const banner = defineRecipe({
  defaultVariants: { tone: "info" },
  variants: { tone: { info: "bg-blue-100", warn: "bg-amber-100" } },
});
const tabs = defineSlotRecipe({
  slots: ["list", "tab"],
  variants: { size: { sm: { tab: "px-2" } } },
});

const ghostClassName: string = ghost({ ghost: true });
const bannerClassName: string = banner({ tone: "warn" });
const tabsClassNames: Readonly<Record<"list" | "tab", string>> = tabs({
  size: "sm",
});
const linkClassName: string = linkButton({ size: "sm", variant: "link" });
const sheetClassNames: Readonly<
  Record<"body" | "footer" | "handle" | "root" | "title", string>
> = sheet({ open: true });
const pressableClassName: string = pressable({ pressed: true, tone: "danger" });
const comboboxClassNames: Readonly<Record<"label" | "list" | "root", string>> =
  combobox({ invalid: true, open: true });
const switchClassNames: Readonly<Record<"icon" | "root" | "thumb", string>> =
  switchToggle({ size: "sm" });
const avatarClassName: string = avatar({});
const fabClassName: string = fab({ size: "xl" });
const alertClassNames: Readonly<Record<"icon" | "root", string>> = alert({
  tone: "danger",
});
const drawerClassNames: Readonly<
  Record<"body" | "footer" | "root" | "title", string>
> = drawer({ size: "sm" });
const footedDialogClassNames: Readonly<
  Record<"body" | "footer" | "root" | "title", string>
> = footedDialog({ dense: true });

export {
  alertClassNames,
  bannerClassName,
  avatarClassName,
  comboboxClassNames,
  drawerClassNames,
  fabClassName,
  footedDialogClassNames,
  ghostClassName,
  linkClassName,
  pressableClassName,
  sheetClassNames,
  switchClassNames,
  tabsClassNames,
};
