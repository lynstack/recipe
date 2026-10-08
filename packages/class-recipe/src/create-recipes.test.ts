import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  CreateRecipe,
  Recipe,
  RecipeConfig,
  RecipeProps,
  RecipeVariants,
} from "./recipe.js";
import type { PropsOf, SlotClasses, VariantsOf } from "./types.js";
import { createRecipe, cva } from "./recipe.js";
import { createSlotRecipe, sva } from "./slot-recipe.js";
import type { ClassJoin } from "./join.js";
import type { CreateSlotRecipe } from "./slot-recipe.js";
import type { RecipeOf } from "./recipe-of.js";
import type { Recipes } from "./create-recipes.js";
import { createRecipes } from "./create-recipes.js";
import { cx } from "./cx.js";

function keepLastOfEachPrefix(...classNames: readonly string[]): string {
  const byPrefix = new Map<string, string>();
  for (const className of classNames.join(" ").split(" ")) {
    const [prefix = className] = className.split("-");
    byPrefix.delete(prefix);
    byPrefix.set(prefix, className);
  }
  return [...byPrefix.values()].join(" ");
}

const merged = createRecipes({ join: keepLastOfEachPrefix });

describe(createRecipes, () => {
  it("returns the default functions without a join function", () => {
    expect(createRecipes()).toStrictEqual({
      cx,
      createRecipe,
      createSlotRecipe,
      cva,
      sva,
    });
    expect(createRecipes({ join: cx })).toStrictEqual({
      cx,
      createRecipe,
      createSlotRecipe,
      cva,
      sva,
    });
    expect(createRecipes({ cache: true })).toStrictEqual({
      cx,
      createRecipe,
      createSlotRecipe,
      cva,
      sva,
    });
  });

  it("returns cva and sva as the configured recipe creators", () => {
    expect(merged.cva).toBe(merged.createRecipe);
    expect(merged.sva).toBe(merged.createSlotRecipe);

    const button = merged.cva({
      base: "px-4 py-2",
      variants: { size: { sm: "px-2" } },
    });
    const card = merged.sva({
      slots: ["root"],
      base: { root: "p-4" },
      variants: { size: { sm: { root: "p-2" } } },
    });

    expect(button({ size: "sm" })).toBe("py-2 px-2");
    expect(card({ size: "sm" })).toStrictEqual({ root: "p-2" });
  });

  it("keeps the default cx without the cache", () => {
    expect(createRecipes({ cache: false }).cx).toBe(cx);
  });

  it("builds a recipe's class name on every call without the cache", () => {
    const calls: (readonly string[])[] = [];
    const join: ClassJoin = (...classNames) => {
      calls.push(classNames);
      return classNames.join(" ");
    };
    const button = createRecipes({ cache: false, join }).createRecipe({
      base: "rounded-md",
      variants: { size: { sm: "h-8", md: "h-10" } },
    });

    expect(button({ size: "sm" })).toBe("rounded-md h-8");
    expect(button({ size: "sm" })).toBe("rounded-md h-8");
    expect(calls).toStrictEqual([
      ["rounded-md", "h-8"],
      ["rounded-md", "h-8"],
    ]);
  });

  it("returns a new slot recipe object on every call without the cache", () => {
    const card = createRecipes({ cache: false }).createSlotRecipe({
      slots: ["root", "title"],
      base: { root: "p-4" },
      variants: { size: { sm: { title: "text-sm" } } },
    });

    const first = card({ size: "sm" });
    const second = card({ size: "sm" });
    expect(first).toStrictEqual({ root: "p-4", title: "text-sm" });
    expect(second).toStrictEqual(first);
    expect(second).not.toBe(first);
  });

  it("lists the variant names of configured recipes", () => {
    const configured = createRecipes({
      cache: false,
      join: keepLastOfEachPrefix,
    });
    const button = configured.cva({
      variants: { size: { sm: "h-8" }, tone: {} },
    });
    const card = configured.sva({ slots: ["root"], variants: { size: {} } });

    expect(button.variantKeys).toStrictEqual(["size", "tone"]);
    expect(button.variantOptions).toStrictEqual({ size: ["sm"], tone: [] });
    expect(card.variantKeys).toStrictEqual(["size"]);
    expect(card.variantOptions).toStrictEqual({ size: [] });
  });

  it("resolves conflicts without the cache", () => {
    const button = createRecipes({
      cache: false,
      join: keepLastOfEachPrefix,
    }).createRecipe({
      base: "px-4 py-2",
      variants: { size: { sm: "px-2" } },
    });

    expect(button({ size: "sm" })).toBe("py-2 px-2");
  });

  it("rejects a cache setting that is not a boolean", () => {
    // @ts-expect-error cache must be a boolean
    const recipes = createRecipes({ cache: "no" });

    expect(recipes.createRecipe).toBe(createRecipe);
  });

  it("passes cx's result through the join function", () => {
    expect(merged.cx("p-2", { "p-4": true }, ["text-sm", "text-lg"])).toBe(
      "p-4 text-lg",
    );
  });

  it("resolves conflicts between a recipe's classes", () => {
    const button = merged.createRecipe({
      base: "px-4 py-2",
      variants: { size: { sm: "px-2", md: "" } },
      compoundVariants: [{ variants: { size: "sm" }, className: "py-1" }],
    });

    expect(button({ size: "sm" })).toBe("px-2 py-1");
    expect(button({ size: "md" })).toBe("px-4 py-2");
  });

  it("resolves conflicts with className", () => {
    const button = merged.createRecipe({
      base: "rounded-md bg-gray-100",
      variants: { tone: { danger: "bg-red-600" } },
    });

    expect(button({ tone: "danger", className: "bg-blue-600" })).toBe(
      "rounded-md bg-blue-600",
    );
  });

  it("resolves conflicts in each slot", () => {
    const card = merged.createSlotRecipe({
      slots: ["root", "title"],
      base: { root: "p-4", title: "text-base" },
      variants: { size: { sm: { root: "p-2", title: "text-sm" } } },
    });

    expect(
      card({ size: "sm", classNames: { title: "text-lg" } }),
    ).toStrictEqual({
      root: "p-2",
      title: "text-lg",
    });
  });
});

