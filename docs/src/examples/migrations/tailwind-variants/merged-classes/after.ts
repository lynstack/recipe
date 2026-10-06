import { cva } from "@lynstack/class-recipe";

export const card = cva({
  base: "rounded-lg p-4",
  variants: {
    size: { sm: "p-2", md: "" },
  },
});
