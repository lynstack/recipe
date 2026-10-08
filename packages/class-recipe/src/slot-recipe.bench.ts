import { createRecipes, createSlotRecipe } from "@lynstack/class-recipe";
import { describe, expect, it } from "vitest";
import type { PropsOf } from "@lynstack/class-recipe";
import type { TestContext } from "vitest";

const base = {
  root: "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
  icon: "shrink-0",
  label: "truncate",
};

const config = {
  slots: ["root", "icon", "label"],
  base,
  variants: {
    variant: {
      primary: { root: "bg-blue-600 text-white hover:bg-blue-700" },
      secondary: { root: "bg-gray-100 text-gray-900 hover:bg-gray-200" },
      danger: { root: "bg-red-600 text-white", icon: "text-white" },
      ghost: { root: "bg-transparent hover:bg-gray-50", icon: "text-gray-500" },
    },
    size: {
      sm: { root: "h-8 px-3 text-sm", icon: "size-4" },
      md: { root: "h-10 px-4", icon: "size-5" },
      lg: { root: "h-12 px-6 text-lg", icon: "size-6", label: "tracking-wide" },
    },
    loading: {
      true: { root: "cursor-wait", icon: "animate-spin" },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { variant: "danger", size: "lg" },
      classNames: { label: "font-bold" },
    },
    {
      variants: { variant: ["ghost", "secondary"], loading: true },
      classNames: { root: "opacity-75" },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    loading: false,
  },
} as const;

const selections = [
  {},
  { variant: "secondary" },
  { variant: "danger", size: "lg" },
  { variant: "ghost", size: "sm", loading: true },
  { variant: "ghost", classNames: { root: "w-full" } },
  { variant: "danger", size: "sm", classNames: { label: "uppercase" } },
] as const;

const expected = [
  {
    root: `${base.root} bg-blue-600 text-white hover:bg-blue-700 h-10 px-4`,
    icon: "shrink-0 size-5",
    label: "truncate",
  },
  {
    root: `${base.root} bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 px-4`,
    icon: "shrink-0 size-5",
    label: "truncate",
  },
  {
    root: `${base.root} bg-red-600 text-white h-12 px-6 text-lg`,
    icon: "shrink-0 text-white size-6",
    label: "truncate tracking-wide font-bold",
  },
  {
    root: `${base.root} bg-transparent hover:bg-gray-50 h-8 px-3 text-sm cursor-wait opacity-75`,
    icon: "shrink-0 text-gray-500 size-4 animate-spin",
    label: "truncate",
  },
  {
    root: `${base.root} bg-transparent hover:bg-gray-50 h-10 px-4 w-full`,
    icon: "shrink-0 text-gray-500 size-5",
    label: "truncate",
  },
  {
    root: `${base.root} bg-red-600 text-white h-8 px-3 text-sm`,
    icon: "shrink-0 text-white size-4",
    label: "truncate uppercase",
  },
];

type SlotRecipe = (
  selection: (typeof selections)[number],
) => Readonly<Record<string, string>>;

const recipes: Readonly<Record<string, SlotRecipe>> = {
  cached: createSlotRecipe(config),
  uncached: createRecipes({ cache: false }).createSlotRecipe(config),
};

describe("slot recipe", () => {
  it.for(Object.entries(recipes))(
    "%s returns the expected classes",
    ([, recipe]: readonly [string, SlotRecipe]) => {
      expect(selections.map((selection) => recipe(selection))).toStrictEqual(
        expected,
      );
    },
  );

  it("is faster with the cache", async ({ bench }: TestContext) => {
    expect.hasAssertions();

    let length = 0;
    const result = await bench.compare(
      ...Object.entries(recipes).map(
        ([name, recipe]: readonly [string, SlotRecipe]) =>
          bench(name, () => {
            for (const selection of selections) {
              const { root = "", icon = "", label = "" } = recipe(selection);
              length += root.length + icon.length + label.length;
            }
          }),
      ),
    );

    expect(length).toBeGreaterThan(0);
    expect(result.get("cached")).toBeFasterThan(result.get("uncached"));
  });
});

const recipe = createSlotRecipe(config);

type Props = PropsOf<typeof recipe>;

type ClassNames = Readonly<Partial<Record<"root" | "icon" | "label", string>>>;

function withClassNames(selection: Props, classNames: ClassNames): Props {
  return { ...selection, classNames };
}

describe("slot recipe with classNames", () => {
  const variantSelections = selections.slice(0, 4);
  const oneSlot = { root: "w-full" };
  const twoSlots = { root: "w-full", label: "uppercase" };
  const cases: Readonly<Record<string, readonly Props[]>> = {
    "variants only": variantSelections,
    "classNames without classes": variantSelections.map((selection) =>
      withClassNames(selection, {}),
    ),
    "classNames of one slot": variantSelections.map((selection) =>
      withClassNames(selection, oneSlot),
    ),
    "classNames of two slots": variantSelections.map((selection) =>
      withClassNames(selection, twoSlots),
    ),
  };

  it("returns the expected classes", () => {
    for (const [index, selection] of variantSelections.entries()) {
      const classNames = recipe(selection);

      expect(classNames).toStrictEqual(expected[index]);
      expect(recipe(withClassNames(selection, {}))).toBe(classNames);
      expect(recipe(withClassNames(selection, oneSlot))).toStrictEqual({
        ...classNames,
        root: `${classNames.root} w-full`,
      });
      expect(recipe(withClassNames(selection, twoSlots))).toStrictEqual({
        ...classNames,
        root: `${classNames.root} w-full`,
        label: `${classNames.label} uppercase`,
      });
    }
  });

  it("benchmark", async ({ bench }: TestContext) => {
    expect.hasAssertions();

    let length = 0;
    await bench.compare(
      ...Object.entries(cases).map(
        ([name, caseSelections]: readonly [string, readonly Props[]]) =>
          bench(name, () => {
            for (const selection of caseSelections) {
              const { root, icon, label } = recipe(selection);
              length += root.length + icon.length + label.length;
            }
          }),
      ),
    );

    expect(length).toBeGreaterThan(0);
  });
});
