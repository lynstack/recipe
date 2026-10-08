import { describe, expect, expectTypeOf, it } from "vitest";

import type { ComposableKindSlotRecipe, NativeStyle } from "./types.js";
import { createSlotStyleRecipe } from "./slot-style-recipe.js";

const field = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: { root: { gap: 4 }, label: { fontSize: 14 } },
  variants: { invalid: { true: { label: { color: "#b91c1c" } } } },
});

/** Adds a footer to any slot recipe, as a library's own helper does. */
function withFooter<const Base extends ComposableKindSlotRecipe<NativeStyle>>(
  base: Base,
): ReturnType<
  typeof createSlotStyleRecipe<
    "footer",
    {
      readonly dense: {
        readonly true: { readonly footer: { readonly paddingTop: 8 } };
      };
    },
    { readonly footer: { readonly paddingTop: 16 } },
    readonly [],
    never,
    readonly [Base]
  >
> {
  return createSlotStyleRecipe({
    composes: [base],
    slots: ["footer"],
    base: { footer: { paddingTop: 16 } },
    variants: { dense: { true: { footer: { paddingTop: 8 } } } },
  });
}

/** Adds a footer, and a style for a slot that no recipe declares. */
function withIcon<const Base extends ComposableKindSlotRecipe<NativeStyle>>(
  base: Base,
): ReturnType<
  typeof createSlotStyleRecipe<
    "footer",
    {
      readonly dense: {
        readonly true: { readonly footer: { readonly paddingTop: 8 } };
      };
    },
    { readonly icon: { readonly width: 16 } },
    readonly [],
    never,
    readonly [Base]
  >
> {
  return createSlotStyleRecipe({
    composes: [base],
    slots: ["footer"],
    // @ts-expect-error: icon is not a slot of the recipe.
    base: { icon: { width: 16 } },
    variants: { dense: { true: { footer: { paddingTop: 8 } } } },
  });
}

describe("a slot style recipe in a function generic over the slot recipe it composes", () => {
  it("accepts its own slots", () => {
    const footed = withFooter(field);

    expect(footed({ dense: true })).toStrictEqual({
      root: { gap: 4 },
      label: { fontSize: 14 },
      footer: { paddingTop: 8 },
    });
    expectTypeOf(footed.variantKeys).toEqualTypeOf<
      readonly ("invalid" | "dense")[]
    >();
  });

  it("rejects a slot that it does not declare", () => {
    expect(withIcon(field)()).toStrictEqual({
      root: { gap: 4 },
      label: { fontSize: 14 },
      footer: {},
    });
  });
});
