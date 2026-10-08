import { describe, expect, it, vi } from "vitest";

import { cva } from "./recipe.js";
import { sva } from "./slot-recipe.js";

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

describe("a config declared before the call", () => {
  it("warns about a compound variant that names an undeclared variant", () => {
    const buttonConfig = {
      compoundVariants: [
        { className: "font-bold", variants: { size: "sm", tonne: "danger" } },
      ],
      variants: {
        size: { md: "h-10", sm: "h-8" },
        tone: { danger: "bg-red-600", neutral: "bg-gray-100" },
      },
    } as const;

    expect(warningsOf(() => cva(buttonConfig))).toStrictEqual([
      `${heading}\n- Compound variant 0 names the variant "tonne".`,
    ]);
    expect(cva(buttonConfig)({ size: "sm", tone: "danger" })).toBe(
      "h-8 bg-red-600",
    );
  });

  it("warns about classes for slots that slots does not name", () => {
    const fieldConfig = {
      base: { lable: "text-sm", root: "flex" },
      compoundVariants: [
        {
          classNames: { lable: "font-bold", root: "gap-2" },
          variants: { size: "sm" },
        },
      ],
      slots: ["root", "label"],
      variants: { size: { sm: { label: "text-xs" } } },
    } as const;

    expect(warningsOf(() => sva(fieldConfig))).toStrictEqual([
      `${heading}\n- \`base\` gives a value to the slot "lable".\n- Compound variant 0 gives a value to the slot "lable".`,
    ]);
    expect(sva(fieldConfig)({ size: "sm" })).toStrictEqual({
      label: "text-xs",
      root: "flex gap-2",
    });
  });

  it("does not warn when it names only what it declares", () => {
    const badgeConfig = {
      compoundVariants: [
        { className: "ring", variants: { outlined: true, tone: "danger" } },
      ],
      defaultVariants: { tone: "neutral" },
      variants: {
        outlined: { true: "border" },
        tone: { danger: "bg-red-600", neutral: "bg-gray-100" },
      },
    } as const;

    expect(warningsOf(() => cva(badgeConfig))).toStrictEqual([]);
  });
});
