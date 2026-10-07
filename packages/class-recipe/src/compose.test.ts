import { describe, expect, expectTypeOf, it } from "vitest";
import { twMerge } from "tailwind-merge";

import { createRecipe, cva } from "./recipe.js";
import { createSlotRecipe, sva } from "./slot-recipe.js";
import type { VariantsOf } from "./types.js";
import { createRecipes } from "./create-recipes.js";

const control = cva({
  base: "rounded-md",
  variants: {
    size: { sm: "h-8", md: "h-10" },
    disabled: { true: "opacity-50" },
  },
  compoundVariants: [
    { variants: { size: "md", disabled: true }, className: "cursor-default" },
  ],
  defaultVariants: { size: "md" },
});

const button = cva({
  composes: [control],
  base: "font-medium",
  variants: {
    size: { md: "px-4", lg: "h-12 px-6" },
    tone: { primary: "bg-blue-600", neutral: "bg-gray-100" },
  },
  compoundVariants: [
    { variants: { tone: "primary", disabled: true }, className: "bg-blue-300" },
  ],
  defaultVariants: { tone: "primary" },
});

const field = sva({
  slots: ["root", "label"],
  base: { root: "grid gap-1", label: "text-sm" },
  variants: { invalid: { true: { label: "text-red-700" } } },
});

const select = sva({
  composes: [field],
  slots: ["trigger"],
  base: { trigger: "h-10 rounded-md" },
  variants: {
    invalid: { true: { root: "ring-red-600", trigger: "border-red-600" } },
    dense: { true: { trigger: "h-8" } },
  },
});

describe("a recipe that composes recipes", () => {
  it("adds the classes of each config as one config would", () => {
    expect(button()).toBe("rounded-md font-medium h-10 px-4 bg-blue-600");
    expect(button({ size: "md", disabled: true })).toBe(
      "rounded-md font-medium h-10 px-4 opacity-50 bg-blue-600 cursor-default bg-blue-300",
    );
    expect(button({ size: "lg" })).toBe(
      "rounded-md font-medium h-12 px-6 bg-blue-600",
    );
  });

  it("accepts the variants of every config", () => {
    expect(button.variantKeys).toStrictEqual(["size", "disabled", "tone"]);
    expectTypeOf<VariantsOf<typeof button>>().toEqualTypeOf<{
      readonly size?: "sm" | "md" | "lg" | undefined;
      readonly disabled?: boolean | "true" | "false" | undefined;
      readonly tone?: "primary" | "neutral" | undefined;
    }>();
  });

  it("adds className after every class", () => {
    expect(button({ tone: "neutral", className: "w-full" })).toBe(
      "rounded-md font-medium h-10 px-4 bg-gray-100 w-full",
    );
  });

  it("composes a recipe that composes others, each once", () => {
    const iconButton = createRecipe({
      composes: [button, control],
      variants: { shape: { square: "w-10" } },
    });

    expect(iconButton({ shape: "square" })).toBe(
      "rounded-md font-medium h-10 px-4 bg-blue-600 w-10",
    );
  });

  it("joins the classes it composes with its own join", () => {
    const merged = createRecipes({ join: twMerge }).cva({
      composes: [button],
      variants: { tone: { primary: "bg-indigo-600" } },
    });

    expect(merged()).toBe("rounded-md font-medium h-10 px-4 bg-indigo-600");
  });

  it("caches its class names unless its config turns the cache off", () => {
    const uncached = createRecipes({ cache: false }).cva({
      composes: [control],
      variants: {},
    });

    expect(uncached()).toBe("rounded-md h-10");
    expect(createRecipe({ composes: [uncached], variants: {} })()).toBe(
      "rounded-md h-10",
    );
  });

  it("composes only recipes without slots", () => {
    expect(() =>
      // @ts-expect-error: a recipe composes no slot recipe.
      cva({ composes: [field], variants: {} }),
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error: a function is not a recipe.
      cva({ composes: [(): string => ""], variants: {} }),
    ).toThrow(TypeError);
  });

  it("rejects an option that no config declares", () => {
    const recipe = cva({
      composes: [control],
      variants: {},
      // @ts-expect-error: "xl" is not an option of size.
      compoundVariants: [{ variants: { size: "xl" }, className: "a" }],
    });

    expect(recipe({ size: "sm" })).toBe("rounded-md h-8");
  });
});

describe("a slot recipe that composes slot recipes", () => {
  it("has the slots of every config, theirs first", () => {
    expect(select({ invalid: true })).toStrictEqual({
      root: "grid gap-1 ring-red-600",
      label: "text-sm text-red-700",
      trigger: "h-10 rounded-md border-red-600",
    });
    expectTypeOf(select).returns.toEqualTypeOf<
      Readonly<Record<"root" | "label" | "trigger", string>>
    >();
  });

  it("adds classNames to the slots it composes", () => {
    expect(select({ classNames: { root: "w-full" } }).root).toBe(
      "grid gap-1 w-full",
    );
  });

  it("accepts the variants of every config", () => {
    expect(select.variantKeys).toStrictEqual(["invalid", "dense"]);
    expectTypeOf<VariantsOf<typeof select>>().toEqualTypeOf<{
      readonly invalid?: boolean | "true" | "false" | undefined;
      readonly dense?: boolean | "true" | "false" | undefined;
    }>();
  });

  it("composes only slot recipes", () => {
    expect(() =>
      // @ts-expect-error: a slot recipe composes no recipe without slots.
      createSlotRecipe({ composes: [control], slots: [], variants: {} }),
    ).toThrow(TypeError);
  });

  it("rejects a slot that no config declares", () => {
    const labeled = sva({
      composes: [field],
      slots: [],
      // @ts-expect-error: icon is not a slot.
      base: { icon: "size-4" },
      variants: {},
    });

    expect(labeled()).toStrictEqual({ root: "grid gap-1", label: "text-sm" });
  });
});
