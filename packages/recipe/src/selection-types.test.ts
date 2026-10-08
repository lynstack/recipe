import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  CompoundCondition,
  DefaultVariants,
  RecipeFunction,
  VariantOption,
  VariantSelection,
  VariantsOf,
} from "./types.js";
import type { KindRecipe } from "./recipe-kind.js";
import type { KindSelection } from "./kind-selection.js";
import { createRecipeKind } from "./recipe-kind.js";

type Style = Readonly<Record<string, string | number>>;

const styleRecipe = createRecipeKind({
  initial: (base: Style | undefined): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
});

const variants = {
  muted: { false: { opacity: 1 }, true: { opacity: 0.5 } },
  size: { md: { padding: 8 }, sm: { padding: 4 } },
  tone: { danger: { color: "red" }, neutral: { color: "gray" } },
  weight: { 400: { fontWeight: 400 }, 700: { fontWeight: 700 } },
} as const;

type Variants = typeof variants;

describe("the option of a variant", () => {
  it("is the name of each of its options", () => {
    const box = styleRecipe({ variants });

    expectTypeOf<VariantOption<Variants["size"]>>().toEqualTypeOf<
      "md" | "sm"
    >();
    expect(
      box({ muted: false, size: "sm", tone: "danger", weight: 700 }),
    ).toStrictEqual({ color: "red", fontWeight: 700, opacity: 1, padding: 4 });
  });

  it("is a number or its name for a numeric option", () => {
    const box = styleRecipe({ variants });

    expectTypeOf<VariantOption<Variants["weight"]>>().toEqualTypeOf<
      400 | 700 | "400" | "700"
    >();
    expect(box({ size: "md", tone: "neutral", weight: "400" })).toStrictEqual({
      color: "gray",
      fontWeight: 400,
      opacity: 1,
      padding: 8,
    });
  });

  it("is a boolean or its name for a variant of true and false", () => {
    const box = styleRecipe({ variants });

    expectTypeOf<VariantOption<Variants["muted"]>>().toEqualTypeOf<
      boolean | "false" | "true"
    >();
    expect(
      box({ muted: "true", size: "md", tone: "neutral", weight: 400 }),
    ).toStrictEqual({
      color: "gray",
      fontWeight: 400,
      opacity: 0.5,
      padding: 8,
    });
  });
});

describe("the selection of a recipe's variants", () => {
  it("requires the variants without a default, except a boolean one", () => {
    const box = styleRecipe({ defaultVariants: { size: "md" }, variants });

    expectTypeOf<VariantSelection<Variants, "size">>().toEqualTypeOf<{
      readonly muted?: boolean | "false" | "true" | undefined;
      readonly size?: "md" | "sm" | undefined;
      readonly tone: "danger" | "neutral";
      readonly weight: 400 | 700 | "400" | "700";
    }>();
    expectTypeOf<Parameters<typeof box>[0]>().toEqualTypeOf<
      VariantSelection<Variants, "size">
    >();
    // @ts-expect-error: tone and weight have no default.
    expect(box({ size: "sm" })).toStrictEqual({ opacity: 1, padding: 4 });
  });

  it("accepts a selection declared before the call", () => {
    const box = styleRecipe({ defaultVariants: { size: "md" }, variants });
    const selection: VariantSelection<Variants, "size"> = {
      tone: "danger",
      weight: 400,
    };

    expect(box(selection)).toStrictEqual({
      color: "red",
      fontWeight: 400,
      opacity: 1,
      padding: 8,
    });
  });
});

describe("the default variants of a config", () => {
  it("name an option of each variant that has a default", () => {
    const defaults: DefaultVariants<Variants, "size" | "tone"> = {
      size: "sm",
      tone: "neutral",
    };
    const box = styleRecipe({ defaultVariants: defaults, variants });

    expectTypeOf<DefaultVariants<Variants, "size" | "tone">>().toEqualTypeOf<{
      readonly size: "md" | "sm";
      readonly tone: "danger" | "neutral";
    }>();
    expectTypeOf<VariantsOf<typeof box>>().toEqualTypeOf<
      VariantSelection<Variants, "size" | "tone">
    >();
    expect(box({ weight: 400 })).toStrictEqual({
      color: "gray",
      fontWeight: 400,
      opacity: 1,
      padding: 4,
    });
  });

  it("reject an option the variant does not declare", () => {
    const defaults: DefaultVariants<Variants, "size"> = {
      // @ts-expect-error: lg is not an option of size.
      size: "lg",
    };

    expect(defaults).toStrictEqual({ size: "lg" });
  });
});

