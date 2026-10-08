import type { SlotClasses } from "@lynstack/class-recipe";

import { level4 } from "./chain.js";

/** Adds the same classes to every call of a slot recipe. */
function withClassNames<const Slot extends string>(
  recipe: (props: {
    readonly classNames?: SlotClasses<Slot> | undefined;
  }) => Readonly<Record<Slot, string>>,
  classNames: SlotClasses<Slot>,
): Readonly<Record<Slot, string>> {
  return recipe({ classNames });
}

const overrides = { hint: "italic", root: "w-full" };
const typed: SlotClasses<"badge" | "label"> = { badge: "ml-2" };
const selection = {
  shape: "round",
  size: "sm",
  tone: "danger",
  weight: "bold",
} as const;

const hintClassNames: Readonly<
  Record<"badge" | "hint" | "icon" | "label" | "root", string>
> = level4({ ...selection, classNames: overrides });
const badgeClassNames: Readonly<
  Record<"badge" | "hint" | "icon" | "label" | "root", string>
> = level4({ ...selection, classNames: typed });

/** The class names of the deepest level, with the classes of a caller. */
function levelClassNames(
  classNames: SlotClasses<"badge" | "hint" | "icon" | "label" | "root">,
): Readonly<Record<"badge" | "hint" | "icon" | "label" | "root", string>> {
  return withClassNames(
    (props) => level4({ ...selection, ...props }),
    classNames,
  );
}

export { badgeClassNames, hintClassNames, levelClassNames, withClassNames };
