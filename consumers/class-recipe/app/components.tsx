import type { ComponentProps, ReactNode } from "react";
import { cva, sva } from "@lynstack/class-recipe";
import type { PropsOf } from "@lynstack/class-recipe";

const button = cva({
  base: "inline-flex items-center",
  compoundVariants: [
    { className: "font-bold", variants: { size: "lg", tone: "danger" } },
  ],
  defaultVariants: { size: "md", tone: "neutral" },
  variants: {
    disabled: { true: "opacity-50" },
    size: { lg: "h-12", md: "h-10" },
    tone: { danger: "bg-red-600", neutral: "bg-gray-100" },
  },
});

const card = sva({
  base: { root: "rounded border", title: "font-medium" },
  slots: ["root", "title", "body"],
  variants: { raised: { true: { root: "shadow" } } },
});

type ButtonProps = ComponentProps<"button"> & PropsOf<typeof button>;

/** A button whose variants are props, next to those of the element. */
function Button({
  className,
  disabled,
  size,
  tone,
  ...props
}: ButtonProps): ReactNode {
  return (
    <button
      {...props}
      className={button({ className, disabled, size, tone })}
      disabled={disabled}
    />
  );
}

type CardProps = PropsOf<typeof card> & {
  readonly children?: ReactNode;
  readonly title: string;
};

/** A card whose slots take the class names of its caller. */
function Card({ children, title, ...variants }: CardProps): ReactNode {
  const classNames = card(variants);
  return (
    <section className={classNames.root}>
      <h2 className={classNames.title}>{title}</h2>
      <div className={classNames.body}>{children}</div>
    </section>
  );
}

/** A page that renders the components with their props. */
function Page(): ReactNode {
  return (
    <Card classNames={{ body: "grid gap-2" }} raised title="Settings">
      <Button className="w-full" tone="danger" type="submit">
        Save
      </Button>
      <Button disabled size="lg">
        Cancel
      </Button>
    </Card>
  );
}

export { Button, Card, Page };
export type { ButtonProps, CardProps };
