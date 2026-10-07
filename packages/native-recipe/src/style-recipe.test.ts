import { describe, expect, expectTypeOf, it } from "vitest";

import type { VariantsOf } from "./types.js";
import { createStyleRecipe } from "./style-recipe.js";

const badge = createStyleRecipe({
  base: { borderRadius: 6, padding: 4 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      danger: { backgroundColor: "#dc2626", borderWidth: 1 },
    },
    size: {
      md: { padding: 8 },
      sm: { height: 24 },
    },
  },
  defaultVariants: { size: "md" },
});

describe(createStyleRecipe, () => {
  it("merges the base style and the selected options in order", () => {
    expect(badge({ tone: "danger", size: "sm" })).toStrictEqual({
      borderRadius: 6,
      padding: 4,
      backgroundColor: "#dc2626",
      borderWidth: 1,
      height: 24,
    });
  });

  it("lets a later style override an earlier one", () => {
    expect(badge({ tone: "neutral", size: "md" })).toStrictEqual({
      borderRadius: 6,
      padding: 8,
      backgroundColor: "#f3f4f6",
    });
  });

  it("copies a property set to undefined, as StyleSheet.flatten does", () => {
    const recipe = createStyleRecipe({
      base: { color: "#111827" },
      variants: { muted: { true: { color: undefined } } },
    });

    expect(recipe({ muted: true })).toStrictEqual({ color: undefined });
  });

  it("applies default variants when a variant is omitted", () => {
    expect(badge({ tone: "neutral" })).toBe(
      badge({ tone: "neutral", size: "md" }),
    );
  });

  it("applies default variants when a variant is undefined", () => {
    expect(badge({ tone: "neutral", size: undefined })).toBe(
      badge({ tone: "neutral", size: "md" }),
    );
  });

  it("returns the same frozen object for the same selection", () => {
    const first = badge({ tone: "danger" });

    expect(badge({ tone: "danger", size: "md" })).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
  });

  it("keeps selections that differ apart", () => {
    expect(badge({ tone: "neutral" })).not.toBe(badge({ tone: "danger" }));
  });

  it("leaves the styles of the config unchanged", () => {
    const base = { borderRadius: 6 };
    const recipe = createStyleRecipe({
      base,
      variants: { size: { sm: { height: 24 } } },
    });

    expect(recipe({ size: "sm" })).not.toBe(base);
    expect(base).toStrictEqual({ borderRadius: 6 });
    expect(Object.isExtensible(base)).toBe(true);
  });

  it("returns the base style when no option has a style", () => {
    const recipe = createStyleRecipe({
      base: { flex: 1 },
      variants: {},
    });

    expect(recipe()).toStrictEqual({ flex: 1 });
    expect(recipe()).toBe(recipe());
  });

  it("returns an empty style without a base or a selected style", () => {
    const recipe = createStyleRecipe({
      variants: { disabled: { true: { opacity: 0.5 } } },
    });

    expect(recipe()).toStrictEqual({});
  });

  it("treats a boolean variant as false by default", () => {
    const recipe = createStyleRecipe({
      variants: {
        disabled: { true: { opacity: 0.5 }, false: { opacity: 1 } },
      },
    });

    expect(recipe()).toStrictEqual({ opacity: 1 });
    expect(recipe({ disabled: true })).toStrictEqual({ opacity: 0.5 });
    expect(recipe({ disabled: "true" })).toBe(recipe({ disabled: true }));
  });

  it("adds compound styles when every condition matches, in order", () => {
    const recipe = createStyleRecipe({
      variants: {
        tone: {
          neutral: { backgroundColor: "#f3f4f6" },
          danger: { backgroundColor: "#dc2626" },
        },
        size: { sm: { height: 24 }, md: { height: 32 } },
      },
      compoundVariants: [
        { variants: { tone: "danger", size: "md" }, style: { borderWidth: 2 } },
        {
          variants: { tone: ["neutral", "danger"], size: "md" },
          style: { borderWidth: 1, height: 36 },
        },
      ],
    });

    expect(recipe({ tone: "danger", size: "md" })).toStrictEqual({
      backgroundColor: "#dc2626",
      height: 36,
      borderWidth: 1,
    });
    expect(recipe({ tone: "danger", size: "sm" })).toStrictEqual({
      backgroundColor: "#dc2626",
      height: 24,
    });
  });

  it("ignores properties of the selection that are not variants", () => {
    const props = { tone: "danger", size: "sm", title: "Delete" } as const;

    expect(badge(props)).toBe(badge({ tone: "danger", size: "sm" }));
  });

  it("rejects an undeclared option and ignores it at runtime", () => {
    // @ts-expect-error "warning" is not a tone option
    expect(badge({ tone: "warning" })).toStrictEqual({
      borderRadius: 6,
      padding: 8,
    });
  });

  it("rejects a missing required variant", () => {
    // @ts-expect-error tone has no default, so it is required
    expect(badge({ size: "sm" })).toStrictEqual({
      borderRadius: 6,
      padding: 4,
      height: 24,
    });
  });

  it("makes the argument optional only when every variant has a default", () => {
    const recipe = createStyleRecipe({
      variants: { size: { sm: { height: 24 }, md: { height: 32 } } },
      defaultVariants: { size: "md" },
    });

    expect(recipe()).toStrictEqual({ height: 32 });
    expectTypeOf(recipe)
      .parameter(0)
      .toEqualTypeOf<{ readonly size?: "sm" | "md" | undefined } | undefined>();
  });

  it("lists the names of its variants", () => {
    expect(badge.variantKeys).toStrictEqual(["tone", "size"]);
    expectTypeOf(badge.variantKeys).toEqualTypeOf<
      readonly ("tone" | "size")[]
    >();
  });

  it("lists the options and defaults of its variants", () => {
    expect(badge.variantOptions).toStrictEqual({
      tone: ["neutral", "danger"],
      size: ["md", "sm"],
    });
    expect(badge.defaultVariants).toStrictEqual({ size: "md" });
    expectTypeOf(badge.variantOptions).toEqualTypeOf<{
      readonly tone: readonly ("neutral" | "danger")[];
      readonly size: readonly ("md" | "sm")[];
    }>();
    expectTypeOf(badge.defaultVariants).toEqualTypeOf<{
      readonly size: "md" | "sm";
    }>();
  });

  it("infers its variants", () => {
    expect(badge({ tone: "neutral" })).toBeDefined();
    expectTypeOf<VariantsOf<typeof badge>>().toEqualTypeOf<{
      readonly tone: "neutral" | "danger";
      readonly size?: "md" | "sm" | undefined;
    }>();
  });

  it("rejects compound conditions on undeclared options", () => {
    const recipe = createStyleRecipe({
      variants: { size: { sm: { height: 24 } } },
      compoundVariants: [
        // @ts-expect-error "lg" is not a size option
        { variants: { size: "lg" }, style: { opacity: 0.5 } },
      ],
    });

    expect(recipe({ size: "sm" })).toStrictEqual({ height: 24 });
  });

  it("rejects undeclared default variants", () => {
    const recipe = createStyleRecipe({
      variants: { size: { sm: { height: 24 } } },
      // @ts-expect-error "lg" is not a size option
      defaultVariants: { size: "lg" },
    });

    expect(recipe({ size: "sm" })).toStrictEqual({ height: 24 });
  });
});
