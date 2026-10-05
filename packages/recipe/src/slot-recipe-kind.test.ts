import { describe, expect, expectTypeOf, it } from "vitest";

import type { KindSlotVariants } from "./slot-recipe-kind.js";
import { createSlotRecipeKind } from "./slot-recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleKind = {
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
  finish: (style: Style): Style => Object.freeze(style),
};

const slotStyleRecipe = createSlotRecipeKind(styleKind);

const listRecipe = createSlotRecipeKind({
  initial: (base: string | undefined): readonly string[] =>
    base === undefined ? [] : [base],
  reduce: (list: readonly string[], value: string): readonly string[] => [
    ...list,
    value,
  ],
});

const button = slotStyleRecipe({
  slots: ["root", "icon", "label"],
  base: { root: { borderRadius: 8 }, label: { fontWeight: 600 } },
  variants: {
    tone: {
      primary: { root: { background: "blue" }, label: { color: "white" } },
      ghost: { label: { color: "blue" } },
    },
    size: {
      sm: { root: { height: 32 }, icon: { width: 16 } },
      md: { root: { height: 40 }, icon: { width: 20 } },
    },
    loading: { true: { icon: { opacity: 0.5 } } },
  },
  compoundVariants: [
    {
      variants: { tone: "ghost", loading: true },
      value: { root: { opacity: 0.8 } },
    },
    {
      variants: { tone: ["primary", "ghost"], size: "sm" },
      value: { label: { fontSize: 14 }, root: { height: 30 } },
    },
  ],
  defaultVariants: { tone: "primary", size: "md" },
});

