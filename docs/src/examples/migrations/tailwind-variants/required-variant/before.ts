import { tv } from "tailwind-variants";

export const badge = tv({
  base: "rounded px-2",
  variants: {
    tone: { info: "bg-blue-100", danger: "bg-red-100" },
  },
});
