import type { ComponentProps, ReactNode } from "react";
import type { PropsOf } from "@lynstack/class-recipe";
declare const button: import("@lynstack/class-recipe").Recipe<{
    readonly className?: string | undefined;
    readonly disabled?: "false" | "true" | boolean | undefined;
    readonly size?: "lg" | "md" | undefined;
    readonly tone?: "danger" | "neutral" | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly disabled: {
        readonly true: "opacity-50";
    };
    readonly size: {
        readonly lg: "h-12";
        readonly md: "h-10";
    };
    readonly tone: {
        readonly danger: "bg-red-600";
        readonly neutral: "bg-gray-100";
    };
}, "size" | "tone", string, undefined>>;
declare const card: NoInfer<import("@lynstack/class-recipe").SlotRecipe<"body" | "root" | "title", {
    readonly classNames?: import("@lynstack/class-recipe").SlotClasses<"body" | "root" | "title"> | undefined;
    readonly raised?: "false" | "true" | boolean | undefined;
}, import("@lynstack/class-recipe").RecipeComposition<{
    readonly raised: {
        readonly true: {
            readonly root: "shadow";
        };
    };
}, never, string, readonly ("body" | "root" | "title")[]>>>;
type ButtonProps = ComponentProps<"button"> & PropsOf<typeof button>;
/** A button whose variants are props, next to those of the element. */
declare function Button({ className, disabled, size, tone, ...props }: ButtonProps): ReactNode;
type CardProps = PropsOf<typeof card> & {
    readonly children?: ReactNode;
    readonly title: string;
};
/** A card whose slots take the class names of its caller. */
declare function Card({ children, title, ...variants }: CardProps): ReactNode;
/** A page that renders the components with their props. */
declare function Page(): ReactNode;
export { Button, Card, Page };
export type { ButtonProps, CardProps };
