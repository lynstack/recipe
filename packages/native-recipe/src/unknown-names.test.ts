import { describe, expect, it, vi } from "vitest";

import { createStyleRecipe } from "./style-recipe.js";
import { createThemedRecipes } from "./themed-recipes.js";

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

interface Theme {
  readonly gap: number;
}

describe("a config declared before the call", () => {
  it("warns about a compound variant that names an undeclared variant", () => {
    const boxConfig = {
      compoundVariants: [
        {
          style: { borderWidth: 2 },
          variants: { size: "sm", tonne: "danger" },
        },
      ],
      variants: {
        size: { md: { padding: 8 }, sm: { padding: 4 } },
        tone: { danger: { opacity: 1 }, neutral: { opacity: 0.6 } },
      },
    } as const;

    expect(warningsOf(() => createStyleRecipe(boxConfig))).toStrictEqual([
      `${heading}\n- Compound variant 0 names the variant "tonne".`,
    ]);
    expect(
      createStyleRecipe(boxConfig)({ size: "sm", tone: "danger" }),
    ).toStrictEqual({ opacity: 1, padding: 4 });
  });
});

describe("a themed recipe", () => {
  it("warns once, whatever the number of themes", () => {
    const { createStyleRecipe: createThemedStyleRecipe } =
      createThemedRecipes<Theme>();
    const chip = createThemedStyleRecipe((theme) => ({
      compoundVariants: [
        { style: { borderWidth: 1 }, variants: { dense: true, sise: "sm" } },
      ],
      variants: {
        dense: { true: { padding: theme.gap } },
        size: { sm: { height: 24 } },
      },
    }));

    expect(
      warningsOf(() => [
        chip({ gap: 4 }, { size: "sm" }),
        chip({ gap: 8 }, { size: "sm" }),
      ]),
    ).toStrictEqual([
      `${heading}\n- Compound variant 0 names the variant "sise".`,
    ]);
  });
});
