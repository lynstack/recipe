import { cva } from "class-variance-authority";

export const badge = cva("rounded px-2", {
  variants: {
    tone: { info: "bg-blue-100", danger: "bg-red-100" },
  },
});
