import { cva } from "@lynstack/class-recipe";

// Conflict-free: one variant, which the component derives from its props.
export const button = cva({
  base: "inline-flex items-center rounded-md px-4 py-2",
  variants: {
    state: {
      idle: "cursor-pointer",
      loading: "cursor-wait opacity-75",
      disabled: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: { state: "idle" },
});
