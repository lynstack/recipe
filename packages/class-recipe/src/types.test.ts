import { describe, expect, expectTypeOf, it } from "vitest";

import type { PropsOf, SlotClasses } from "./types.js";
import { createRecipe } from "./recipe.js";
import { createSlotRecipe } from "./slot-recipe.js";

const button = createRecipe({
  base: "rounded",
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600" },
    size: { sm: "h-8", md: "h-10" },
  },
  defaultVariants: { size: "md" },
});

const card = createSlotRecipe({
  slots: ["root", "title"],
  base: { root: "p-4", title: "font-medium" },
  variants: { size: { sm: { root: "p-2" }, md: { root: "p-4" } } },
});

describe("the props of a recipe", () => {
  it("are its variants and its className", () => {
    /** Passes the props of a component on to its recipe. */
    function buttonClassName(props: PropsOf<typeof button>): string {
      return button(props);
    }

    expect(buttonClassName({ tone: "danger", className: "w-full" })).toBe(
      "rounded bg-red-600 h-10 w-full",
    );
    expectTypeOf<PropsOf<typeof button>>().toEqualTypeOf<{
      readonly tone: "neutral" | "danger";
      readonly size?: "sm" | "md" | undefined;
      readonly className?: string | undefined;
    }>();
  });

  it("are the variants and the classNames of a slot recipe", () => {
    /** Passes the props of a component on to its slot recipe. */
    function cardClassNames(
      props: PropsOf<typeof card>,
    ): Readonly<Record<"root" | "title", string>> {
      return card(props);
    }

    expect(
      cardClassNames({ size: "sm", classNames: { title: "text-sm" } }),
    ).toStrictEqual({ root: "p-4 p-2", title: "font-medium text-sm" });
    expectTypeOf<PropsOf<typeof card>>().toEqualTypeOf<{
      readonly size: "sm" | "md";
      readonly classNames?: SlotClasses<"root" | "title"> | undefined;
    }>();
  });
});
