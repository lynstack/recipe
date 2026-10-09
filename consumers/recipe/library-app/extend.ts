import type { Style } from "recipe-library";
import {
  card,
  classRecipe,
  define,
  defineComposed,
  defineComposedSlots,
  defineSlots,
  dialog,
  link,
  slotStyleRecipe,
  styleRecipe,
  text,
  withFooter,
} from "recipe-library";
import {
  card as isolatedCard,
  heading as isolatedHeading,
  styleRecipe as isolatedStyleRecipe,
} from "recipe-library-isolated";

// Exporting a recipe would need the app to depend on @lynstack/recipe.
const caption = styleRecipe({
  composes: [text],
  variants: { italic: { true: { fontStyle: "italic" } } },
});
const sheet = slotStyleRecipe({
  composes: [dialog],
  slots: ["handle"],
  variants: { open: { true: { handle: { height: 4 }, root: { top: 0 } } } },
});
const navLink = classRecipe({
  composes: [link],
  variants: { active: { true: "font-bold" } },
});
const display = isolatedStyleRecipe({
  composes: [isolatedHeading],
  variants: { tracking: { tight: { letterSpacing: -1 } } },
});
const panel = slotStyleRecipe({
  composes: [isolatedCard],
  slots: ["body"],
  variants: { tone: { dark: { body: { color: "white" } } } },
});

const badge = define({
  defaultVariants: { tone: "neutral" },
  variants: { tone: { danger: { color: "red" }, neutral: { color: "gray" } } },
});
const label = defineComposed({
  composes: [text],
  variants: { size: { xs: { fontSize: 10 } } },
});
const field = defineSlots({
  slots: ["input", "label"],
  variants: { invalid: { true: { input: { borderColor: "red" } } } },
});
const drawer = defineComposedSlots({
  composes: [card],
  slots: ["footer"],
  variants: { tone: { dark: { footer: { borderColor: "white" } } } },
});
const footedDialog = withFooter(dialog);

const captionStyle: Style = caption({ italic: true, size: "sm" });
const sheetStyles: Readonly<
  Record<"footer" | "handle" | "root" | "title", Style>
> = sheet({ open: true });
const navLinkClassName: string = navLink({ active: true, tone: "primary" });
const displayStyle: Style = display({ size: "xl", tracking: "tight" });
const panelStyles: Readonly<Record<"body" | "root" | "title", Style>> = panel({
  tone: "dark",
});
const badgeStyle: Style = badge({});
const labelStyle: Style = label({ size: "xs" });
const fieldStyles: Readonly<Record<"input" | "label", Style>> = field({
  invalid: true,
});
const drawerStyles: Readonly<Record<"footer" | "root" | "title", Style>> =
  drawer({ tone: "dark" });
const footedDialogStyles: Readonly<Record<"footer" | "root" | "title", Style>> =
  footedDialog({ dense: true });

export {
  badgeStyle,
  captionStyle,
  displayStyle,
  drawerStyles,
  fieldStyles,
  footedDialogStyles,
  labelStyle,
  navLinkClassName,
  panelStyles,
  sheetStyles,
};
