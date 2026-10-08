import type { SlotClasses } from "@lynstack/class-recipe";
/** Adds the same classes to every call of a slot recipe. */
declare function withClassNames<const Slot extends string>(recipe: (props: {
    readonly classNames?: SlotClasses<Slot> | undefined;
}) => Readonly<Record<Slot, string>>, classNames: SlotClasses<Slot>): Readonly<Record<Slot, string>>;
declare const hintClassNames: Readonly<Record<"badge" | "hint" | "icon" | "label" | "root", string>>;
declare const badgeClassNames: Readonly<Record<"badge" | "hint" | "icon" | "label" | "root", string>>;
/** The class names of the deepest level, with the classes of a caller. */
declare function levelClassNames(classNames: SlotClasses<"badge" | "hint" | "icon" | "label" | "root">): Readonly<Record<"badge" | "hint" | "icon" | "label" | "root", string>>;
export { badgeClassNames, hintClassNames, levelClassNames, withClassNames };
