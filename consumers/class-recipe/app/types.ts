import type {
  ClassDictionary,
  ClassJoin,
  ClassValue,
  ComposedSlot,
  CompoundCondition,
  CompoundVariant,
  DefaultVariants,
  PropsOf,
  RecipeFunction,
  RecipesOptions,
  SlotClassNames,
  SlotCompoundVariant,
  VariantOption,
  VariantSelection,
} from "@lynstack/class-recipe";
import { createRecipes, cva, cx, sva } from "@lynstack/class-recipe";

// Each part of a config is declared before the call, with its public type.
const buttonVariants = {
  size: { md: "h-10", sm: "h-8" },
  tone: { danger: "bg-red-600", neutral: "bg-gray-100" },
} as const;
const smallDanger: CompoundCondition<typeof buttonVariants> = {
  size: "sm",
  tone: ["danger"],
};
const buttonCompounds: readonly CompoundVariant<typeof buttonVariants>[] = [
  { className: "font-bold", variants: smallDanger },
];
const buttonDefaults: DefaultVariants<typeof buttonVariants, "size"> = {
  size: "md",
};
const button = cva({
  compoundVariants: buttonCompounds,
  defaultVariants: buttonDefaults,
  variants: buttonVariants,
});

const cardVariants = { raised: { true: { root: "shadow" } } } as const;
const cardCompounds: readonly SlotCompoundVariant<
  "root" | "title",
  typeof cardVariants
>[] = [{ classNames: { title: "text-lg" }, variants: { raised: true } }];
const card = sva({
  compoundVariants: cardCompounds,
  slots: ["root", "title"],
  variants: cardVariants,
});

const join: ClassJoin = (...classNames) => classNames.join(" ");
const options: RecipesOptions = { cache: false, join };
const configured = createRecipes(options);
const chip = configured.cva({ variants: { tone: { danger: "bg-red-100" } } });

/** Joins class values, as a helper of the user's that wraps cx does. */
function classes(...inputs: readonly ClassValue[]): string {
  return cx(inputs);
}
const state: ClassDictionary = { "font-bold": true, hidden: false };

const size: VariantOption<(typeof buttonVariants)["size"]> = "sm";
const selection: VariantSelection<typeof buttonVariants, "size"> = {
  tone: "danger",
};
const render: RecipeFunction<PropsOf<typeof button>, string> = button;
const dialogSlots: readonly ComposedSlot<readonly [typeof card], "footer">[] = [
  "footer",
  "root",
  "title",
];

/** The class names of a raised card. */
function raisedCard(): SlotClassNames<"root" | "title"> {
  return card({ raised: true });
}

const buttonClassName: string = render({ ...selection, size });
const chipClassName: string = chip({ tone: "danger" });
const stateClassName: string = classes("p-2", state, ["m-1", false]);

export {
  button,
  buttonClassName,
  card,
  chip,
  chipClassName,
  classes,
  dialogSlots,
  raisedCard,
  stateClassName,
};
