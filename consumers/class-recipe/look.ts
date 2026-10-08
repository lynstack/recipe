import type { VariantsOf } from "@lynstack/class-recipe";
import { sva } from "@lynstack/class-recipe";

const look = sva({
  base: { root: "border" },
  slots: ["root"],
  variants: { size: { md: { root: "h-8" }, sm: { root: "h-6" } } },
});

type LookVariants = VariantsOf<typeof look>;

export { look };
export type { LookVariants };
