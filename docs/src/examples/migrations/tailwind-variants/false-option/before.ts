import { tv } from "tailwind-variants";

export const stack = tv({
  base: "flex",
  variants: {
    gap: { false: "gap-4", tight: "gap-1" },
  },
});