const configured = createRecipes({ cache: false, join: keepLastOfEachPrefix });

/** Creates a recipe with the configured creator, as a library does. */
function define<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof Variants = never,
>(
  config: RecipeConfig<Variants, DefaultedName>,
): Recipe<RecipeProps<Variants, DefaultedName>> {
  return configured.cva(config);
}

describe("the types of configured recipes", () => {
  it("are the types of the default creators", () => {
    expectTypeOf(merged.cva).toEqualTypeOf(cva);
    expectTypeOf(merged.sva).toEqualTypeOf(sva);
    expectTypeOf(configured.createRecipe).toEqualTypeOf(createRecipe);
    expectTypeOf(configured.createSlotRecipe).toEqualTypeOf(createSlotRecipe);
    expectTypeOf(configured.cx).toEqualTypeOf(cx);
    expectTypeOf<Recipes["cva"]>().toEqualTypeOf<CreateRecipe>();
    expectTypeOf<Recipes["sva"]>().toEqualTypeOf<CreateSlotRecipe>();

    expect(configured.cx("px-4", "px-2")).toBe("px-2");
  });

  it("type a recipe as the default creators do", () => {
    const config = {
      base: "px-4",
      defaultVariants: { size: "md" },
      variants: { size: { md: "px-3", sm: "px-2" } },
    } as const;
    const button = configured.cva(config);
    const card = configured.sva({
      slots: ["root", "title"],
      variants: { size: { sm: { title: "text-sm" } } },
    });

    expectTypeOf(button).toEqualTypeOf(cva(config));
    expectTypeOf(button).toEqualTypeOf<RecipeOf<typeof config>>();
    expectTypeOf<PropsOf<typeof card>>().toEqualTypeOf<{
      readonly size: "sm";
      readonly classNames?: SlotClasses<"root" | "title"> | undefined;
    }>();
    // @ts-expect-error: lg is not an option of size.
    expect(button({ size: "lg" })).toBe("px-4");
    expect(button({})).toBe("px-3");
    expect(card({ size: "sm" })).toStrictEqual({ root: "", title: "text-sm" });
  });

  it("compose recipes of the default creators, and the other way", () => {
    const pill = cva({
      base: "rounded-full px-4",
      variants: { size: { sm: "px-2" } },
    });
    const configuredBadge = configured.cva({
      composes: [pill],
      variants: { tone: { danger: "bg-red-100" } },
    });
    const badge = cva({
      composes: [configuredBadge],
      defaultVariants: { tone: "danger" },
      variants: { muted: { true: "opacity-50" } },
    });

    expectTypeOf<VariantsOf<typeof configuredBadge>>().toEqualTypeOf<{
      readonly size: "sm";
      readonly tone: "danger";
    }>();
    expectTypeOf<VariantsOf<typeof badge>>().toEqualTypeOf<{
      readonly muted?: boolean | "false" | "true" | undefined;
      readonly size: "sm";
      readonly tone?: "danger" | undefined;
    }>();
    // @ts-expect-error: tone is a required variant.
    expect(configuredBadge({ size: "sm" })).toBe("rounded-full px-2");
    expect(configuredBadge({ size: "sm", tone: "danger" })).toBe(
      "rounded-full px-2 bg-red-100",
    );
    expect(badge({ muted: true, size: "sm" })).toBe(
      "rounded-full px-4 px-2 bg-red-100 opacity-50",
    );
  });

  it("pass through a function of the user's that is generic over them", () => {
    const button = define({
      base: "px-4",
      variants: { size: { sm: "px-2" } },
    });

    expectTypeOf<VariantsOf<typeof button>>().toEqualTypeOf<{
      readonly size: "sm";
    }>();
    expect(button({ size: "sm" })).toBe("px-2");
  });
});
