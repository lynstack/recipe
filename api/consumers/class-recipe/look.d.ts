import type { VariantsOf } from "@lynstack/class-recipe";
declare const look: NoInfer<((props: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root"> | undefined;
    readonly size: "md" | "sm";
}) => Readonly<Record<"root", string>>) & {
    readonly variantKeys: readonly "size"[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
    };
    readonly defaultVariants: {};
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: {
                readonly root: "h-8";
            };
            readonly sm: {
                readonly root: "h-6";
            };
        };
    }, never, string, readonly "root"[]> | undefined;
}>;
type LookVariants = VariantsOf<typeof look>;
export { look };
export type { LookVariants };
