import { cva } from "@lynstack/class-recipe";

export const input = cva({
  base: "rounded border",
  variants: {
    disabled: { true: "opacity-50", false: "cursor-text" },
  },
});
