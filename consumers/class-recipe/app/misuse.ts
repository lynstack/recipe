import { cva, sva } from "@lynstack/class-recipe";

const button = cva({
  defaultVariants: { size: "md" },
  variants: {
    size: { md: "h-10", sm: "h-8" },
    tone: { danger: "bg-red-600" },
  },
});
const card = sva({
  slots: ["root", "title"],
  variants: { raised: { true: { root: "shadow" } } },
});

const declared = {
  defaultVariants: { size: "lg" },
  variants: { size: { md: "h-10" } },
} as const;

/** Calls and configs that the types reject, one of each mistake. */
function misuses(): void {
  // @ts-expect-error: tone has no default, so a call must name it.
  button({ size: "sm" });
  // @ts-expect-error: size has no option xl.
  button({ size: "xl", tone: "danger" });
  // @ts-expect-error: the recipe has no variant named shape.
  button({ shape: "round", tone: "danger" });
  // @ts-expect-error: the card has no slot named footer.
  card({ classNames: { footer: "p-2" } });
  // @ts-expect-error: the default names an option that size lacks.
  cva({ defaultVariants: { size: "lg" }, variants: { size: { md: "h-10" } } });
  // @ts-expect-error: a declared config whose default size lacks.
  cva(declared);
  cva({
    // @ts-expect-error: the compound variant names an option that size lacks.
    compoundVariants: [{ className: "p-1", variants: { size: "lg" } }],
    variants: { size: { md: "h-10" } },
  });
  // @ts-expect-error: the classes of an option are a string.
  cva({ variants: { size: { md: 10 } } });
  // @ts-expect-error: an option styles only the slots of the recipe.
  sva({ slots: ["root"], variants: { size: { md: { title: "text-lg" } } } });
  // @ts-expect-error: a recipe composes recipes, not slot recipes.
  cva({ composes: [card], variants: {} });
}

export { button, card, misuses };
