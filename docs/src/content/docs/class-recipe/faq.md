---
title: class-recipe FAQ
description: "Short answers to common questions about class-recipe: tailwind-merge, required variants, common errors, Tailwind CSS v3 and v4, responsive variants, the cache on a server, use without Tailwind, and bundle size."
sidebar:
  label: FAQ
---

## Do I need tailwind-merge?

No, if your recipes are conflict-free. Yes, if a `className` that a caller
passes must replace the recipe's classes. See
[Merging classes](/recipe/class-recipe/tailwind-merge/).

## Why is my variant required?

A variant without a default is required, so a component cannot forget to
choose it. Give it a default in `defaultVariants` to make it optional. To
add no classes when a call leaves it out, declare an option without
classes, such as `none: ""`, and make it the default. A boolean variant,
whose only options are `true` and `false`, is always optional. See
[Variants](/recipe/class-recipe/variants/#required-and-default-variants).

## Why does creating a recipe throw a `TypeError`?

The config has the wrong shape, which TypeScript reports as an error too.
The message names the part to fix. The most common ones:

- The config has no `variants`. `variants` is required, even when the
  recipe has none: pass `variants: {}`.
- A compound variant gives its classes under `class`, as
  class-variance-authority and tailwind-variants do. Rename it to
  `className` in `cva`, or `classNames` in `sva`.
- Classes are an array, `false`, or `null`, or a slot recipe gets a
  string where it takes the classes of each slot.

See [cva](/recipe/class-recipe/cva/#the-config) and
[Migrating from tailwind-variants](/recipe/class-recipe/migrating-from-tailwind-variants/#configs-that-throw-without-types).

## Which merge library for Tailwind CSS v3 or v4?

On Tailwind CSS v4, use tailwind-merge v3, or `cn`. On Tailwind CSS v3,
use tailwind-merge v2: `cn` and tailwind-merge v3 support only v4. See
[Using cn](/recipe/class-recipe/tailwind-merge/#using-cn).

## Why do I get "A recipe composes only recipes created by @lynstack/recipe"?

`composes` lists something that is not a recipe of the package, or the
app installs two copies of `@lynstack/recipe`, the package that
class-recipe is built on, since each copy knows only its own recipes.
Check that the app installs one copy, with `npm ls @lynstack/recipe`, and
deduplicate it, with `npm dedupe` or your package manager's equivalent.
See [Composing recipes](/recipe/class-recipe/composing/#errors).

## Why does my interface not satisfy the type of `variants`?

TypeScript reports "Index signature for type 'string' is missing" when
you type the variants with an `interface`. An interface has no index
signature. Write the type with `type` instead. See
[Typing recipes](/recipe/class-recipe/typescript/#variants-from-a-cms-or-an-api).

## Why is `size` a type error on my input component?

`<input>` already has a `size` attribute, which is a number, so it
conflicts with a `size` variant. Remove the attribute from the props with
`Omit<ComponentProps<"input">, "size">`. The same applies to `type` and
other attribute names. See
[Building components](/recipe/class-recipe/building-components/#variant-names-that-html-also-uses).

## How do I make a variant responsive?

Put breakpoint classes in the options, such as
`two: "grid-cols-1 md:grid-cols-2"`, or declare an option for each
responsive behavior. A recipe takes one option per variant, not an option
per breakpoint. See
[Migrating from tailwind-variants](/recipe/class-recipe/migrating-from-tailwind-variants/#responsive-variants).

## How do I get a props type that includes `className`?

Use `Parameters<typeof button>[0]`, or
`VariantsOf<typeof button> & { readonly className?: string | undefined }`.
`RecipeProps<typeof button>` is a type error: `RecipeProps` takes the
parts of a config, not a recipe. See
[Typing recipes](/recipe/class-recipe/typescript/#props-that-include-classname).

## Is the cache safe on the server?

Yes. A recipe is pure, and its cache holds only the class names of
declared selections, never `className` or other props, so requests can
share it. Create recipes at the top level of a module. If the variants
come from requests and the recipe declares many combinations, turn its
cache off. See
[Frameworks and SSR](/recipe/class-recipe/frameworks/#server-rendering-and-react-server-components).

## Can I use it without Tailwind CSS?

Yes. A recipe joins any class names: CSS Modules, plain stylesheets, or
any utility framework. Only tailwind-merge is specific to Tailwind CSS,
and you need it only to resolve conflicts. See the
[overview](/recipe/class-recipe/).

## How large is it?

[Bundlephobia](https://bundlephobia.com/package/@lynstack/class-recipe)
shows its size. It ships as ES modules only, is tree-shakable, and has one
dependency, `@lynstack/recipe`.

## Next steps

- [Glossary](/recipe/class-recipe/glossary/) defines the terms these docs
  use.
- [Variants](/recipe/class-recipe/variants/) explains how a recipe reads
  its props.
