import { tv } from "tailwind-variants";

export const label = tv({
  variants: {
    tone: { plain: "", muted: "text-gray-500" },
  },
  defaultVariants: { tone: "plain" },
});
