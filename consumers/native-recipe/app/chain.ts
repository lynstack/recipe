import { createSlotStyleRecipe } from "@lynstack/native-recipe";

// Each level composes the one before, as a component library's recipes do.
const level0 = createSlotStyleRecipe({
  slots: ["root"],
  variants: {
    size: { md: { root: { height: 32 } }, sm: { root: { height: 24 } } },
  },
});
const level1 = createSlotStyleRecipe({
  composes: [level0],
  slots: ["icon"],
  variants: { tone: { danger: { icon: { opacity: 1 } } } },
});
const level2 = createSlotStyleRecipe({
  composes: [level1],
  slots: ["label"],
  variants: { weight: { bold: { label: { fontWeight: "700" } } } },
});
const level3 = createSlotStyleRecipe({
  composes: [level2],
  slots: ["badge"],
  variants: { shape: { round: { badge: { borderRadius: 999 } } } },
});
const level4 = createSlotStyleRecipe({
  composes: [level3],
  slots: ["hint"],
  variants: { muted: { true: { hint: { opacity: 0.5 } } } },
});

export { level0, level1, level2, level3, level4 };
