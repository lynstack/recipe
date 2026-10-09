import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  ComposableKindRecipe,
  ComposableKindSlotRecipe,
  ComposedVariants,
  PropsOf,
  SlotClasses,
  SlotRecipeProps,
} from "./types.js";
import type {
  Recipe,
  RecipeConfig,
  RecipeProps,
  RecipeVariants,
} from "./recipe.js";
import type { RecipeOf, SlotRecipeOf } from "./recipe-of.js";
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

/** Creates a recipe that may compose others, as a library's helper does. */
function defineComposedRecipe<
  const Variants extends RecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<string>[] = readonly [],
>(
  config: RecipeConfig<Variants, DefaultedName, Composed>,
): ReturnType<typeof createRecipe<Variants, DefaultedName, Composed>> {
  return createRecipe(config);
}

/** Creates a slot recipe that may compose others, as a library's does. */
function defineComposedSlotRecipe<
  const Slot extends string,
  const Variants extends SlotRecipeVariants,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindSlotRecipe<string>[] =
    readonly [],
>(
  config: SlotRecipeConfig<Slot, Variants, DefaultedName, Composed>,
): ReturnType<
  typeof createSlotRecipe<Slot, Variants, DefaultedName, Composed>
> {
  return createSlotRecipe(config);
}

describe("a function generic over a config that composes recipes", () => {
  it("returns a recipe with the variants of the recipes it composes", () => {
    const iconButton = defineComposedRecipe({
      composes: [button],
      variants: { size: { icon: "size-10" } },
    });

    expect(iconButton({ tone: "danger" })).toBe("rounded bg-red-600 h-10");
    expectTypeOf<PropsOf<typeof iconButton>>().toEqualTypeOf<{
      readonly tone: "neutral" | "danger";
      readonly size?: "sm" | "md" | "icon" | undefined;
      readonly className?: string | undefined;
    }>();
  });

  it("returns a slot recipe with the slots of the slot recipes it composes", () => {
    const dialog = defineComposedSlotRecipe({
      composes: [card],
      slots: ["footer"],
      variants: { size: { sm: { footer: "gap-2" } } },
    });

    expect(dialog({ size: "sm" })).toStrictEqual({
      root: "p-4 p-2",
      title: "font-medium",
      footer: "gap-2",
    });
    expectTypeOf(dialog).toExtend<ComposableKindSlotRecipe<string>>();
    expectTypeOf(button).not.toExtend<ComposableKindSlotRecipe<string>>();
    expectTypeOf<PropsOf<typeof dialog>>().toEqualTypeOf<{
      readonly size: "sm" | "md";
      readonly classNames?:
        SlotClasses<"root" | "title" | "footer"> | undefined;
    }>();
  });
});

const pillConfig = {
  base: "rounded-full",
  variants: { size: { sm: "h-6", md: "h-8" } },
  defaultVariants: { size: "md" },
} as const;

const badgeConfig = {
  variants: { tone: { neutral: "bg-gray-100", danger: "bg-red-100" } },
} as const;

const lookConfig = {
  slots: ["root"],
  base: { root: "border" },
  variants: { size: { sm: { root: "h-6" }, md: { root: "h-8" } } },
  defaultVariants: { size: "md" },
} as const;

const toggleConfig = {
  slots: ["icon"],
  variants: { pressed: { true: { root: "ring", icon: "opacity-100" } } },
} as const;

describe("the type of the recipe of a config", () => {
  it("is the type of the recipe that cva returns for it", () => {
    const pill: RecipeOf<typeof pillConfig> = createRecipe(pillConfig);

    expect(pill({})).toBe("rounded-full h-8");
    expectTypeOf<RecipeOf<typeof pillConfig>>().toEqualTypeOf(
      createRecipe(pillConfig),
    );
  });

  it("composes the recipes that its last parameter lists", () => {
    const pill: RecipeOf<typeof pillConfig> = createRecipe(pillConfig);
    const badge: RecipeOf<typeof badgeConfig, readonly [typeof pill]> =
      createRecipe({ ...badgeConfig, composes: [pill] });

    expect(badge({ tone: "danger", size: "sm" })).toBe(
      "rounded-full h-6 bg-red-100",
    );
    expectTypeOf<
      RecipeOf<typeof badgeConfig, readonly [typeof pill]>
    >().toEqualTypeOf(createRecipe({ ...badgeConfig, composes: [pill] }));
  });

  it("is the type of the slot recipe that sva returns for it", () => {
    const look: SlotRecipeOf<typeof lookConfig> = createSlotRecipe(lookConfig);

    expect(look({})).toStrictEqual({ root: "border h-8" });
    expectTypeOf<SlotRecipeOf<typeof lookConfig>>().toEqualTypeOf(
      createSlotRecipe(lookConfig),
    );
  });

  it("composes the slot recipes that its last parameter lists", () => {
    const look: SlotRecipeOf<typeof lookConfig> = createSlotRecipe(lookConfig);
    const toggle: SlotRecipeOf<typeof toggleConfig, readonly [typeof look]> =
      createSlotRecipe({ ...toggleConfig, composes: [look] });

    expect(toggle({ pressed: true, size: "sm" })).toStrictEqual({
      root: "border h-6 ring",
      icon: "opacity-100",
    });
    expectTypeOf<
      SlotRecipeOf<typeof toggleConfig, readonly [typeof look]>
    >().toEqualTypeOf(createSlotRecipe({ ...toggleConfig, composes: [look] }));
  });

  it("rejects a config that lists the recipes it composes", () => {
    const pill = createRecipe(pillConfig);
    const composingConfig = { ...badgeConfig, composes: [pill] } as const;
    const badge = createRecipe(composingConfig);

    expect(badge({ tone: "neutral" })).toBe("rounded-full h-8 bg-gray-100");
    // @ts-expect-error: the recipes it composes are its last parameter.
    expectTypeOf<RecipeOf<typeof composingConfig>>().toBeFunction();
  });
});
