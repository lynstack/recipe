import { describe, expect, expectTypeOf, it } from "vitest";

import { createRecipe, makeCreateRecipe } from "./recipe.js";
import { createSlotRecipe, makeCreateSlotRecipe } from "./slot-recipe.js";
import type { ClassJoin } from "./join.js";
import type { RecipeVariants } from "./recipe.js";
import type { SlotRecipeVariants } from "./slot-recipe.js";
import type { VariantsOf } from "./types.js";
import { createRecipes } from "./create-recipes.js";

function recordingJoin(): {
  readonly calls: (readonly string[])[];
  readonly join: ClassJoin;
} {
  const calls: (readonly string[])[] = [];
  return {
    calls,
    join: (...classNames) => {
      calls.push(classNames);
      return classNames.join(" ");
    },
  };
}

describe("edge cases", () => {
  it("never matches a compound condition on an undeclared variant", () => {
    const variants: RecipeVariants = { size: { sm: "p-2" } };
    const recipe = createRecipe({
      compoundVariants: [{ className: "ring-2", variants: { tone: "danger" } }],
      defaultVariants: { size: "sm" },
      variants,
    });

    expect(recipe({ tone: "danger" })).toBe("p-2");
    expect(recipe({ tone: "neutral" })).toBe("p-2");
  });

  it("never matches a compound condition without options", () => {
    const recipe = createRecipe({
      compoundVariants: [{ className: "ring-2", variants: { size: [] } }],
      variants: { size: { md: "p-4", sm: "p-2" } },
    });

    expect(recipe({ size: "sm" })).toBe("p-2");
  });

  it("never passes an empty string to the join function", () => {
    const { calls, join } = recordingJoin();
    const recipe = makeCreateRecipe({ cache: true, join })({
      variants: { size: { md: "p-4", sm: "" } },
    });
    const slotRecipe = makeCreateSlotRecipe({ cache: true, join })({
      slots: ["root", "icon"],
      variants: { size: { sm: { root: "p-2" } } },
    });

    recipe({ className: "w-full", size: "sm" });
    slotRecipe({ classNames: { icon: "size-4" }, size: "sm" });
    createRecipes({ join }).cx(false, null);

    expect(calls).toStrictEqual([["w-full"], ["p-2"], ["size-4"]]);
  });

  it("treats null props and overrides as absent", () => {
    const recipe = createRecipe({
      defaultVariants: { size: "md" },
      variants: { size: { md: "p-4", sm: "p-2" } },
    });
    const slotRecipe = createSlotRecipe({
      slots: ["root"],
      variants: { size: { md: { root: "p-4" } } },
    });

    // @ts-expect-error props cannot be null
    expect(recipe(null)).toBe("p-4");
    // @ts-expect-error classNames cannot be null
    expect(slotRecipe({ classNames: null, size: "md" })).toStrictEqual({
      root: "p-4",
    });
  });

  it("keeps a slot and a variant named __proto__", () => {
    // A computed key defines a property instead of setting the prototype.
    const slotRecipe = createSlotRecipe({
      slots: ["__proto__", "root"],
      base: { ["__proto__"]: "p-2" },
      variants: { ["__proto__"]: { sm: { root: "text-sm" } } },
      defaultVariants: { ["__proto__"]: "sm" },
    });

    const classNames = slotRecipe({ classNames: { ["__proto__"]: "w-full" } });

    expect(Object.getPrototypeOf(classNames)).toBe(Object.prototype);
    expect(Object.entries(classNames)).toStrictEqual([
      ["__proto__", "p-2 w-full"],
      ["root", "text-sm"],
    ]);
  });

  it("ignores changes to the config after the recipe is created", () => {
    const options: Record<string, string> = { md: "p-4", sm: "p-2" };
    const slots = ["root"];
    const recipe = createRecipe({ variants: { size: options } });
    const slotRecipe = createSlotRecipe({
      slots,
      variants: { size: { md: { root: "p-4" } } },
    });

    options["sm"] = "p-1";
    slots.push("icon");

    expect(recipe({ size: "sm" })).toBe("p-2");
    expect(slotRecipe({ size: "md" })).toStrictEqual({ root: "p-4" });
  });

  describe("with variant names not known at compile time", () => {
    const variants: SlotRecipeVariants = {
      size: { sm: { root: "p-2" }, md: { root: "p-4" } },
    };
    const recipe = createSlotRecipe({ slots: ["root", "title"], variants });

    it("accepts any variant name, an option name, and classNames", () => {
      expect(
        recipe({ size: "sm", classNames: { title: "font-bold" } }),
      ).toStrictEqual({ root: "p-2", title: "font-bold" });
      expectTypeOf<VariantsOf<typeof recipe>>().toEqualTypeOf<
        Readonly<Record<string, string | undefined>>
      >();
    });

    it("rejects an option that is not a string", () => {
      // @ts-expect-error an option is named by a string
      expect(recipe({ size: 1 })).toStrictEqual({ root: "", title: "" });
    });

    it("rejects classNames for undeclared slots", () => {
      // @ts-expect-error tilte is not a slot
      expect(recipe({ classNames: { tilte: "x" } })).toStrictEqual({
        root: "",
        title: "",
      });
    });

    it("accepts classes by slot as an option and ignores them", () => {
      expect(recipe({ size: { root: "x" } })).toStrictEqual({
        root: "",
        title: "",
      });
    });
  });
});
