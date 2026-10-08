import { describe, expect, expectTypeOf, it } from "vitest";

import type { SlotClassNames, SlotClasses } from "./types.js";
import { createSlotRecipe, sva } from "./slot-recipe.js";

const card = createSlotRecipe({
  slots: ["root", "title"],
  base: { root: "rounded-md", title: "text-label" },
  variants: {
    tone: {
      neutral: { root: "bg-surface" },
      danger: { root: "bg-danger", title: "text-on-danger" },
    },
    size: {
      md: { root: "p-4" },
      sm: { root: "p-2", title: "text-sm" },
    },
  },
  defaultVariants: { size: "md" },
});

/** Adds the same classes to every call of a slot recipe. */
function withClassNames<const Slot extends string>(
  recipe: (props: {
    readonly classNames?: SlotClasses<Slot> | undefined;
  }) => SlotClassNames<Slot>,
  classNames: SlotClasses<Slot>,
): SlotClassNames<Slot> {
  return recipe({ classNames });
}

describe("the classNames of a slot recipe", () => {
  it("accept overrides declared before the call", () => {
    const overrides = { title: "uppercase" };
    const typed: SlotClasses<"root" | "title"> = { root: "w-full" };
    const misspelled = { titel: "uppercase" };

    expect(card({ classNames: overrides, tone: "neutral" })).toStrictEqual({
      root: "rounded-md bg-surface p-4",
      title: "text-label uppercase",
    });
    expect(card({ classNames: typed, tone: "neutral" })).toStrictEqual({
      root: "rounded-md bg-surface p-4 w-full",
      title: "text-label",
    });
    expect(
      // @ts-expect-error: titel is not a slot of card.
      card({ classNames: misspelled, tone: "neutral" }),
    ).toStrictEqual({ root: "rounded-md bg-surface p-4", title: "text-label" });
  });

  it("pass through a function of the user's that is generic over the slots", () => {
    const field = sva({
      base: { input: "border", label: "text-sm" },
      slots: ["label", "input"],
      variants: { invalid: { true: { input: "border-red-600" } } },
    });
    const classNames = withClassNames(field, { label: "font-bold" });

    expectTypeOf(classNames).toEqualTypeOf<SlotClassNames<"input" | "label">>();
    expect(classNames).toStrictEqual({
      input: "border",
      label: "text-sm font-bold",
    });
    expect(
      // @ts-expect-error: lable is not a slot of field.
      withClassNames(field, { lable: "font-bold" }),
    ).toStrictEqual({ input: "border", label: "text-sm" });
  });

  it("name the slots of every level of a chain of compositions", () => {
    const level0 = sva({
      slots: ["root"],
      variants: { size: { md: { root: "h-8" }, sm: { root: "h-6" } } },
    });
    const level1 = sva({
      composes: [level0],
      slots: ["icon"],
      variants: { tone: { danger: { icon: "text-red-700" } } },
    });
    const level2 = sva({
      composes: [level1],
      slots: ["label"],
      variants: { weight: { bold: { label: "font-bold" } } },
    });
    const level3 = sva({
      composes: [level2],
      slots: ["badge"],
      variants: { shape: { round: { badge: "rounded-full" } } },
    });
    const level4 = sva({
      composes: [level3],
      slots: ["hint"],
      variants: { muted: { true: { hint: "opacity-50" } } },
    });
    const overrides = { hint: "italic", root: "w-full" };
    const selection = {
      shape: "round",
      size: "sm",
      tone: "danger",
      weight: "bold",
    } as const;

    expectTypeOf<
      NonNullable<Parameters<typeof level4>[0]["classNames"]>
    >().toEqualTypeOf<
      SlotClasses<"badge" | "hint" | "icon" | "label" | "root">
    >();
    expect(level4({ ...selection, classNames: overrides })).toStrictEqual({
      badge: "rounded-full",
      hint: "italic",
      icon: "text-red-700",
      label: "font-bold",
      root: "h-6 w-full",
    });
    expect(
      // @ts-expect-error: footer is not a slot of level4.
      level4({ ...selection, classNames: { footer: "p-2" } }),
    ).toStrictEqual(level4(selection));
  });
});

describe("a slot recipe whose slots are declared without as const", () => {
  it("takes any string as a slot name", () => {
    const slots = ["root", "title"];
    const wide = sva({
      base: { body: "p-4" },
      slots,
      variants: { size: { sm: { root: "p-2", titel: "text-sm" } } },
    });
    const classNames = wide({ classNames: { footer: "w-full" }, size: "sm" });

    expectTypeOf(slots).toEqualTypeOf<string[]>();
    expectTypeOf(classNames).toEqualTypeOf<SlotClassNames<string>>();
    expectTypeOf<Parameters<typeof wide>[0]>().toEqualTypeOf<{
      readonly size: "sm";
      readonly classNames?: SlotClasses<string> | undefined;
    }>();
    expectTypeOf(classNames["titel"]).toEqualTypeOf<string | undefined>();
    expect(classNames).toStrictEqual({ root: "p-2", title: "" });
  });
});
