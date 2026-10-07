import { cva, cx, sva } from "@lynstack/class-recipe";
import { createStyleRecipe } from "@lynstack/native-recipe";
import { createRecipeKind } from "@lynstack/recipe";

const styleRecipe = createRecipeKind({
  initial: (base) => ({ ...base }),
  reduce: (style, value) => Object.assign(style, value),
  finish: (style) => style,
});

const text = styleRecipe({
  base: { color: "black" },
  variants: { size: { sm: { fontSize: 12 }, lg: { fontSize: 24 } } },
  defaultVariants: { size: "sm" },
});

const button = cva({
  base: "btn",
  variants: { size: { sm: "text-sm", lg: "text-lg" } },
  compoundVariants: [{ variants: { size: "lg" }, className: "font-bold" }],
  defaultVariants: { size: "sm" },
});

const card = sva({
  slots: ["root", "title"],
  base: { root: "card", title: "card-title" },
  variants: { tone: { dark: { root: "bg-black", title: "text-white" } } },
});

const box = createStyleRecipe({
  base: { padding: 4 },
  variants: { wide: { true: { width: 100 } } },
});

const checks = [
  [cx("a", { b: true, c: false }, ["d", null]), "a b d"],
  [button(), "btn text-sm"],
  [button({ size: "lg" }), "btn text-lg font-bold"],
  [card({ tone: "dark" }).title, "card-title text-white"],
  [JSON.stringify(text({ size: "lg" })), '{"color":"black","fontSize":24}'],
  [JSON.stringify(box({ wide: true })), '{"padding":4,"width":100}'],
];

for (const [actual, expected] of checks) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

console.log(`${checks.length} checks passed`);
