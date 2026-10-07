import { cva } from "@lynstack/class-recipe";

import { button } from "./button.ts";

export const iconButton = cva({
  composes: [button],
  base: "justify-center",
  variants: {
    size: { sm: "w-8", md: "w-10" },
  },
});
