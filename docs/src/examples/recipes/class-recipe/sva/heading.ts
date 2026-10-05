import { sva } from "@lynstack/class-recipe";

export const heading = sva({
  slots: ["root", "anchor"],
  base: { anchor: "opacity-0" },
  variants: {
    level: { 1: { root: "text-3xl" }, 2: { root: "text-2xl" } },
  },
});
