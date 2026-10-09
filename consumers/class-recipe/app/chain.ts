import { sva } from "@lynstack/class-recipe";

// Each level composes the one before, as a component library's recipes do.
const level0 = sva({
  slots: ["root"],
  variants: { size: { md: { root: "h-8" }, sm: { root: "h-6" } } },
});
const level1 = sva({
  composes: [level0],
  slots: ["icon"],
  variants: { tone: { danger: { icon: "text-red-700" } } },
});
const level2 = sva({
  composes: [level1],
  slots: ["label"],
  variants: { weight: { bold: { label: "font-bold" } } },
});
const level3 = sva({
  composes: [level2],
  slots: ["badge"],
  variants: { shape: { round: { badge: "rounded-full" } } },
});
const level4 = sva({
  composes: [level3],
  slots: ["hint"],
  variants: { muted: { true: { hint: "opacity-50" } } },
});

export { level0, level1, level2, level3, level4 };