describe("the condition of a compound variant", () => {
  it("names one option, or several, of some variants", () => {
    const condition: CompoundCondition<Variants> = {
      size: ["md", "sm"],
      tone: "danger",
    };
    const box = styleRecipe({
      compoundVariants: [{ value: { borderWidth: 1 }, variants: condition }],
      variants,
    });

    expectTypeOf<CompoundCondition<Variants>["size"]>().toEqualTypeOf<
      "md" | "sm" | readonly ("md" | "sm")[] | undefined
    >();
    expect(box({ size: "md", tone: "danger", weight: 400 })).toStrictEqual({
      borderWidth: 1,
      color: "red",
      fontWeight: 400,
      opacity: 1,
      padding: 8,
    });
  });

  it("rejects an option the variant does not declare", () => {
    const condition: CompoundCondition<Variants> = {
      // @ts-expect-error: lg is not an option of size.
      size: ["lg"],
    };

    expect(condition).toStrictEqual({ size: ["lg"] });
  });
});

describe("the function of a recipe", () => {
  it("takes optional props when every prop is optional", () => {
    const box = styleRecipe({
      defaultVariants: { size: "md" },
      variants: { size: variants.size },
    });
    const call: RecipeFunction<{ readonly size?: "md" | "sm" }, Style> = box;

    expectTypeOf<
      RecipeFunction<{ readonly size?: "md" | "sm" }, Style>
    >().toEqualTypeOf<(props?: { readonly size?: "md" | "sm" }) => Style>();
    expect(call()).toStrictEqual({ padding: 8 });
  });

  it("requires props when a prop is required", () => {
    const box = styleRecipe({ variants: { size: variants.size } });
    const call: RecipeFunction<{ readonly size: "md" | "sm" }, Style> = box;

    expectTypeOf<
      RecipeFunction<{ readonly size: "md" | "sm" }, Style>
    >().toEqualTypeOf<(props: { readonly size: "md" | "sm" }) => Style>();
    // @ts-expect-error: size is required.
    expect(call()).toStrictEqual({});
  });
});

/** The selection of a recipe of any variants, as a library helper types it. */
type AnySelection = KindSelection<
  Readonly<Record<string, Readonly<Record<string, Style>>>>,
  never
>;

/** Lists the variants of any recipe of the style kind. */
function variantNamesOf(
  recipe: ((props: never) => Style) & {
    readonly variantKeys: readonly string[];
  },
): readonly string[] {
  return recipe.variantKeys;
}

/** Lists the variants of a recipe whose every variant is optional. */
function optionalVariantNamesOf(
  recipe: KindRecipe<AnySelection, Style>,
): readonly string[] {
  return recipe.variantKeys;
}

describe("a function that takes any recipe of a kind", () => {
  it("takes a recipe with required variants as a function of never", () => {
    const box = styleRecipe({ defaultVariants: { size: "md" }, variants });

    expect(variantNamesOf(box)).toStrictEqual([
      "muted",
      "size",
      "tone",
      "weight",
    ]);
  });

  it("takes as a KindRecipe of any selection only optional variants", () => {
    const box = styleRecipe({ defaultVariants: { size: "md" }, variants });
    const stack = styleRecipe({
      defaultVariants: { size: "md" },
      variants: { size: variants.size },
    });

    expect(optionalVariantNamesOf(stack)).toStrictEqual(["size"]);
    // @ts-expect-error: the function may call box without tone and weight.
    expect(optionalVariantNamesOf(box)).toStrictEqual([
      "muted",
      "size",
      "tone",
      "weight",
    ]);
  });
});
