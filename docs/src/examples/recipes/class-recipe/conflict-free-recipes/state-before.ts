import { cva } from "@lynstack/class-recipe";

// Conflicting: loading and disabled both set the cursor and the opacity.
export const button = cva({
  base: "inline-flex items-center rounded-md px-4 py-2",
  variants: {
    loading: { true: "cursor-wait opacity-75" },
    disabled: { true: "cursor-not-allowed opacity-50" },
  },
});
