---
title: Building components with class-recipe
description: "Use recipes in React components: type their props with VariantsOf, handle variant names such as size that HTML also uses, split props, forward className and classNames, and keep results stable."
sidebar:
  label: Building components
---

The examples on this page use React; the same patterns apply to any
framework (see [Frameworks and SSR](/recipe/class-recipe/frameworks/)).

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

## Variant names that HTML also uses

An element's props may already have a prop with the name of your
variant, such as `size` on `<input>`, `type` on `<button>` and `<input>`,
or `color`, which React types on every element. The intersection of the
two types then keeps only the values that both accept. For `<input>`,
`size` is a number in HTML and `"sm" | "md"` in the recipe, so no value
satisfies both, and a call such as `<Input size="sm" />` is a type error:

```tsx
const input = cva({
  base: "rounded-md border px-3",
  variants: { size: { sm: "h-8 text-sm", md: "h-10 text-base" } },
  defaultVariants: { size: "md" },
});

type InputProps = ComponentProps<"input"> & VariantsOf<typeof input>;

<Input size="sm" />;
// Error: Type 'string' is not assignable to type 'undefined'.
```

Remove the HTML prop with `Omit` before you add the variants:

```tsx
type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantsOf<typeof input>;

export function Input({ size, className, ...props }: InputProps) {
  return <input className={input({ size, className })} {...props} />;
}

<Input size="sm" placeholder="Email" />;
```

Omit every variant name that the element also uses, such as
`Omit<ComponentProps<"button">, "type" | "color">`. Do it even when there
is no type error: `color` is a string in React, so a `color` variant
type-checks, but without `Omit` the component's type still describes the
HTML attribute.

## Split the props

The element should get its own props, but not the recipe's variants,
which are not valid HTML attributes. The simplest way is to destructure
the variants, and pass the rest to the element:

```tsx
export function Button({ tone, size, className, ...props }: ButtonProps) {
  return <button className={button({ tone, size, className })} {...props} />;
}
```

When a recipe has many variants, or a helper must work with any recipe,
use `variantKeys` instead. It lists the names of the variants, so the
component does not repeat them:

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

A recipe reads only its variants and `className`, and ignores every other
prop, so passing it all of `props` is safe.

## Forward `className` and `classNames`

Pass the component's `className` to its recipe, rather than joining it
yourself. The recipe adds it after every class of the recipe, and, with a
join such as `twMerge`, merges it with them.

A component with several elements takes `classNames`, keyed by slot
name, and passes it to its slot recipe. `SlotClasses` types it:

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

export function Card({ title, children, tone, classNames }: CardProps) {
  const classes = card({ tone, classNames });
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

## Next steps

- [Typing recipes](/recipe/class-recipe/typescript/) covers more types,
  such as a props type that includes `className`.
- [Using with shadcn/ui](/recipe/class-recipe/shadcn-ui/) converts a
  shadcn/ui component.
- [Cookbook](/recipe/class-recipe/cookbook/) has recipes for common
  components.
