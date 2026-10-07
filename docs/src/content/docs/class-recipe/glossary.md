---
title: class-recipe glossary
description: "Plain definitions of the terms the class-recipe docs use: recipe, slot recipe, variant, option, selection, default, compound variant, slot, join, override, conflict, and cache."
sidebar:
  label: Glossary
---

The terms that the class-recipe docs use, in plain words.

## Recipe

A function that `cva` creates from a config. You call it with the props
of a component, and it returns the class name of one element. See
[cva](/recipe/class-recipe/cva/).

## Slot recipe

A function that `sva` creates from a config. You call it with the props
of a component, and it returns an object with the class name of each of
its slots. See [sva](/recipe/class-recipe/sva/).

## Slot

One element of a component made of several elements, such as the root,
the header, and the body of a card. A slot recipe names its slots in
`slots`. See [sva](/recipe/class-recipe/sva/).

## Variant

A prop that changes how an element looks, such as `tone` or `size`. A
config lists the variants in `variants`. See
[Variants](/recipe/class-recipe/variants/).

## Option

One value of a variant, such as `"sm"` or `"md"` for `size`. The config
gives the classes of each option. See
[Variants](/recipe/class-recipe/variants/).

## Selection

The object you pass to a recipe, such as `{ tone: "danger", size: "sm" }`.
It chooses an option for some or all of the variants. See
[Variants](/recipe/class-recipe/variants/).

## Default variant

The option that a variant uses when a selection leaves it out. You set it
in `defaultVariants`. See
[Required and default variants](/recipe/class-recipe/variants/#required-and-default-variants).

## Required variant

A variant without a default. TypeScript reports an error when a call
leaves it out. See
[Required and default variants](/recipe/class-recipe/variants/#required-and-default-variants).

## Boolean variant

A variant whose only options are `true` and `false`. It is optional and
`false` by default. See
[Boolean variants](/recipe/class-recipe/variants/#boolean-variants).

## Compound variant

Classes that a recipe adds only when several variants have particular
options at the same time. It has the shape
`{ variants: { ... }, className }`, or `{ variants: { ... }, classNames }`
in a slot recipe. See
[Compound variants](/recipe/class-recipe/variants/#compound-variants).

## Join

The function that turns the classes of a selection into one class name.
The default join, `cx`, keeps every class. A join such as `twMerge` also
removes the classes that conflict. See
[Merging classes](/recipe/class-recipe/tailwind-merge/).

## `className` override

Classes that a call passes in `className`, or in `classNames` for a slot
recipe. The recipe adds them after all of its own classes. With the
default join, it never removes a class. See
[How it works](/recipe/class-recipe/how-it-works/#overrides).

## Conflict

Two classes on one element that set the same CSS property, such as `px-4`
and `px-2`. Then the class defined later in the stylesheet wins, not the
class that comes later in the class name. See
[Writing conflict-free recipes](/recipe/class-recipe/conflict-free-recipes/).

## Cache

Where a recipe stores the class name of each selection after it builds
it once. A later call with the same variants returns the stored class
name. See [How it works](/recipe/class-recipe/how-it-works/).
