import { cva } from "@lynstack/class-recipe";

export const heading = cva({
  variants: { level: { 1: "text-3xl", 2: "text-2xl" } },
});