describe(createSlotRecipeKind, () => {
  it("reduces the base and the selected options of each slot", () => {
    expect(button({ tone: "ghost", size: "md" })).toStrictEqual({
      root: { borderRadius: 8, height: 40 },
      icon: { width: 20 },
      label: { fontWeight: 600, color: "blue" },
    });
  });

  it("adds compound values after the options' values, in order", () => {
    expect(button({ tone: "ghost", size: "sm", loading: true })).toStrictEqual({
      root: { borderRadius: 8, height: 30, opacity: 0.8 },
      icon: { width: 16, opacity: 0.5 },
      label: { fontWeight: 600, color: "blue", fontSize: 14 },
    });
  });

  it("gives a slot without values the result of an undefined base", () => {
    const recipe = listRecipe({
      slots: ["root", "icon"],
      variants: { size: { md: { root: "h-10" } } },
    });

    expect(recipe({ size: "md" })).toStrictEqual({ root: ["h-10"], icon: [] });
  });

  it("keys the result by slot in the order of slots", () => {
    expect(Object.keys(button())).toStrictEqual(["root", "icon", "label"]);
  });

  it("applies default variants and boolean defaults", () => {
    expect(button()).toBe(button({ tone: "primary", size: "md" }));
    expect(button({ loading: false })).toBe(button());
    expect(button({ loading: "true" })).toBe(button({ loading: true }));
  });

  it("returns the same frozen result for the same selection", () => {
    const first = button({ size: "sm" });

    expect(button({ tone: "primary", size: "sm" })).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.root)).toBe(true);
  });

  it("starts each result from new accumulators", () => {
    const small = button({ size: "sm" });
    const medium = button({ size: "md" });

    expect(small.root).toStrictEqual({
      borderRadius: 8,
      background: "blue",
      height: 30,
    });
    expect(medium.root).toStrictEqual({
      borderRadius: 8,
      background: "blue",
      height: 40,
    });
  });

  it("builds the result on every call without the cache", () => {
    const recipe = createSlotRecipeKind({ ...styleKind, cache: false })({
      slots: ["root"],
      variants: { size: { sm: { root: { height: 32 } } } },
    });

    expect(recipe({ size: "sm" })).not.toBe(recipe({ size: "sm" }));
    expect(recipe({ size: "sm" })).toStrictEqual({ root: { height: 32 } });
  });

  it("adds nothing for an undeclared option and does not cache it", () => {
    // @ts-expect-error "xl" is not a size option
    const result = button({ size: "xl" });

    expect(result).toStrictEqual({
      root: { borderRadius: 8, background: "blue" },
      icon: {},
      label: { fontWeight: 600, color: "white" },
    });
    // @ts-expect-error "xl" is not a size option
    expect(button({ size: "xl" })).not.toBe(result);
  });

  it("ignores values of undeclared slots and inherited properties", () => {
    const variants: KindSlotVariants<string> = {
      size: { sm: { root: "h-8", icon: "size-4" } },
    };
    const recipe = listRecipe({ slots: ["root", "toString"], variants });

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: ["h-8"],
      toString: [],
    });
  });

  it("returns the accumulators without finish", () => {
    const recipe = listRecipe({
      slots: ["root"],
      base: { root: "rounded" },
      variants: { size: { sm: { root: "h-8" } } },
    });

    expect(recipe({ size: "sm" })).toStrictEqual({ root: ["rounded", "h-8"] });
  });

  it("ignores changes to the config after the recipe is created", () => {
    const slots = ["root"];
    const recipe = listRecipe({
      slots,
      variants: { size: { sm: { root: "h-8" } } },
    });
    slots.push("icon");

    expect(recipe({ size: "sm" })).toStrictEqual({ root: ["h-8"] });
  });

  it("lists its variant names in variantKeys", () => {
    expect(button.variantKeys).toStrictEqual(["tone", "size", "loading"]);
    expectTypeOf(button.variantKeys).toEqualTypeOf<
      readonly ("tone" | "size" | "loading")[]
    >();
  });

  it("infers the selection and the result", () => {
    expect(button()).toBeDefined();
    expectTypeOf(button).parameter(0).toEqualTypeOf<
      | {
          readonly tone?: "primary" | "ghost" | undefined;
          readonly size?: "sm" | "md" | undefined;
          readonly loading?: boolean | "true" | "false" | undefined;
        }
      | undefined
    >();
    expectTypeOf(button).returns.toEqualTypeOf<
      Readonly<Record<"root" | "icon" | "label", Style>>
    >();
  });

  it("accepts a config declared beforehand", () => {
    const config = {
      slots: ["root", "icon"],
      variants: { size: { sm: { root: "h-8" }, md: { icon: "size-5" } } },
      compoundVariants: [
        { variants: { size: "sm" }, value: { root: "px-2" } },
        { variants: { size: ["sm", "md"] }, value: { icon: "shrink-0" } },
      ],
      defaultVariants: { size: "md" },
    } as const;
    const recipe = listRecipe(config);

    expect(recipe({ size: "sm" })).toStrictEqual({
      root: ["h-8", "px-2"],
      icon: ["shrink-0"],
    });
    expectTypeOf(recipe).returns.toEqualTypeOf<
      Readonly<Record<"root" | "icon", readonly string[]>>
    >();
  });

  it("requires a variant without a default", () => {
    const recipe = listRecipe({
      slots: ["root"],
      variants: { size: { sm: { root: "h-8" } } },
    });

    // @ts-expect-error size has no default, so it is required
    expect(recipe({})).toStrictEqual({ root: [] });
  });

  it("accepts any selection when the variant names are not known", () => {
    const variants: KindSlotVariants<string> = {
      size: { sm: { root: "h-8" } },
    };
    const recipe = listRecipe({ slots: ["root"], variants });

    expect(recipe({ size: "sm", other: 1 })).toStrictEqual({ root: ["h-8"] });
    expectTypeOf(recipe)
      .parameter(0)
      .toEqualTypeOf<Readonly<Record<string, unknown>> | undefined>();
  });

  it("rejects values of undeclared slots", () => {
    const recipe = listRecipe({
      slots: ["root"],
      // @ts-expect-error icon is not a slot
      base: { root: "rounded", icon: "size-4" },
      variants: {
        // @ts-expect-error icon is not a slot
        size: { sm: { root: "h-8", icon: "size-4" } },
      },
      compoundVariants: [
        // @ts-expect-error icon is not a slot
        { variants: { size: "sm" }, value: { icon: "size-4" } },
      ],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({ root: ["rounded", "h-8"] });
  });

  it("rejects values of another type than the kind's values", () => {
    const recipe = listRecipe({
      slots: ["root"],
      // @ts-expect-error a list recipe's values are strings
      variants: { size: { sm: { root: 8 } } },
    });

    expect(recipe).toBeTypeOf("function");
  });

  it("rejects undeclared options in compound and default variants", () => {
    const recipe = listRecipe({
      slots: ["root"],
      variants: { size: { sm: { root: "h-8" } } },
      compoundVariants: [
        // @ts-expect-error "lg" is not a size option
        { variants: { size: "lg" }, value: { root: "font-bold" } },
      ],
      // @ts-expect-error "lg" is not a size option
      defaultVariants: { size: "lg" },
    });

    expect(recipe({ size: "sm" })).toStrictEqual({ root: ["h-8"] });
  });
});
