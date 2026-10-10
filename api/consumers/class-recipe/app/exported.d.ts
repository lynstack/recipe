import type { VariantsOf } from "@lynstack/class-recipe";
declare const look: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"root", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root"> | undefined;
    readonly size: "md" | "sm";
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly size: {
        readonly md: {
            readonly root: "h-8";
        };
        readonly sm: {
            readonly root: "h-6";
        };
    };
}, never, string, readonly "root"[]>>>;
type LookVariants = VariantsOf<typeof look>;
export { look };
export type { LookVariants };
