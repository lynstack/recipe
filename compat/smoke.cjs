const { cx } = require("@lynstack/class-recipe");
const { createStyleRecipe } = require("@lynstack/native-recipe");
const { createRecipeKind } = require("@lynstack/recipe");

const box = createStyleRecipe({ base: { padding: 4 }, variants: {} });

const checks = [
  [cx("a", { b: true }), "a b"],
  [JSON.stringify(box()), '{"padding":4}'],
  [typeof createRecipeKind, "function"],
];

for (const [actual, expected] of checks) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

console.log(`${checks.length} checks passed`);
