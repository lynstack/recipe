---
title: Building components with class-recipe
description: "Use recipes in React components: type their props with VariantsOf, split props with variantKeys, forward className and classNames, and keep results stable."
sidebar:
  label: Building components
---

The examples on this page use React; the same patterns apply to any
framework.

## Type the props from the recipe

`VariantsOf` returns the variants a recipe accepts, so a component's props
follow the recipe as it changes:

```tsx
import { cva, type VariantsOf } from "@lynstack/class-recipe";
import type { ComponentProps } from "react";

const button = cva({
  base: "inline-flex rounded-md",
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});

type ButtonProps = ComponentProps<"button"> & VariantsOf<typeof button>;
// VariantsOf<typeof button> is
// { readonly tone: "neutral" | "danger"; readonly size?: "sm" | "md" | undefined }
```

A variant without a default is required in the props too, so every use of
`Button` must choose its tone.

## Split props with `variantKeys`

A recipe reads only its variants and `className`, so it can take every
prop of the component. The element it styles should not get the variants,
though. `variantKeys` lists them, so the component does not repeat their
names:

```tsx
export function Button({ className, ...props }: ButtonProps) {
  const buttonProps: Partial<typeof props> = { ...props };
  for (const key of button.variantKeys) {
    delete buttonProps[key];
  }
  return (
    <button {...buttonProps} className={button({ ...props, className })} />
  );
}
```

## Forward `className` and `classNames`

Pass the component's `className` to its recipe, which adds it after every
class of the recipe. A component with several elements takes `classNames`,
keyed by slot name, and passes it to its slot recipe:

```tsx
import { sva, type SlotClasses, type VariantsOf } from "@lynstack/class-recipe";
import type { ReactNode } from "react";

const card = sva({
  slots: ["root", "title"],
  base: { root: "rounded-lg border p-4", title: "font-semibold" },
  variants: { tone: { plain: {}, muted: { root: "bg-gray-50" } } },
  defaultVariants: { tone: "plain" },
});

type CardProps = VariantsOf<typeof card> & {
  readonly title: ReactNode;
  readonly children: ReactNode;
  readonly classNames?: SlotClasses<"root" | "title">;
};

export function Card({ title, children, ...props }: CardProps) {
  const classes = card(props);
  return (
    <section className={classes.root}>
      <h2 className={classes.title}>{title}</h2>
      {children}
    </section>
  );
}
```

With the default join, these classes are added, not substituted, so use
them for properties the recipe does not set, such as margins and widths
(see [How it works](/recipe/class-recipe/how-it-works/#overrides)).

## Keep results stable

A slot recipe returns the same frozen object for the same variants, so
passing its result, or one of its class names, to a memoized child keeps
that child from rendering again. A recipe returns the same string. Create
recipes at the top level of a module, never inside a component, so that
their cache lasts across renders.
