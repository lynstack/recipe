import type {
  ComposedSlot,
  CompoundCondition,
  DefaultVariants,
  NativeStyle,
  RecipeFunction,
  SlotStyleRecipe,
  SlotStyles,
  StyleRecipe,
  VariantOption,
  VariantsOf,
} from "@lynstack/native-recipe";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";

// Each part of a config is declared before the call, with its public type.
const boxVariants = {
  size: { lg: { height: 48 }, md: { height: 40 } },
  tone: { danger: { backgroundColor: "#dc2626" }, neutral: {} },
} as const;
const dangerLarge: CompoundCondition<typeof boxVariants> = {
  size: "lg",
  tone: "danger",
};
const boxDefaults: DefaultVariants<typeof boxVariants, "size"> = {
  size: "md",
};
const box = createStyleRecipe({
  compoundVariants: [{ style: { borderWidth: 2 }, variants: dangerLarge }],
  defaultVariants: boxDefaults,
  variants: boxVariants,
});

const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  variants: { size: { md: { label: { fontSize: 16 } } } },
});

const size: VariantOption<(typeof boxVariants)["size"]> = "lg";
const boxRecipe: StyleRecipe<VariantsOf<typeof box>, NativeStyle> = box;
const buttonRecipe: SlotStyleRecipe<
  VariantsOf<typeof button>,
  SlotStyles<"label" | "root">
> = button;
const render: RecipeFunction<VariantsOf<typeof box>, NativeStyle> = box;
const iconButtonSlots: readonly ComposedSlot<
  readonly [typeof button],
  "icon"
>[] = ["icon", "label", "root"];

const boxStyle: NativeStyle = render({ size, tone: "danger" });
const buttonStyles: SlotStyles<"label" | "root"> = buttonRecipe({
  size: "md",
});

export { box, boxRecipe, boxStyle, buttonStyles, iconButtonSlots };
