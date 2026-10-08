import { describe, expect, expectTypeOf, it } from "vitest";

import type { PropsOf, SlotClasses, SlotRecipeProps } from "./types.js";
import type {
  Recipe,
  RecipeConfig,
  RecipeProps,
  RecipeVariants,
} from "./recipe.js";
import type {
  SlotRecipe,
  SlotRecipeConfig,
  SlotRecipeVariants,
} from "./slot-recipe.js";
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

/** Creates a recipe from any config, as a library's own helper does. */
function defineRecipe<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: RecipeConfig<Variants, DefaultedName>,
): Recipe<RecipeProps<Variants, DefaultedName>> {
  return createRecipe(config);
}

/** Creates a slot recipe from any config, as a library's own helper does. */
function defineSlotRecipe<
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: SlotRecipeConfig<Slot, Variants, DefaultedName>,
): SlotRecipe<Slot, SlotRecipeProps<Slot, Variants, DefaultedName>> {
  return createSlotRecipe(config);
}

describe("a function generic over a config", () => {
  it("returns the recipe of its config as a Recipe", () => {
    const badge = defineRecipe({
      variants: { tone: { neutral: "bg-gray-100", danger: "bg-red-600" } },
      defaultVariants: { tone: "neutral" },
    });

    expect(badge({})).toBe("bg-gray-100");
    expectTypeOf<PropsOf<typeof badge>>().toEqualTypeOf<{
      readonly tone?: "neutral" | "danger" | undefined;
      readonly className?: string | undefined;
    }>();
  });

  it("returns the slot recipe of its config as a SlotRecipe", () => {
    const field = defineSlotRecipe({
      slots: ["label", "input"],
      variants: { invalid: { true: { input: "border-red-600" } } },
    });

    expect(field({ invalid: true })).toStrictEqual({
      label: "",
      input: "border-red-600",
    });
    expectTypeOf<PropsOf<typeof field>>().toEqualTypeOf<{
      readonly invalid?: boolean | "true" | "false" | undefined;
      readonly classNames?: SlotClasses<"label" | "input"> | undefined;
    }>();
  });
});
