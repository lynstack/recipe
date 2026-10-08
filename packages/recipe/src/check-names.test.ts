import { describe, expect, it, vi } from "vitest";

import { createRecipeKind } from "./recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

const listKind = {
  finish: (list: readonly string[]): string => list.join(" "),
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
};

const listRecipe = createRecipeKind(listKind);
const listSlotRecipe = createSlotRecipeKind(listKind);

const heading =
  "A recipe's config names variants, options, or slots that it does not declare, so they add nothing:";

/** Returns what `create` warns about, without printing it. */
function warningsOf(create: () => unknown): readonly string[] {
  const messages: string[] = [];
  const warn = vi
    .spyOn(console, "warn")
    .mockImplementation((message: unknown) => {
      messages.push(String(message));
    });
  try {
    create();
  } finally {
    warn.mockRestore();
  }
  return messages;
}

describe("a recipe whose config names what it does not declare", () => {
  it("warns about a compound variant's undeclared variant, which never matches", () => {
    const config = {
      compoundVariants: [
        { value: "c", variants: { size: "sm", tonne: "danger" } },
      ],
      variants: {
        size: { sm: "s" },
        tone: { danger: "d", neutral: "n" },
      },
    } as const;

    expect(warningsOf(() => listRecipe(config))).toStrictEqual([
      `${heading}\n- Compound variant 0 names the variant "tonne".`,
    ]);
    expect(listRecipe(config)({ size: "sm", tone: "danger" })).toBe("s d");
  });

  it("warns about a compound variant's undeclared option, and matches its declared ones", () => {
    const config = {
      compoundVariants: [{ value: "c", variants: { size: ["sm", "xl"] } }],
      variants: { size: { lg: "l", sm: "s" } },
    } as const;

    // @ts-expect-error: xl is not an option of size.
    const badge = (): unknown => listRecipe(config);

    expect(warningsOf(badge)).toStrictEqual([
      `${heading}\n- Compound variant 0 names the option "xl" of "size".`,
    ]);
    // @ts-expect-error: xl is not an option of size.
    expect(listRecipe(config)({ size: "sm" })).toBe("s c");
  });

  it("warns about a default of an undeclared variant or option", () => {
    const config = {
      defaultVariants: { size: "xl", tonne: "danger" },
      variants: { size: { sm: "s" }, tone: { danger: "d" } },
    } as const;

    // @ts-expect-error: the defaults name undeclared names.
    const badge = (): unknown => listRecipe(config);

    expect(warningsOf(badge)).toStrictEqual([
      `${heading}\n- \`defaultVariants\` gives "size" the option "xl".\n- \`defaultVariants\` names the variant "tonne".`,
    ]);
    expect(
      // @ts-expect-error: the defaults name undeclared names.
      listRecipe(config)({ tone: "danger" }),
    ).toBe("d");
  });

  it("warns once for the same config", () => {
    const config = {
      compoundVariants: [{ value: "c", variants: { shape: "round", sise: 1 } }],
      variants: { shape: { round: "r" }, size: { 1: "one" } },
    } as const;

    expect(
      warningsOf(() => [listRecipe(config), listRecipe(config)]),
    ).toStrictEqual([
      `${heading}\n- Compound variant 0 names the variant "sise".`,
    ]);
  });
});

describe("a slot recipe whose config names what it does not declare", () => {
  it("warns about values for undeclared slots, and leaves them out", () => {
    const config = {
      base: { lable: "b", root: "r" },
      compoundVariants: [
        { value: { icon: "i", root: "c" }, variants: { size: "sm" } },
      ],
      slots: ["root", "label"],
      variants: { size: { sm: { label: "l", roots: "s" } } },
    } as const;

    // @ts-expect-error: roots is not a slot.
    const field = (): unknown => listSlotRecipe(config);

    expect(warningsOf(field)).toStrictEqual([
      `${heading}\n- \`base\` gives a value to the slot "lable".\n- The option "sm" of "size" gives a value to the slot "roots".\n- Compound variant 0 gives a value to the slot "icon".`,
    ]);
    expect(
      // @ts-expect-error: roots is not a slot.
      listSlotRecipe(config)({ size: "sm" }),
    ).toStrictEqual({ label: "l", root: "r c" });
  });
});

describe("a config that names only what it declares", () => {
  it("does not warn about boolean and number options", () => {
    const config = {
      compoundVariants: [
        { value: "c", variants: { disabled: false, level: [1, "2"] } },
      ],
      defaultVariants: { disabled: false, level: 1 },
      variants: {
        disabled: { true: "d" },
        level: { 1: "one", 2: "two" },
      },
    } as const;

    expect(warningsOf(() => listRecipe(config))).toStrictEqual([]);
    expect(listRecipe(config)()).toBe("one c");
  });

  it("does not warn about a condition on undefined", () => {
    const config = {
      compoundVariants: [{ value: "c", variants: { size: undefined } }],
      variants: { size: { sm: "s" } },
    } as const;

    expect(warningsOf(() => listRecipe(config))).toStrictEqual([]);
    expect(listRecipe(config)({ size: "sm" })).toBe("s c");
  });

  it("does not warn about the variants and slots of the recipes it composes", () => {
    const base = listRecipe({ variants: { tone: { danger: "d" } } });
    const card = listSlotRecipe({
      slots: ["root"],
      variants: { tone: { danger: { root: "d" } } },
    });
    const badge = (): unknown =>
      listRecipe({
        composes: [base],
        compoundVariants: [
          { value: "c", variants: { size: "sm", tone: "danger" } },
        ],
        defaultVariants: { tone: "danger" },
        variants: { size: { sm: "s" } },
      });
    const dialog = (): unknown =>
      listSlotRecipe({
        base: { root: "r" },
        composes: [card],
        compoundVariants: [
          { value: { footer: "c", root: "c" }, variants: { tone: "danger" } },
        ],
        slots: ["footer"],
        variants: {},
      });

    expect(warningsOf(() => [badge(), dialog()])).toStrictEqual([]);
  });

  it("does not warn about a variant or slot named like a property of Object.prototype", () => {
    const config = {
      base: { constructor: "b" },
      compoundVariants: [
        { value: { constructor: "c" }, variants: { toString: "on" } },
      ],
      defaultVariants: { toString: "on" },
      slots: ["constructor"],
      variants: { toString: { on: { constructor: "t" } } },
    } as const;

    expect(warningsOf(() => listSlotRecipe(config))).toStrictEqual([]);
    expect(listSlotRecipe(config)()).toStrictEqual({ constructor: "b t c" });
  });
});
