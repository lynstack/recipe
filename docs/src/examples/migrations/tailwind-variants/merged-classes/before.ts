import { tv } from "tailwind-variants";

export const card = tv({
  base: "rounded-lg p-4",
  variants: {
    size: { sm: "p-2", md: "" },
  },
});
