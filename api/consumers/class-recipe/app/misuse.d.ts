declare const button: ((props: {
    readonly className?: string | undefined;
    readonly size?: "md" | "sm" | undefined;
    readonly tone: "danger";
}) => string) & {
    readonly variantKeys: readonly ("size" | "tone")[];
    readonly variantOptions: {
        readonly size: readonly ("md" | "sm")[];
        readonly tone: readonly "danger"[];
    };
    readonly defaultVariants: {
        readonly size: "md" | "sm";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly size: {
            readonly md: "h-10";
            readonly sm: "h-8";
        };
        readonly tone: {
            readonly danger: "bg-red-600";
        };
    }, "size", string, undefined> | undefined;
};
declare const card: NoInfer<((props?: {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
} | undefined) => Readonly<Record<"root" | "title", string>>) & {
    readonly variantKeys: readonly "raised"[];
    readonly variantOptions: {
        readonly raised: readonly ("false" | "true")[];
    };
    readonly defaultVariants: {
        readonly raised: "false" | "true";
    };
} & {
    readonly "~composition"?: import("@lynstack/class-recipe").RecipeComposition<{
        readonly raised: {
            readonly true: {
                readonly root: "shadow";
            };
        };
    }, never, string, readonly ("root" | "title")[]> | undefined;
}>;
/** Calls and configs that the types reject, one of each mistake. */
declare function misuses(): void;
export { button, card, misuses };
