import { cva } from "@lynstack/class-recipe";

export const label = cva({
  variants: {
    tone: { plain: "", muted: "text-gray-500" },
  },
  defaultVariants: { tone: "plain" },
});
